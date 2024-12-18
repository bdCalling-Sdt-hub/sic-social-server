import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await UserServices.createUserToDB(req?.body);
  // console.log(result);
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Your account has been successfully created!',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdminToDB(req?.body);

  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin account created successfully!',
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const result = await UserServices?.getUsersFromDB(req?.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users list retrieved successfully!',
    data: result,
  });
});

const getUsersCount = catchAsync(async (req, res) => {
  const result = await UserServices?.getUsersCountFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Count of users retrieved successfully!',
    data: result,
  });
});

const getAdmins = catchAsync(async (req, res) => {
  const result = await UserServices?.getAdminsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins list retrieved successfully!',
    data: result,
  });
});

const getUserProfile = catchAsync(async (req, res) => {
  const result = await UserServices?.getUserProfileFromDB(req?.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully!',
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const result = await UserServices?.updateUserProfileToDB(
    req?.user,
    req?.body,
    req?.file,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully!',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  createAdmin,
  getUsers,
  getUsersCount,
  getAdmins,
  getUserProfile,
  updateUserProfile,
};
