/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from 'express';
import path from 'path';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { fileType } from '../../utils/fileType';
import sendResponse from '../../utils/sendResponse';
import { MessageService } from './message.service';
import { voiceToText } from '../../helpers/getTextFromVoice';
const UPLOADS_BASE_DIR = path.resolve('uploads');

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;
  const { url } = req.body;

  const messageData: any = {
    chatId: data.chatId,
    sender: user?.userId,
    text: data?.text,
  };

  if (url) {
    messageData.url = url;
    messageData.messageType = 'book';
  }

  if (req.files && 'image' in req.files && req.files.image[0]) {
    messageData.image = `/images/${req.files.image[0].filename}`;
    messageData.messageType = fileType(req.files.image[0].mimetype);
  }

  if (req.files && 'audio' in req.files && req.files.audio[0]) {
    const audioFilePath = `/audios/${req.files.audio[0].filename}`;
    messageData.audio = audioFilePath;

    try {
      const fullPath = path.join(UPLOADS_BASE_DIR, audioFilePath);
      const transcription = await voiceToText(fullPath);
      messageData.text = transcription;
      messageData.messageType = "both"
    } catch (error:any) {
      return res.status(500).json({ error: error });
    }
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
