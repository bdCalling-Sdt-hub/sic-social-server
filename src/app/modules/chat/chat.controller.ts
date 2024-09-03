/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createChat = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId;
  const { participants = [], type, facedown   }: { participants: any[], type: string, facedown: string  } = req.body;
  
  const payload = [id, ...participants];

  const data ={
    participants: payload,
    type,
    facedown
  }

  const result = await ChatService.createChatToDB(data);

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

export const ChatController = {
  createChat,
  chatListFromDB,
  publicChatList
};
