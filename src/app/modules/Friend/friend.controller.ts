import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FriendServices } from './friend.service';

const getFriendSuggestions = catchAsync(async (req, res) => {
  const result = await FriendServices.getFriendSuggestionsFromDB(req?.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend suggestions retrieved successfully!',
    data: result,
  });
});

const sendFriendRequest = catchAsync(async (req, res) => {
  const result = await FriendServices.sendFriendRequestToDB(
    req?.user,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend request sent successfully!',
    data: result,
  });
});

const cancelFriendRequest = catchAsync(async (req, res) => {
  const result = await FriendServices.cancelFriendRequestToDB(
    req?.user,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend request canceled successfully!',
    data: result,
  });
});

const removeFriend = catchAsync(async (req, res) => {
  const result = await FriendServices.removeFriendFromDB(req?.user, req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend removed successfully!',
    data: result,
  });
});

const acceptFriendRequest = catchAsync(async (req, res) => {
  const result = await FriendServices.acceptFriendRequestToDB(
    req?.user,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend request accepted successfully!',
    data: result,
  });
});

const getAllReceivedFriendRequests = catchAsync(async (req, res) => {
  const result = await FriendServices.getAllReceivedFriendRequestsFromDB(
    req?.user,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Received friend requests retrieved successfully!',
    data: result,
  });
});

const getAllSentFriendRequests = catchAsync(async (req, res) => {
  const result = await FriendServices.getAllSentFriendRequestsFromDB(req?.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sent friend requests retrieved successfully!',
    data: result,
  });
});

const getFriendsList = catchAsync(async (req, res) => {
  const result = await FriendServices.getFriendsListFromDB(req?.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Friend list retrieved successfully!',
    data: result,
  });
});

export const FriendControllers = {
  getFriendSuggestions,
  sendFriendRequest,
  cancelFriendRequest,
  removeFriend,
  acceptFriendRequest,
  getAllReceivedFriendRequests,
  getAllSentFriendRequests,
  getFriendsList,
};
