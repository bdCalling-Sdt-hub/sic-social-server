import { ObjectId } from 'mongoose';

export interface IFeedback {
  userId: ObjectId; // Reference to the User
  feedback: string;
}
