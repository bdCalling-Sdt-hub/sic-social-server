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

// Static method to count mutual friends between two users
friendSchema.statics.getMutualFriendsCount = async function (
  userId1: string,
  userId2: string,
) {
  // Find friends of the first user
  const user1Friends = await this.find({
    $or: [{ senderId: userId1 }, { recipientId: userId1 }],
    status: 'approved',
  }).select('senderId recipientId -_id');

  // Extract user IDs from user1Friends
  const user1FriendIds = user1Friends.map((friend) =>
    friend.senderId === userId1 ? friend.recipientId : friend.senderId,
  );

  // Find mutual friends count by checking if user2's friends are in user1's friends list
  const mutualFriendsCount = await this.countDocuments({
    $or: [
      { senderId: userId2, recipientId: { $in: user1FriendIds } },
      { recipientId: userId2, senderId: { $in: user1FriendIds } },
    ],
    status: 'approved',
  });

  return mutualFriendsCount;
};

// Create the Friend model using the schema
export const Friend = model<IFriend, FriendModel>('Friend', friendSchema);
