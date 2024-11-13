import { Types } from 'mongoose';

export type IMessage = {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  text?: string;
  audio?: string;
  image?: string;
  book?: string;
  messageType: 'text' | 'image' | 'audio' | 'book' | 'both';
  friendsType: 'public' | 'friend' | 'group' | 'facedown';
};
