import { ObjectId } from 'mongoose';

export interface IPrivacyPolicy {
  createdBy: ObjectId; // Reference to the User
  content: string;
  lastUpdated?: Date;
}
