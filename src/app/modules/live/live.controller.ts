import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LiveServices } from './live.service';

const getLiveById = catchAsync(async (req, res) => {
  // Check that role and chatId are provided
  if (!req?.params?.id) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'live not found',
    });
  }

  const liveChat = await LiveServices.getToLiveBd(req?.params?.id);

  // Send response with the generated token
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Live chat created successfully',
    data: liveChat,
  });
});
const createNewLive = catchAsync(async (req, res) => {
  const { role, chatId, book, name } = req.body;

  // Check that role and chatId are provided
  if (!role || !chatId || !book) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Role and chatId or Book are required',
    });
  }

  const liveChat = await LiveServices.addLiveToDB(
    chatId,
    role,
    book,
    name,
    req.user.userId,
  );

  // Send response with the generated token
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Live chat created successfully',
    data: liveChat,
  });
});

const checkAndRegenerateToken = catchAsync(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Role and chatId are required',
    });
  }

  const token = await LiveServices.liveJoin(chatId, req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Token generated successfully',
    data: token,
  });
});

const givePermissionRole = catchAsync(async (req, res) => {
  const { role, chatId, userId } = req.body;

  if (!role || !chatId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Role and chatId are required',
    });
  }

  const token = await LiveServices.updateRole(chatId, role, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Token generated successfully',
    data: token,
  });
});
const requestRole = catchAsync(async (req, res) => {
  const { chatId, userId, message } = req.body;

  if (!userId || !chatId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Role and chatId are required',
    });
  }

  const token = await LiveServices.roleRequest(chatId, userId, message);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Token generated successfully',
    data: token,
  });
});
const removeUser = catchAsync(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Role and chatId are required',
    });
  }

  const result = await LiveServices.removeUserFormDB(chatId, req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Token generated successfully',
    data: result,
  });
});
const liveUpdate = catchAsync(async (req, res) => {
  const result = await LiveServices.updateLiveDB(req.body, req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Token generated successfully',
    data: result,
  });
});

export const LiveController = {
  getLiveById,
  createNewLive,
  checkAndRegenerateToken,
  givePermissionRole,
  requestRole,
  removeUser,
  liveUpdate,
};
