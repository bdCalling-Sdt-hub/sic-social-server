import { Schema, model } from 'mongoose';
import { IDonation } from './donation.interface';

const donationSchema = new Schema<IDonation>(
  {
    createdBy: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    details: {
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },

    rulesAndRegulations: {
      content: {
        type: String,
        required: true,
      },
    },

    termsAndConditions: {
      content: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
);

// Create the Donation model using the schema
export const Donation = model<IDonation>('Donation', donationSchema);
