import { Types } from 'mongoose';

export type IMessage = {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;
  text?:string;
  audio?:string;
  image?:string;
  path?:string;
  messageType: 'text' | 'image' | 'audio' | 'book';
  friendsType: 'public' | 'friend' | 'group' | 'facedown';
};
