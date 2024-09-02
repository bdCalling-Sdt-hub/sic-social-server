/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { Chat } from './chat.model';
import { Message } from '../message/message.model';

const createChatToDB = async (payload: any) => {
  const isExistChat = await Chat.findOne({
    participants: { $all: payload }
  });


  if(isExistChat){
    return isExistChat;
  }

  const conversation = await Chat.create({participants: payload});
  return conversation;


  /* if (!isExistParticipant) {
    result = await Chat.create({ participants: user.id });

    //notification create
    const socketIo = global.io;
    const createNotification = await Notification.create({
      message: 'A patient wants to contact you for help.',
      role: 'admin',
      type: 'chat',
    });

    if (socketIo) {
      socketIo.emit('admin-notifications', createNotification);
    }
  } */


  // return result;
};

const chatListFromDB = async (user: JwtPayload) => {

  const chat = await Chat.find({
    participants: {
      $in: user?.userId
    }
  }).populate({
    path: 'participants',
    select: 'fullName avatar',
    match: { _id: { $ne: user?.userId } }
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

export const ChatService = {
  createChatToDB,
  chatListFromDB,
};
