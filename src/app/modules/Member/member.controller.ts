import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MemberServices } from './member.service';

const addMember = catchAsync(async (req, res) => {
  const result = await MemberServices.addMemberToDB(req?.user, req?.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Member added successfully!',
    data: result,
  });
});

const getMembers = catchAsync(async (req, res) => {
  const result = await MemberServices.getMembersFromDB(req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Members retrieved successfully!',
    data: result,
  });
});

const removeMemberById = catchAsync(async (req, res) => {
  const result = await MemberServices.removeMemberByIdFromDB(req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member removed successfully!',
    data: result,
  });
});

export const MemberControllers = {
  addMember,
  getMembers,
  removeMemberById,
};
