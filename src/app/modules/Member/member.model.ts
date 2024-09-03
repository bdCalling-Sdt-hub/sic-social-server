import { Schema, model } from 'mongoose';
import { IMember } from './member.interface';

const memberSchema = new Schema<IMember>(
  {
    userId: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    facedownId: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'Facedown', // Reference to the 'User' model
      required: true,
    },
  },
  { timestamps: true },
);

// Create the Member model using the schema
export const Member = model<IMember>('Member', memberSchema);
