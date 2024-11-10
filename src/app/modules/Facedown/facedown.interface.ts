import { ObjectId } from 'mongoose';

export interface IFacedown {
  createdBy: ObjectId; // Reference to the User
  name: string;
  image: string;
  book?: ObjectId;
  url?: string;
  description?: string;
  schedule: 'weekly' | 'monthly' | 'yearly';
}
