/* eslint-disable @typescript-eslint/no-explicit-any */

import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { IFacedown } from './facedown.interface';
import { Facedown } from './facedown.model';

const createFacedownToDB = async (
  user: JwtPayload,
  payload: IFacedown,
  files: any,
) => {
  if (files && files?.image) {
    payload.image = files?.image?.path?.replace(/\\/g, '/'); // Normalize the file path to use forward slashes

    console.log(files?.image);
  }

  if (files && files?.bookImage) {
    payload.bookImage = files?.bookImage?.path?.replace(/\\/g, '/'); // Normalize the file path to use forward slashes

    console.log(files?.bookImage);
  }

  payload.createdBy = user?.userId;

  // const result = await Facedown.create(payload);
  // return result;
};

const getFacedownsFromDB = async () => {
  const result = await Facedown.find();
  return result;
};

const updateFacedownByIdFromDB = async (
  facedownId: string,
  payload: Partial<IFacedown>,
) => {
  // Remove the createdBy field from the payload
  delete payload.createdBy;

  // Update the Facedown with the provided status
  const result = await Facedown.findByIdAndUpdate(facedownId, payload, {
    new: true, // Return the updated document
    runValidators: true,
  });

  // Handle case where no Facedown is found
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Facedown with ID: ${facedownId} not found!`,
    );
  }

  return result;
};

const deleteFacedownByIdFromDB = async (facedownId: string) => {
  const result = await Facedown.findByIdAndDelete(facedownId);

  // Handle case where no Facedown is found
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Facedown with ID: ${facedownId} not found!`,
    );
  }
};

export const FacedownServices = {
  createFacedownToDB,
  getFacedownsFromDB,
  updateFacedownByIdFromDB,
  deleteFacedownByIdFromDB,
};
