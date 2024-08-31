import { ObjectId } from 'mongoose';

export interface ITermsAndConditions {
  createdBy: ObjectId; // Reference to the User
  content: string;
}
