import { ObjectId } from 'mongoose';

export interface IMember {
  userId: ObjectId; // Reference to User
  facedownId: ObjectId; // Reference to FaceDown
}
