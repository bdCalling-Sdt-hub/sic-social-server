import { model, Schema } from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: false
    },
    audio: {
      type: String,
      required: false
    },
    image: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'audio', 'join', 'facedown', 'book', "both"],
      default: "text"
    },
    friendsType: {
      type: String,
      enum: ['public', 'friend', 'group', 'facedown'],
      default: "public"
    },
  },
  { timestamps: true },
);

export const Message = model<IMessage>('Message', messageSchema);
