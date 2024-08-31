import { ObjectId } from 'mongoose';

export interface IFriend {
  senderId: ObjectId; // Reference to the User
  recipientId: ObjectId;
  status: 'pending' | 'accepted';
}
