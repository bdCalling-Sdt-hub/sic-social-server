import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SicGuidelinesServices } from './sicGuidelines.service';

const createSicGuidelines = catchAsync(async (req, res) => {
  const result = await SicGuidelinesServices.createSicGuidelinesToDB(
    req?.user,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Sic guidelines created successfully!',
    data: result,
  });
});

const getSicGuidelines = catchAsync(async (req, res) => {
  const result = await SicGuidelinesServices.getSicGuidelinesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sic guidelines retrieved successfully!',
    data: result,
  });
});

const updateSicGuidelinesById = catchAsync(async (req, res) => {
  const result = await SicGuidelinesServices.updateSicGuidelinesByIdFromDB(
    req?.params?.id,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sic guidelines updated successfully!',
    data: result,
  });
});

export const SicGuidelinesControllers = {
  createSicGuidelines,
  getSicGuidelines,
  updateSicGuidelinesById,
};
