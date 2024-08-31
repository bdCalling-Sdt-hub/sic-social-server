import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TermsAndConditionServices } from './termsAndConditions.service';

const createTermsAndConditions = catchAsync(async (req, res) => {
  const result = await TermsAndConditionServices.createTermsAndConditionsToDB(
    req?.user,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Terms and conditions created successfully!',
    data: result,
  });
});

const getTermsAndConditions = catchAsync(async (req, res) => {
  const result = await TermsAndConditionServices.getTermsAndConditionsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Terms and conditions retrieved successfully!',
    data: result,
  });
});

const updateTermsAndConditionsById = catchAsync(async (req, res) => {
  const result =
    await TermsAndConditionServices.updateTermsAndConditionsByIdFromDB(
      req?.params?.id,
      req?.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Terms and conditions updated successfully!',
    data: result,
  });
});

export const TermsAndConditionControllers = {
  createTermsAndConditions,
  getTermsAndConditions,
  updateTermsAndConditionsById,
};
