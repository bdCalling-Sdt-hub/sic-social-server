import { Model, ObjectId } from 'mongoose';

export interface IFriend {
  senderId: ObjectId; // Reference to the User
  recipientId: ObjectId;
  status: 'pending' | 'accepted';
}

// Interface for the friend model methods
export interface FriendModel extends Model<IFriend> {
  getTotalFriendsCount(userId: string): Promise<number>;
}
