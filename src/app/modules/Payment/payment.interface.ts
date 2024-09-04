import { ObjectId } from 'mongoose';

export interface IPayment {
  userId: ObjectId; // Reference to the User
  amount: number;
  transactionId: string;
}
