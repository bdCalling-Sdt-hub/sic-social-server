import { Types } from 'mongoose';

export type IMessage = {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  message: string;
  messageType: 'text' | 'image' | 'audio';
  friendsType: 'public' | 'friend' | 'group' | 'facedown';
};
