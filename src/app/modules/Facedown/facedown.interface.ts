import { ObjectId } from 'mongoose';

export interface IFacedown {
  createdBy: ObjectId; // Reference to the User
  name: string;
  image: string;
  bookImage?: string;
  bookUrl: string;
  description?: string;
  schedule: 'weekly' | 'monthly' | 'yearly';
}
