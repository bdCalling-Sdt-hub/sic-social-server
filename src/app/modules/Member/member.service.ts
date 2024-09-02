import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { IMember } from './member.interface';
import { Member } from './member.model';

const createMemberToDB = async (user: JwtPayload, payload: IMember) => {
  payload.userId = user?.userId;

  const result = await Member.create(payload);
  return result;
};

const getMembersFromDB = async () => {
  const result = await Member.find();
  return result;
};

const updateMemberByIdFromDB = async (
  MemberId: string,
  payload: Partial<IMember>,
) => {
  // Remove the createdBy field from the payload
  delete payload.userId;

  // Update the Member with the provided status
  const result = await Member.findByIdAndUpdate(MemberId, payload, {
    new: true, // Return the updated document
    runValidators: true,
  });

  // Handle case where no Member is found
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Member with ID: ${MemberId} not found!`,
    );
  }

  return result;
};

const deleteMemberByIdFromDB = async (MemberId: string) => {
  const result = await Member.findByIdAndDelete(MemberId);

  // Handle case where no Member is found
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Member with ID: ${MemberId} not found!`,
    );
  }
};

export const MemberServices = {
  createMemberToDB,
  getMembersFromDB,
  updateMemberByIdFromDB,
  deleteMemberByIdFromDB,
};
