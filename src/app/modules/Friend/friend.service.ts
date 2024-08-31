import { JwtPayload } from 'jsonwebtoken';
import { IFriend } from './friend.interface';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { Friend } from './friend.model';
import { User } from '../User/user.model';

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
    senderId: user?.userId, // The sender of the request
    recipientId: payload?.recipientId, // The recipient of the request
    status: 'pending', // Ensure the request is still pending
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
  const friendRequests = await Friend.find({
    senderId: user?.userId,
    status: 'pending',
  });

  const userIds = friendRequests?.map((request) => request?.recipientId);

  return User.find({ _id: { $in: userIds } });
};

const getAllReceivedFriendRequestsFromDB = async (user: JwtPayload) => {
  const friendRequests = await Friend.find({
    recipientId: user?.userId,
    status: 'pending',
  });
  const userIds = friendRequests.map((request) => request.senderId);

  return User.find({ _id: { $in: userIds } });
};

export const FriendServices = {
  sendFriendRequestToDB,
  cancelFriendRequestToDB,
  acceptFriendRequestToDB,
  getAllSentFriendRequestsFromDB,
  getAllReceivedFriendRequestsFromDB,
};
