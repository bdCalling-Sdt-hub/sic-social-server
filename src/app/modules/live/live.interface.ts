import { ObjectId } from 'mongoose';

export interface ILive {
  chat: ObjectId;
  host: ObjectId;
  activeUsers: [
    {
      user: ObjectId;
      joinTime: Date;
      uid: number;
      role: string;
      token: string;
    },
  ];
}
