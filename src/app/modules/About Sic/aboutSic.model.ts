import { Schema, model } from 'mongoose';
import { IAboutSic } from './aboutSic.interface';

const aboutSicSchema = new Schema<IAboutSic>(
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
    lastUpdated: {
      type: Date,
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt timestamps to the schema
);

// Create the About Sic model using the schema
export const AboutSic = model<IAboutSic>('AboutSic', aboutSicSchema);
