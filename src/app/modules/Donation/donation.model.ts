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
      },
      image: {
        type: String,
      },
      content: {
        type: String,
      },
    },

    rulesAndRegulations: {
      content: {
        type: String,
      },
    },

    termsAndConditions: {
      content: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

// Create the Donation model using the schema
export const Donation = model<IDonation>('Donation', donationSchema);
