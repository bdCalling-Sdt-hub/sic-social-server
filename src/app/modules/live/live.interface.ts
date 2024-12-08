import { ObjectId } from 'mongoose';

export interface ILive {
  chat: ObjectId;
  createBy: ObjectId;
  book: ObjectId;
  name: string;
  activeUsers: [
    {
      user: ObjectId;
      joinTime: Date;
      uid: number;
      role: string;
      isMute: boolean;
      token: string;
    },
  ];
}
