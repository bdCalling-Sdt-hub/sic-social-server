import { ObjectId } from 'mongoose';

export interface ICategory {
  createdBy: ObjectId;
  name: string;
}
