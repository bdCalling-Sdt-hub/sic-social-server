import { ObjectId } from 'mongoose';

export interface IFaceDown {
  createdBy: ObjectId; // Reference to the User
  name: string;
  bookImage: string;
  bookUrl: string;
  description?: string;
  schedule: 'weekly' | 'monthly' | 'yearly';
}
