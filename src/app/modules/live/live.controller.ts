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
  const { role, chatId } = req.body;

  // Check that role and chatId are provided
  if (!role || !chatId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Role and chatId are required',
    });
  }

  const liveChat = await LiveServices.addLiveToDB(
    chatId,
    role,
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
  const { role, chatId } = req.body;

  if (!role || !chatId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Role and chatId are required',
    });
  }

  const token = await LiveServices.liveJoin(chatId, role, req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Token generated successfully',
    data: token,
  });
});

const givePermissionRole = catchAsync(async (req, res) => {
  const { role, chatId } = req.body;

  if (!role || !chatId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Role and chatId are required',
    });
  }

  const token = await LiveServices.updateRole(chatId, role, req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Token generated successfully',
    data: token,
  });
});

export const LiveController = {
  getLiveById,
  createNewLive,
  checkAndRegenerateToken,
  givePermissionRole,
};
