import { ObjectId } from 'mongoose';

export interface IBook {
  createdBy: ObjectId; // Reference to the User
  name: string;
  publisher: string;
  category: string;
  bookImage: string;
  pdf: string;
  bookUrl?: string;
}
