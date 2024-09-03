/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message } from './message.model'

const sendMessageToDB = async (payload: any) => {
  const result = await Message.create(payload);

  /* if(!result){
    unlinkFile(payload?.message);
  } */
  
  //message
  const socketIo = global.io
  if (socketIo) {
    socketIo.emit(`message::${payload.chatId}`, result)
  }

  return result
}

const getMessagesFromDB = async (chatId: string) => {
  const result = await Message.find({ chatId })
  .populate(
    {path: "sender", select: "fullName avatar"}
  );
  return result;
}

export const MessageService = {
  getMessagesFromDB,
  sendMessageToDB,
}
