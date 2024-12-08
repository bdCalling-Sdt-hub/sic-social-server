/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import ApiError from '../../errors/ApiError';
import { Live } from '../live/live.modal';
import { Message } from '../message/message.model';
import { Chat } from './chat.model';

const createChatToDB = async (payload: any) => {
  const { participants, type, facedown } = payload;
  if (facedown) {
    const isExistChat = await Chat.findOne({ participants, facedown, type });
    if (isExistChat) {
      return isExistChat;
    }
  }

  const conversation: any = await Chat.create({ participants, type, facedown });
  return conversation;
};

const chatListFromDB = async (user: JwtPayload) => {
  const chat = await Chat.find({
    participants: {
      $in: user?.userId,
    },
    type: 'private',
  }).populate([
    { path: 'participants', select: 'fullName avatar' },
    { path: 'facedown', select: 'name image' },
    { path: 'live', select: 'name image' },
  ]);

  //Use Promise.all to handle the asynchronous operations inside the map
  const filters = await Promise.all(
    chat?.map(async (conversation) => {
      const data: any = conversation?.toObject();
      const lastMessage: any = await Message.findOne({
        chatId: conversation?._id,
      })
        .populate({ path: 'sender', select: 'fullName' })
        .populate({
          path: 'book',
          select: 'name bookUrl bookImage publisher',
        })
        .sort({ createdAt: -1 })
        .select('message createdAt audio image text path');
      return {
        ...data,
        lastMessage: lastMessage || {},
      };
    }),
  );

  return filters;
};

const publicChatListFromDB = async () => {
  const messageChatId = await Message.distinct('chatId');
  const liveChatId = await Live.distinct('chat');

  const chat = await Chat.find({
    _id: { $in: [...messageChatId, ...liveChatId] }, // Combine both arrays for the $in query
    type: 'public',
  }).populate([
    { path: 'participants', select: 'fullName avatar' },
    { path: 'facedown', select: 'name image' },
    { path: 'live', select: 'name image' },
  ]);

  //Use Promise.all to handle the asynchronous operations inside the map
  const filters = await Promise.all(
    chat?.map(async (conversation) => {
      const data: any = conversation?.toObject();
      const lastMessage: any = await Message.findOne({
        chatId: conversation?._id,
      })
        .populate({ path: 'sender', select: 'fullName' })
        .populate({
          path: 'book',
          select: 'name bookUrl bookImage publisher',
        })
        .sort({ createdAt: -1 })
        .select('message createdAt audio image text path');
      return {
        ...data,
        lastMessage: lastMessage || {},
      };
    }),
  );

  return filters;
};

// update chat participants member;
const addMemberToDB = async (id: string, payload: any) => {
  const chat = await Chat.findOne({
    _id: id,
    participants: payload,
  });

  if (!chat) {
    await Chat.findByIdAndUpdate(
      id,
      { $addToSet: { participants: payload } },
      { new: true },
    );
    return;
  }

  return;
};

const removeMemberToDB = async (id: string, participantId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Participants ID');
  }

  const chat = await Chat.findByIdAndUpdate(
    id,
    { $pull: { participants: participantId } }, // Use $pull to remove the participant
    { new: true }, // Return the updated document
  );

  // console.log(chat);

  if (!chat) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to Remove Participants from the chat',
    );
  }

  return;
};

const chatParticipantsFromDB = async (user: JwtPayload, id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Id');
  }

  const participants = await Chat.findById(id)
    .populate({
      path: 'participants',
      select: 'fullName avatar',
      match: { _id: { $ne: user.userId } },
    })
    .select('participants');

  return participants?.participants;
};

const deleteChatsToDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Id');
  }

  const deleteMessage = await Message.deleteMany({ chatId: id });
  if (!deleteMessage) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to Delete All message by this Chat Id',
    );
  }

  const deleteChat = await Chat.findByIdAndDelete(id);
  if (!deleteChat) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Failed to Delete All message by this Chat Id',
    );
  }

  return;
};

export const ChatService = {
  createChatToDB,
  chatListFromDB,
  publicChatListFromDB,
  addMemberToDB,
  chatParticipantsFromDB,
  removeMemberToDB,
  deleteChatsToDB,
};
