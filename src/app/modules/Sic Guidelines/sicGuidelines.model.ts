import { Schema, model } from 'mongoose';
import { ISicGuidelines } from './sicGuidelines.interface';

const sicGuidelinesSchema = new Schema<ISicGuidelines>(
  {
    createdBy: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt timestamps to the schema
);

// Create the About Sic model using the schema
export const SicGuidelines = model<ISicGuidelines>(
  'SicGuidelines',
  sicGuidelinesSchema,
);
