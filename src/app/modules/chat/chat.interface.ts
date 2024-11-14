import { Types } from 'mongoose';

export type IChat = {
  participants?: Types.ObjectId;
  type?: 'public' | 'private';
  facedown?: Types.ObjectId;
  live?: Types.ObjectId;
};
