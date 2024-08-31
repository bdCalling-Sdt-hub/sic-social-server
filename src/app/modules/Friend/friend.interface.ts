import { ObjectId } from 'mongoose';

export interface IFriend {
  userId: ObjectId; // Reference to the User
  friendId: ObjectId;
  status: 'pending' | 'accepted';
}
