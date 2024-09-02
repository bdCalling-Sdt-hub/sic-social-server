import { Request, Response } from 'express';
import { ChatService } from './chat.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createChat = catchAsync(async (req: Request, res: Response) => {
  const id = req.user?.userId;
  const { participants } = req.body;
  
  const payload = [id, ...participants];

  const result = await ChatService.createChatToDB(payload);

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

export const ChatController = {
  createChat,
  chatListFromDB,
};
