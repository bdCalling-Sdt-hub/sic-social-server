import generateAgoraToken from '../../helpers/generateAgoraToken';
import { Live } from './live.modal';
const addLiveToDB = async (chatId: string, role: string, userId: string) => {
  const token = generateAgoraToken(chatId, role, userId);

  let liveChat = await Live.findOne({ chat: chatId });
  if (!liveChat) {
    liveChat = await Live.create({
      chat: chatId,
      host: userId,
      activeUsers: [
        {
          user: userId,
          joinTime: new Date(),
          role,
          token,
        },
      ],
    });
    return liveChat;
  } else {
    throw new Error('Live chat with this chatId already exists');
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
    token = existingUser.token;
  } else {
    token = generateAgoraToken(chatId, role, userId);

    await Live.updateOne(
      { chat: chatId },
      {
        $addToSet: {
          activeUsers: { user: userId, joinTime: new Date(), role, token },
        },
      },
      { upsert: true },
    );
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
  addLiveToDB,
  liveJoin,
  updateRole,
};
