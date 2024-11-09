import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { User } from '../User/user.model';
import { IFriend } from './friend.interface';
import { Friend } from './friend.model';
import mongoose from 'mongoose';
import { Chat } from '../chat/chat.model';

const getFriendSuggestionsFromDB = async (user: JwtPayload) => {
  // Step 1: Find all users with similar interests excluding the current user

  const userDetails = await User.findById(user?.userId);
  const usersWithSimilarInterests = await User.find({
    interests: { $in: userDetails?.interests },
    _id: { $ne: user?.userId }, // Exclude the current user
  }).select('fullName avatar bio email');

  // Step 2: Find all friend requests where the current user is involved
  const friendRequests = await Friend.find({
    $or: [{ senderId: user?.userId }, { recipientId: user?.userId }],
  });

  // Step 3: Extract user IDs of all friends and pending requests
  const friendUserIds = new Set(
    friendRequests?.flatMap((request) => [
      request?.senderId,
      request?.recipientId,
    ]),
  );

  // Step 4: Filter out users who have already received a friend request or are friends
  const suggestions = usersWithSimilarInterests.filter(
    (potentialFriend) => !friendUserIds?.has(potentialFriend?._id),
  );
  const usersWithFriendCount = await Promise.all(
    suggestions?.map(async (user) => ({
      ...user?.toObject(),
      totalFriends: await Friend.countDocuments({
        recipientId: user?._id,
        status: 'accepted',
      }),
    })),
  );
  return usersWithFriendCount;
};

const sendFriendRequestToDB = async (user: JwtPayload, payload: IFriend) => {
  // Check if the user is trying to send a friend request to themselves
  if (user?.userId === payload?.recipientId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You cannot send a friend request to yourself!',
    );
  }

  const targetUser = await User.findById(payload?.recipientId);

  // Check if the user or targer exists
  if (!targetUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Target user does not exist!');
  }

  // Check if a friend request or friendship already exists
  const existingRequest = await Friend.findOne({
    $or: [
      { senderId: user?.userId, recipientId: payload?.recipientId }, // Sent request
      { senderId: payload?.recipientId, recipientId: user?.userId }, // Received request
    ],
  });

  if (existingRequest) {
    if (existingRequest?.status === 'pending') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Friend request already sent and is pending!',
      );
    } else if (existingRequest?.status === 'accepted') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'You are already friends with this user!',
      );
    }
  }

  // Create a new friend request
  const friendRequest = new Friend({
    senderId: user?.userId,
    recipientId: payload?.recipientId,
    status: 'pending',
  });

  await friendRequest.save();
};

const cancelFriendRequestToDB = async (
  user: JwtPayload,
  payload: { recipientId: string },
) => {
  // Find and delete the friend request where the current user is the sender
  const friendRequest = await Friend.findOneAndDelete({
    $or: [
      { senderId: user?.userId, recipientId: payload?.recipientId },
      { senderId: payload?.recipientId, recipientId: user?.userId },
    ],
    status: 'pending', // Ensure the request is still pending
  });

  if (!friendRequest) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Friend request not found or already processed!',
    );
  }
};

const removeFriendFromDB = async (
  user: JwtPayload,
  payload: { recipientId: string },
) => {
  // Find and delete the friend request where the current user is the sender
  const friendRequest = await Friend.findOneAndDelete({
    $or: [
      { senderId: user?.userId, recipientId: payload?.recipientId },
      { senderId: payload?.recipientId, recipientId: user?.userId },
    ],
    status: 'approved', // Ensure the request is still pending
  });

  if (!friendRequest) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Friend request not found or already processed!',
    );
  }
};

const acceptFriendRequestToDB = async (
  user: JwtPayload,
  payload: { senderId: string },
) => {
  const senderUser = await User.findById(user?.userId);

  // Check if the user or targer exists
  if (!senderUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sender user does not exist!');
  }

  // Find the friend request by ID and ensure it is pending
  const friendRequest = await Friend.findOne({
    senderId: payload?.senderId, // Sent request
    recipientId: user?.userId, // Received request
    status: 'pending',
  });

  if (!friendRequest) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Friend request not found or already processed!',
    );
  }

  // Update the status to 'accepted'
  friendRequest.status = 'accepted';
  await friendRequest.save();
};

const getAllSentFriendRequestsFromDB = async (user: JwtPayload) => {
  const sentRequests = await Friend.find({
    senderId: user?.userId,
    status: 'pending',
  });

  const userIds = sentRequests?.map((request) => request?.recipientId);

  return await User.find({ _id: { $in: userIds } }).select(
    'fullName avatar  bio email',
  );
};

const getAllReceivedFriendRequestsFromDB = async (user: JwtPayload) => {
  const receivedRequests = await Friend.find({
    recipientId: user?.userId,
    status: 'pending',
  }).populate('status');

  const userIds = receivedRequests?.map((request) => request?.senderId);

  const existingFriends = await User.find({ _id: { $in: userIds } }).select(
    'fullName avatar bio email',
  );

  // Fetch total friend count for each user in parallel
  const usersWithFriendCount = await Promise.all(
    existingFriends?.map(async (user) => ({
      ...user?.toObject(),
      totalFriends: await Friend.getTotalFriendsCount(user?._id?.toString()),
    })),
  );

  return usersWithFriendCount;
};

const getFriendsListFromDB = async (user: JwtPayload) => {
  // Fetch all friend requests that involve the user and have been accepted
  const friendRequests = await Friend.find({
    $or: [
      { senderId: user?.userId, status: 'accepted' },
      { recipientId: user?.userId, status: 'accepted' },
    ],
  });

  // Extract the IDs of friends dynamically depending on the user's role in the request
  const friendUserIds = friendRequests?.map((request) => {
    // If the user is the sender, the friend is the recipient
    if (request?.senderId?.toString() === user?.userId) {
      return request?.recipientId;
    }
    // If the user is the recipient, the friend is the sender
    return request?.senderId;
  });

  // Fetch the user documents of all friends
  return await User.find({ _id: { $in: friendUserIds } }).select(
    'fullName avatar',
  );
};

const friendProfileFromDB = async(id: string, user: JwtPayload) =>{

  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Friend ID");

  const [friend, totalFriends, isFriend, chats] = await Promise.all([
    User.findById(id).select("instagramUrl bio email fullName").lean(),
    Friend.countDocuments({ recipientId: id, status: "accepted" }),
    Friend.findOne({ recipientId: user.userId, senderId: id }).select("status")
    ,
    Chat.find({ participants: {$in : [id]}, type: "public"}) // here participants is array on this array if the id include then query will match also type must be public
  ]);

  if(!friend) return {};

  const data = {
    ...friend,
    totalFriend: totalFriends || 0,
    isFriend: Boolean(isFriend),
    chats
  }

  return data;
}

export const FriendServices = {
  getFriendSuggestionsFromDB,
  sendFriendRequestToDB,
  cancelFriendRequestToDB,
  removeFriendFromDB,
  acceptFriendRequestToDB,
  getAllSentFriendRequestsFromDB,
  getAllReceivedFriendRequestsFromDB,
  getFriendsListFromDB,
  friendProfileFromDB
};
