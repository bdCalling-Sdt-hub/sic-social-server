import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacedownServices } from './facedown.service';

const createFacedown = catchAsync(async (req, res) => {
  const result = await FacedownServices.createFacedownToDB(
    req?.user,
    req?.body,
    req?.files,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Facedown created successfully!',
    data: result,
  });
});

const getFacedowns = catchAsync(async (req, res) => {
  const result = await FacedownServices.getFacedownsFromDB(req?.user?.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Facedowns retrieved successfully!',
    data: result,
  });
});
const getFacedownById = catchAsync(async (req, res) => {
  const result = await FacedownServices.getFacedownByIdFromDB(
    req?.params?.facedownId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Facedowns retrieved successfully!',
    data: result,
  });
});

const updateFacedownById = catchAsync(async (req, res) => {
  console.log(req?.body);

  const result = await FacedownServices.updateFacedownByIdFromDB(
    req?.params?.facedownId,
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
    req?.params?.facedownId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Facedown deleted successfully!',
    data: result,
  });
});

const othersFacedown = catchAsync(async (req, res) => {
  const result = await FacedownServices.othersFacedownFromDB(req.user?.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Others Facedown Retrieved  successfully!',
    data: result,
  });
});

export const FacedownControllers = {
  createFacedown,
  getFacedowns,
  getFacedownById,
  updateFacedownById,
  deleteFacedownById,
  othersFacedown,
};
