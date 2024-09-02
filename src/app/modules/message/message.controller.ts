/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { MessageService } from './message.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { fileType } from '../../utils/fileType';

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;

  const messageData:any = {
    chatId: data.chatId,
    sender: user?.userId,
    messageType: 'audio',
  };

  if (req.files && 'image' in req.files && req.files.image[0]) {
    messageData.message = `/images/${req.files.image[0].filename}`;
    messageData.messageType = fileType(req.files.image[0].mimetype);
  }

  if (req.files && 'audio' in req.files && req.files.audio[0]) {
    messageData.message = `/audios/${req.files.audio[0].filename}`;
    messageData.messageType = fileType(req.files.audio[0].mimetype);
  }

  const result = await MessageService.sendMessageToDB(messageData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Message send successfully',
    data: result,
  });
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const chatId = req.params.chatId;
  const result = await MessageService.getMessagesFromDB(chatId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Message retrieved successfully',
    data: result,
  });
});

export const MessageController = {
  sendMessage,
  getMessages,
};
