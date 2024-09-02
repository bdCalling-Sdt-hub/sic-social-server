import { Schema, model } from 'mongoose';
import { IFacedown } from './faceDown.interface';

const facedownSchema = new Schema<IFacedown>(
  {
    createdBy: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    bookImage: {
      type: String,
    },
    bookUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    schedule: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly'],
      required: true,
    },
  },
  { timestamps: true },
);

// Create the Facedown model using the schema
export const Facedown = model<IFacedown>('Facedown', facedownSchema);
