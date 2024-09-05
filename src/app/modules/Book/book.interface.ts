import { ObjectId } from 'mongoose';

export interface IBook {
  createdBy: ObjectId; // Reference to the User
  name: string;
  publisher: string;
  coverImage: string;
  bookPdf: string;
  bookUrl?: string;
}
