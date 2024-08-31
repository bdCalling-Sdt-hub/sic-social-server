import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AboutSicServices } from './aboutSic.service';

const createAboutSic = catchAsync(async (req, res) => {
  const result = await AboutSicServices.createAboutSicToDB(
    req?.user,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'About Sic created successfully!',
    data: result,
  });
});

const getAboutSic = catchAsync(async (req, res) => {
  const result = await AboutSicServices.getAboutSicFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About Sic retrieved successfully!',
    data: result,
  });
});

const updateAboutSicById = catchAsync(async (req, res) => {
  const result = await AboutSicServices.updateAboutSicByIdFromDB(
    req?.params?.id,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'About Sic updated successfully!',
    data: result,
  });
});

export const AboutSicControllers = {
  createAboutSic,
  getAboutSic,
  updateAboutSicById,
};
