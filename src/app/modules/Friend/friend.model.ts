import { Schema, model } from 'mongoose';
import { IFriend } from './friend.interface';

const friendSchema = new Schema<IFriend>(
  {
    userId: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    friendId: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

// Create the Friend model using the schema
export const Friend = model<IFriend>('Friend', friendSchema);
