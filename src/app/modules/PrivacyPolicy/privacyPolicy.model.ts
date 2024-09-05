import { Schema, model } from 'mongoose';
import { IPrivacyPolicy } from './privacyPolicy.interface';

const privacyPolicySchema = new Schema<IPrivacyPolicy>(
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

// Create the Privacy policy model using the schema
export const PrivacyPolicy = model<IPrivacyPolicy>(
  'PrivacyPolicy',
  privacyPolicySchema,
);
