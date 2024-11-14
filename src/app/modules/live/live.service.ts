import generateAgoraToken from '../../helpers/generateAgoraToken';
import { generateNumericUID } from '../../helpers/generateNumericUID';
import { Chat } from '../chat/chat.model';
import { Live } from './live.modal';

const getToLiveBd = async (liveId: string) => {
  const liveChat = await Live.findById(liveId).populate([
    { path: 'activeUsers.user', select: 'fullName avatar' },
    // { path: 'host', select: 'fullName' }, // Example of populating the host field as well
  ]);

  // console.log(updateLiveId);

  return liveChat || {};
};
const addLiveToDB = async (chatId: string, role: string, userId: string) => {
  const token = generateAgoraToken(chatId, role, userId);

  const existChat = Chat.findOne({ _id: chatId });

  if (!existChat) {
    throw new Error('Chat does not exist');
  }
  // Check if a live chat with the same chatId already exists
  let liveChat = await Live.findOne({ chat: chatId });
  if (!liveChat) {
    liveChat = await Live.create({
      chat: chatId,
      host: userId,
      activeUsers: [
        {
          user: userId,
          uid: generateNumericUID(userId),
          joinTime: new Date(),
          role,
          token,
        },
      ],
    });
    await Chat.findOneAndUpdate(
      { _id: chatId },
      { $set: { live: liveChat._id } },
    );

    // console.log(updateLiveId);

    return liveChat;
  } else {
    // send error response
    throw new Error('Live chat already exists');
  }
};

const liveJoin = async (chatId: string, role: string, userId: string) => {
  const liveChat = await Live.findOne({ chat: chatId }).lean();

  const existingUser = liveChat?.activeUsers.find(
    (user) => user.user.toString() === userId,
  );

  const tokenExpirationTimeInSeconds = 3600;
  const tokenStillValid =
    existingUser &&
    (new Date().getTime() - new Date(existingUser.joinTime).getTime()) / 1000 <
      tokenExpirationTimeInSeconds;

  let token;
  if (tokenStillValid) {
    // Token is still valid, use the existing one
    token = existingUser.token;
  } else {
    // Generate a new token
    token = generateAgoraToken(chatId, role, userId);

    console.log(generateNumericUID(userId));
    console.log(generateNumericUID(userId));
    console.log(generateNumericUID(userId));

    if (existingUser) {
      // User exists but the token has expired, update only the token and joinTime
      await Live.updateOne(
        { chat: chatId, 'activeUsers.user': userId },
        {
          $set: {
            'activeUsers.$.token': token,
            'activeUsers.$.joinTime': new Date(),
          },
        },
      );
    } else {
      // User does not exist in activeUsers, add a new entry
      await Live.updateOne(
        { chat: chatId },
        {
          $addToSet: {
            activeUsers: {
              user: userId,
              uid: generateNumericUID(userId),
              joinTime: new Date(),
              role,
              token,
            },
          },
        },
        { upsert: true },
      );
    }
  }

  return token;
};

// New function to update a user's role in the live chat
const updateRole = async (chatId: string, newRole: string, userId: string) => {
  // Validate role (only 'host' and 'audience' allowed)
  const validRoles = ['host', 'audience'];
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role specified');
  }

  // Generate a new Agora token with the new role
  const newToken = generateAgoraToken(chatId, newRole, userId);

  // Attempt to find and update the user's role and token in the activeUsers array
  const result = await Live.findOneAndUpdate(
    { chat: chatId, 'activeUsers.user': userId },
    {
      $set: {
        'activeUsers.$.role': newRole,
        'activeUsers.$.token': newToken, // Update token based on the new role
      },
    },
    { new: true }, // Return the updated document
  );

  if (!result) {
    throw new Error('User or chat not found, or role not updated');
  }

  return {
    message: 'Role and token updated successfully',
    role: newRole,
    token: newToken,
  };
};

export const LiveServices = {
  getToLiveBd,
  addLiveToDB,
  liveJoin,
  updateRole,
};
