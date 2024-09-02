import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacedownServices } from './faceDown.service';

const createFacedown = catchAsync(async (req, res) => {
  const result = await FacedownServices.createFacedownToDB(
    req?.user,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Facedown created successfully!',
    data: result,
  });
});

const getFacedowns = catchAsync(async (req, res) => {
  const result = await FacedownServices.getFacedownsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Facedowns retrieved successfully!',
    data: result,
  });
});

const updateFacedownById = catchAsync(async (req, res) => {
  const result = await FacedownServices.updateFacedownByIdFromDB(
    req?.params?.id,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Facedown updated successfully!',
    data: result,
  });
});

const deleteFacedownById = catchAsync(async (req, res) => {
  const result = await FacedownServices.deleteFacedownByIdFromDB(
    req?.params?.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Facedown deleted successfully!',
    data: result,
  });
});

export const FacedownControllers = {
  createFacedown,
  getFacedowns,
  updateFacedownById,
  deleteFacedownById,
};
