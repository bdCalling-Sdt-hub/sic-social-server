/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ChatService } from './chat.service';

const createChat = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId;
  const {
    participants = [],
    type,
    facedown,
  }: { participants: any[]; type: string; facedown: string } = req.body;

  const payload = [id, ...participants];

  const data = {
    participants: payload,
    type,
    facedown,
  };

  const result: any = await ChatService.createChatToDB(data);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Chat created successfully',
    data: result,
  });
});

const chatListFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await ChatService.chatListFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'chat list retrieved successfully',
    data: result,
  });
});

const publicChatList = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.publicChatListFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'New feed list retrieved successfully',
    data: result,
  });
});

const addMember = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body.participants;
  await ChatService.addMemberToDB(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Added member to the public chat',
  });
});

const chatParticipants = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.chatParticipantsFromDB(
    req.user,
    req.params.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Participants List Retrieved',
    data: result,
  });
});

const removeParticipant = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.removeMemberToDB(
    req.params.id,
    req.body.participantId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Remove Participant from chat ',
    data: result,
  });
});

const deleteChat = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.deleteChatsToDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Chat Deleted Successfully',
    data: result,
  });
});

export const ChatController = {
  createChat,
  chatListFromDB,
  publicChatList,
  addMember,
  chatParticipants,
  removeParticipant,
  deleteChat,
};
