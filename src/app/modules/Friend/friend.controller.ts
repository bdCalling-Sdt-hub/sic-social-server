import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FriendServices } from './friend.service';

const sendFriendRequest = catchAsync(async (req, res) => {
  const result = await FriendServices.sendFriendRequestToDB(
    req?.user,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
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

export const FriendControllers = {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  getAllReceivedFriendRequests,
  getAllSentFriendRequests,
};
