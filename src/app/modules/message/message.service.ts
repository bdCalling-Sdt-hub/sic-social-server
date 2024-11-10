/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Message } from './message.model';

const sendMessageToDB = async (payload: any) => {
  const result = await Message.create(payload);

  /* if(!result){
    unlinkFile(payload?.message);
  } */

  //message
  //@ts-ignore
  const socketIo = global.io;
  if (socketIo) {
    socketIo.emit(`message::${payload.chatId}`, result);
  }

  return result;
};

const getMessagesFromDB = async (chatId: string) => {
  const result = await Message.find({ chatId })
    .populate({ path: 'sender', select: 'fullName avatar' })
    .populate({
      path: 'book',
      select: 'name bookUrl bookImage publisher',
    })
    .sort({ createdAt: -1 });

  return result;
};

export const MessageService = {
  getMessagesFromDB,
  sendMessageToDB,
};
