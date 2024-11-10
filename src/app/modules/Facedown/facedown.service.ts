/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { unlinkFile } from '../../helpers/fileHandler';
import getPathAfterUploads from '../../helpers/getPathAfterUploads';
import { Chat } from '../chat/chat.model';
import { IFacedown } from './facedown.interface';
import { Facedown } from './facedown.model';

const createFacedownToDB = async (
  user: JwtPayload,
  payload: IFacedown,
  files: any,
) => {
  if (files && files?.image) {
    payload.image = getPathAfterUploads(files?.image?.[0]?.path);
  }

  payload.createdBy = user?.userId;

  const result = (await Facedown.create(payload)).populate({
    path: 'book',
    select: 'name bookUrl bookImage publisher category pdf',
  });
  return result;
};

const getFacedownsFromDB = async () => {
  const facedwon = await Facedown.find().select(
    'name image createdBy description schedule book',
  );

  const result = Promise.all(
    facedwon?.map(async (facedown: any) => {
      const chatId: any = await Chat.findOne({
        facedown: facedown?._id,
      }).select('_id');
      return {
        ...facedown.toObject(),
        chatId: chatId?._id,
      };
    }),
  );

  return result;
};
const getFacedownByIdFromDB = async (id: string) => {
  const result = await Facedown.findById(id)
    .select('name image createdBy description schedule')
    .populate({
      path: 'book',
      select: 'name bookUrl bookImage publisher category pdf',
    });

  return result || [];
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

const othersFacedownFromDB = async (id: string) => {
  // get facedown ids from chat participants
  const facedownIds = await Chat.find({
    participants: { $all: [id] },
  }).distinct('facedown');

  const facedown = await Facedown.find({ _id: { $in: facedownIds } }).select(
    'name image createdBy description schedule book',
  );

  const result = Promise.all(
    facedown?.map(async (facedown: any) => {
      const chatId: any = await Chat.findOne({
        facedown: facedown?._id,
      }).select('_id');
      return {
        ...facedown.toObject(),
        chatId: chatId?._id,
      };
    }),
  );

  return result || [];
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
  othersFacedownFromDB,
  getFacedownByIdFromDB,
};
