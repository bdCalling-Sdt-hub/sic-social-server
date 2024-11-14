import { Schema, model } from 'mongoose';

import { IChat } from './chat.interface';

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    type: {
      type: String,
      enum: ['public', 'private'],
      default: 'private',
    },
    facedown: {
      type: Schema.Types.ObjectId,
      ref: 'Facedown',
    },
    live: {
      type: Schema.Types.ObjectId,
      ref: 'Live',
    },
  },
  { timestamps: true },
);

export const Chat = model<IChat>('Chat', chatSchema);
