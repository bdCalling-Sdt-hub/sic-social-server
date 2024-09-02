import { ObjectId } from 'mongoose';

export interface ISicGuidelines {
  createdBy: ObjectId; // Reference to the User
  content: string;
}
