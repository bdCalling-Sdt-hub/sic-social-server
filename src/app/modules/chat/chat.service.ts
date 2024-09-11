/* eslint-disable @typescript-eslint/no-explicit-any */

import { JwtPayload } from 'jsonwebtoken';
import { Message } from '../message/message.model';
import { Chat } from './chat.model';

const createChatToDB = async (payload: any) => {
  const { participants, type, facedown } = payload;
  if(facedown){
    const isExistChat = await Chat.findOne({ participants, facedown, type });
    if(isExistChat){
      return isExistChat;
    }
  }
  const conversation:any = await Chat.create({ participants, type, facedown });
  return conversation;
};

const chatListFromDB = async (user: JwtPayload) => {

  const chat = await Chat.find({
    participants: {
      $in: user?.userId,
    },
    type : "private"
  }).populate({
    path: 'participants',
    select: 'fullName avatar'
  });


  //Use Promise.all to handle the asynchronous operations inside the map
  const filters = await Promise.all(chat?.map(async (conversation) => {
    const data = conversation?.toObject();
    const lastMessage:any = await Message.findOne({ chatId: conversation?._id }).sort({ createdAt: -1 }).select("message createdAt")
      
      return {
        ...data,
        lastMessage: lastMessage?.message || ""
      };
  }));
  
  return filters;
};

const publicChatListFromDB = async () => {
  const chatId  = await Message.distinct('chatId');

  const chat = await Chat.find({
    _id: {$in : chatId},
    type: "public"
  }).populate([
    {path: 'participants', select: 'fullName avatar'},
    {path: 'facedown', select: 'name image'}
  ]);


  //Use Promise.all to handle the asynchronous operations inside the map
  const filters = await Promise.all(chat?.map(async (conversation) => {

    const data:any = conversation?.toObject();
    const lastMessage:any = await Message.findOne({ chatId: conversation?._id })
    .populate({path: "sender", select: "fullName"}) 
    .sort({ createdAt: -1 })
    .select("message createdAt audio image text path")
    return {
      ...data,
      lastMessage: lastMessage || {}
    };
  }));
  
  return filters;
};

// update chat participants member;
const addMemberToDB = async (id: string, payload:any) => {

  const chat = await Chat.findOne({
    _id: id,
    participants: payload
  });

  if(!chat){
    await Chat.findByIdAndUpdate(id, { $addToSet: { participants: payload } }, { new: true });
    return;
  }
  
  return;
};

export const ChatService = {
  createChatToDB,
  chatListFromDB,
  publicChatListFromDB,
  addMemberToDB
};
