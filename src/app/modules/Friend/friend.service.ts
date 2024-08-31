import { JwtPayload } from 'jsonwebtoken';
import { IFriend } from './friend.interface';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { Friend } from './friend.model';
import { User } from '../User/user.model';

const sendFriendRequestToDB = async (user: JwtPayload, payload: IFriend) => {
  const targetUser = await User.findById(payload?.friendId);

  // Check if the user or targer exists
  if (!targetUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Target user does not exist!');
  }

  // Check if a friend request or friendship already exists
  const existingRequest = await Friend.findOne({
    $or: [
      { userId: user?.userId, friendId: payload?.friendId }, // Sent request
      { userId: payload?.friendId, friendId: user?.userId }, // Received request
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
    userId: user?.userId,
    friendId: payload?.friendId,
    status: 'pending',
  });

  await friendRequest.save();
};

const acceptFriendRequestToDB = async (user: JwtPayload, payload: IFriend) => {
  const targetUser = await User.findById(payload?.friendId);

  // Check if the user or targer exists
  if (!targetUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Target user does not exist!');
  }

  // Find the friend request by ID and ensure it is pending
  const friendRequest = await Friend.findOne({
    _id: user?.userId,
    friendId: payload?.friendId,
    status: 'pending',
  });

  if (!friendRequest) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Friend request not found or already processed.',
    );
  }

  // Update the status to 'accepted'
  friendRequest.status = 'accepted';
  await friendRequest.save();
};

export const FriendServices = {
  sendFriendRequestToDB,
  acceptFriendRequestToDB,
};
