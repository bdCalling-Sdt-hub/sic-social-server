import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { IMember } from './member.interface';
import { Member } from './member.model';
import { Facedown } from '../Facedown/facedown.model';

const addMemberToDB = async (user: JwtPayload, payload: IMember) => {
  // Ensure the user ID is set in the payload
  payload.userId = user?.userId;

  // Check if the Facedown exists
  const existingFacedown = await Facedown.findById(payload?.facedownId);

  if (!existingFacedown) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Facedown with ID: ${payload?.facedownId} not found!`,
    );
  }

  // Check if the user is already a member of the group
  const existingMember = await Member.findOne({
    userId: payload?.userId,
    facedownId: payload?.facedownId,
  });
  if (existingMember) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'User is already a member of this group!',
    );
  }

  const result = await Member.create(payload);
  return result;
};

const getMembersFromDB = async (payload: Partial<IMember>) => {
  // Check if the Facedown exists
  const existingFacedown = await Facedown.findById(payload?.facedownId);

  if (!existingFacedown) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Facedown with ID: ${payload?.facedownId} not found!`,
    );
  }

  const result = await Member.find({ facedownId: payload?.facedownId });
  return result;
};

const removeMemberByIdFromDB = async (payload: IMember) => {
  // Find the member
  const existingMember = await Member.findOne({
    userId: payload?.userId,
    facedownId: payload?.facedownId,
  });

  if (!existingMember) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Member with ID: ${payload?.userId} not found!`,
    );
  }

  // Check if the Facedown exists
  const existingFacedown = await Facedown.findById(existingMember?.facedownId);

  if (!existingFacedown) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Facedown with ID: ${payload?.facedownId} not found!`,
    );
  }

  // Check if the user is allowed to remove this member (e.g., admin check)
  if (existingMember?.userId !== existingFacedown?.createdBy) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Not authorized to remove this member!',
    );
  }

  await Member.findByIdAndDelete(existingMember?._id);
};

export const MemberServices = {
  addMemberToDB,
  getMembersFromDB,
  removeMemberByIdFromDB,
};
