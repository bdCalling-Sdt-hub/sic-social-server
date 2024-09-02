import { ObjectId } from 'mongoose';

export interface IAboutSic {
  createdBy: ObjectId; // Reference to the User
  content: string;
}
