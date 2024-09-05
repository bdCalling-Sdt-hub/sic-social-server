import { Schema, model } from 'mongoose';
import { IFeedback } from './feedback.interface';

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Create the Feedback model using the schema
export const Feedback = model<IFeedback>('Feedback', feedbackSchema);
