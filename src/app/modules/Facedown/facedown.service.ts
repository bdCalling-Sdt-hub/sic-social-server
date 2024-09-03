/* eslint-disable @typescript-eslint/no-explicit-any */

import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { IFacedown } from './facedown.interface';
import { Facedown } from './facedown.model';
import getPathAfterUploads from '../../helpers/getPathAfterUploads';
import { unlinkFile } from '../../helpers/fileHandler';

const createFacedownToDB = async (
  user: JwtPayload,
  payload: IFacedown,
  files: any,
) => {
  if (files && files?.image) {
    payload.image = getPathAfterUploads(files?.image?.[0]?.path);
  }

  if (files && files?.bookImage) {
    payload.bookImage = getPathAfterUploads(files?.bookImage?.[0]?.path);
  }

  payload.createdBy = user?.userId;

  const result = await Facedown.create(payload);
  return result;
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
  const existingFacedown = await Facedown.findByIdAndDelete(facedownId);

  // Handle case where no Facedown is found
  if (!existingFacedown) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Facedown with ID: ${facedownId} not found!`,
    );
  }

  // Delete the images if they exist
  if (existingFacedown?.image) {
    unlinkFile(existingFacedown?.image);
  }

  if (existingFacedown?.bookImage) {
    unlinkFile(existingFacedown?.bookImage);
  }

  // Proceed to delete the Facedown record
  await Facedown.findByIdAndDelete(facedownId);
};

export const FacedownServices = {
  createFacedownToDB,
  getFacedownsFromDB,
  updateFacedownByIdFromDB,
  deleteFacedownByIdFromDB,
};
