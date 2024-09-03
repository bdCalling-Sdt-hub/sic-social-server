import { Schema, model } from 'mongoose';
import { FriendModel, IFriend } from './friend.interface';

const friendSchema = new Schema<IFriend, FriendModel>(
  {
    senderId: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId, // MongoDB ObjectId type
      ref: 'User', // Reference to the 'User' model
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

// Static method to count total friends for a user
friendSchema.statics.getTotalFriendsCount = async function (userId: string) {
  const count = await this.countDocuments({
    $or: [{ senderId: userId }, { recipientId: userId }],
    status: 'accepted',
  });

  return count;
};

// Create the Friend model using the schema
export const Friend = model<IFriend, FriendModel>('Friend', friendSchema);
