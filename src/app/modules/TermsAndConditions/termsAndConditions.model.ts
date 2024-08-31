import { Schema, model } from 'mongoose';
import { ITermsAndConditions } from './termsAndConditions.interface';

const termsAndConditionsSchema = new Schema<ITermsAndConditions>(
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
  { timestamps: true },
);

// Create the Terms and conditions model using the schema
export const TermsAndConditions = model<ITermsAndConditions>(
  'TermsAndConditions',
  termsAndConditionsSchema,
);
