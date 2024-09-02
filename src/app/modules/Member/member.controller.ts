import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MemberServices } from './member.service';

const createMember = catchAsync(async (req, res) => {
  const result = await MemberServices.createMemberToDB(req?.user, req?.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Member created successfully!',
    data: result,
  });
});

const getMembers = catchAsync(async (req, res) => {
  const result = await MemberServices.getMembersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Members retrieved successfully!',
    data: result,
  });
});

const updateMemberById = catchAsync(async (req, res) => {
  const result = await MemberServices.updateMemberByIdFromDB(
    req?.params?.id,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member updated successfully!',
    data: result,
  });
});

const deleteMemberById = catchAsync(async (req, res) => {
  const result = await MemberServices.deleteMemberByIdFromDB(req?.params?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Member deleted successfully!',
    data: result,
  });
});

export const MemberControllers = {
  createMember,
  getMembers,
  updateMemberById,
  deleteMemberById,
};
