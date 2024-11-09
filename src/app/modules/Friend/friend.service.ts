import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../errors/ApiError';
import { Chat } from '../chat/chat.model';
import { Message } from '../message/message.model';
import { User } from '../User/user.model';
import { IFriend } from './friend.interface';
import { Friend } from './friend.model';

const getFriendSuggestionsFromDB = async (user: JwtPayload) => {
  // Step 1: Find the current user's details
  const userDetails = await User.findById(user?.userId);

  // Step 2: Find users with similar interests, excluding the current user
  const usersWithSimilarInterests = await User.find({
    interests: { $in: userDetails?.interests },
    _id: { $ne: user?.userId }, // Exclude the current user
  }).select('fullName avatar bio email');

  // Step 3: Find friend requests with 'accepted' or 'pending' status where the current user is involved
  const friendRequests = await Friend.find({
    $or: [{ senderId: user?.userId }, { recipientId: user?.userId }],
    status: { $in: ['accepted', 'pending'] },
  });

  // Step 4: Collect IDs of users involved in these friend requests with 'accepted' or 'pending' status
  const excludedUserIds = new Set(
    friendRequests.flatMap((request) => [
      request.senderId.toString(),
      request.recipientId.toString(),
    ]),
  );

  // Step 5: Filter out users who have any 'accepted' or 'pending' requests with the current user
  const suggestions = usersWithSimilarInterests.filter(
    (potentialFriend) => !excludedUserIds.has(potentialFriend._id.toString()),
  );

  // Step 6: Add friend count for each suggested user
  const usersWithFriendCount = await Promise.all(
    suggestions.map(async (user) => ({
      ...user.toObject(),
      totalFriends: await Friend.countDocuments({
        recipientId: user._id,
        status: 'accepted',
      }),
    })),
  );

  return usersWithFriendCount;
};

const sendFriendRequestToDB = async (user: JwtPayload, payload: IFriend) => {
  if (user?.userId === payload?.recipientId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You cannot send a friend request to yourself!',
    );
  }

  const targetUser = await User.findById(payload?.recipientId);

  if (!targetUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Target user does not exist!');
  }

  // Check if a friend request or friendship already exists
  const existingRequest = await Friend.findOne({
    $or: [
      { senderId: user?.userId, recipientId: payload?.recipientId },
      { senderId: payload?.recipientId, recipientId: user?.userId },
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
  const friendRequest = await Friend.findOneAndDelete({
    senderId: user?.userId,
    recipientId: payload?.recipientId,
    status: 'pending',
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
  payload: { senderId: string },
) => {
  // console.log(user, payload);
  const friendRequest = await Friend.findOneAndDelete({
    $or: [
      { senderId: user?.userId, recipientId: payload?.senderId },
      { senderId: payload?.senderId, recipientId: user?.userId },
    ],
    status: 'accepted',
  });

  // console.log(friendRequest);

  if (!friendRequest) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Friendship not found or already removed!',
    );
  }
};

const acceptFriendRequestToDB = async (
  user: JwtPayload,
  payload: { senderId: string },
) => {
  const friendRequest = await Friend.findOne({
    senderId: payload?.senderId,
    recipientId: user?.userId,
    status: 'pending',
  });

  if (!friendRequest) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Friend request not found or already processed!',
    );
  }

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
    'fullName avatar bio email',
  );
};

const getAllReceivedFriendRequestsFromDB = async (user: JwtPayload) => {
  const receivedRequests = await Friend.find({
    recipientId: user?.userId,
    status: 'pending',
  });

  const userIds = receivedRequests?.map((request) => request?.senderId);

  const existingFriends = await User.find({ _id: { $in: userIds } }).select(
    'fullName avatar bio email',
  );

  const usersWithFriendCount = await Promise.all(
    existingFriends.map(async (user) => ({
      ...user?.toObject(),
      totalFriends: await Friend.countDocuments({
        recipientId: user._id,
        status: 'accepted',
      }),
    })),
  );

  return usersWithFriendCount;
};

const getFriendsListFromDB = async (user: JwtPayload) => {
  const friendRequests = await Friend.find({
    $or: [
      { senderId: user?.userId, status: 'accepted' },
      { recipientId: user?.userId, status: 'accepted' },
    ],
  });

  const friendUserIds = friendRequests.map((request) =>
    request.senderId.toString() === user.userId
      ? request.recipientId
      : request.senderId,
  );

  return await User.find({ _id: { $in: friendUserIds } }).select(
    'fullName avatar',
  );
};

const friendProfileFromDB = async (id: string, user: JwtPayload) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Friend ID');
  console.log(id);
  const [friend, totalFriends, isFriend] = await Promise.all([
    User.findById(id)
      .select('instagramUrl bio email fullName avatar instagramUrl')
      .lean(),
    Friend.countDocuments({ recipientId: id, status: 'accepted' }),
    Friend.findOne({
      $or: [
        { senderId: user.userId, recipientId: id },
        { senderId: id, recipientId: user.userId },
      ],
    }).select('status senderId'),
  ]);

  const chatQuery = { participants: { $in: [id] } };
  if (!isFriend) {
    chatQuery.type = 'public';
  }

  const chat = await Chat.find(chatQuery).populate({
    path: 'participants',
    select: 'fullName avatar',
  });

  const filters = await Promise.all(
    chat.map(async (conversation) => {
      const data = conversation.toObject();
      const lastMessage = await Message.findOne({
        chatId: conversation._id,
      })
        .populate({ path: 'sender', select: 'fullName' })
        .sort({ createdAt: -1 })
        .select('message createdAt audio image text path');
      return {
        ...data,
        lastMessage: lastMessage || {},
      };
    }),
  );

  if (!friend) return {};

  return {
    ...friend,
    totalFriend: totalFriends || 0,
    isFriend: isFriend,
    chats: filters || [],
  };
};

export const FriendServices = {
  getFriendSuggestionsFromDB,
  sendFriendRequestToDB,
  cancelFriendRequestToDB,
  removeFriendFromDB,
  acceptFriendRequestToDB,
  getAllSentFriendRequestsFromDB,
  getAllReceivedFriendRequestsFromDB,
  getFriendsListFromDB,
  friendProfileFromDB,
};
