import { Schema, model } from 'mongoose';

import { ILive } from './live.interface';

const memberSchema = new Schema<ILive>({
  chat: {
    ref: 'Chat',
    type: Schema.Types.ObjectId,
    required: true,
  },
  book: {
    ref: 'Book',
    type: Schema.Types.ObjectId,
    required: true,
  },
  createBy: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  activeUsers: [
    {
      user: {
        type: Schema.Types.ObjectId, // MongoDB ObjectId type
        ref: 'User', // Reference to the 'User' model
        required: true,
      },
      uid: Number,
      role: {
        type: String,
        enum: ['audience', 'host'], // Define allowed roles
        default: 'audience',
      },
      joinTime: Date,
      token: String,
    },
  ],
});

export const Live = model<ILive>('Live', memberSchema);
