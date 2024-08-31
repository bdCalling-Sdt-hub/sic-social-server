import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PrivacyPolicyServices } from './privacyPolicy.service';

const createPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await PrivacyPolicyServices.createPrivacyPolicyToDB(
    req?.user,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Privacy Policy created successfully!',
    data: result,
  });
});

const getPrivacyPolicy = catchAsync(async (req, res) => {
  const result = await PrivacyPolicyServices.getPrivacyPolicyFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy Policy retrieved successfully!',
    data: result,
  });
});

const updatePrivacyPolicyById = catchAsync(async (req, res) => {
  const result = await PrivacyPolicyServices.updatePrivacyPolicyByIdFromDB(
    req?.params?.id,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Privacy Policy updated successfully!',
    data: result,
  });
});

export const PrivacyPolicyControllers = {
  createPrivacyPolicy,
  getPrivacyPolicy,
  updatePrivacyPolicyById,
};
