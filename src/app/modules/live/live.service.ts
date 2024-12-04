import generateAgoraToken from '../../helpers/generateAgoraToken';
import { generateNumericUID } from '../../helpers/generateNumericUID';
import { Chat } from '../chat/chat.model';
import { Live } from './live.modal';
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

const getToLiveBd = async (liveId: string) => {
  const liveChat = await Live.findById(liveId)
    .populate([
      { path: 'activeUsers.user', select: 'fullName avatar' },
      // { path: 'host', select: 'fullName' }, // Example of populating the host field as well
    ])
    .populate({
      path: 'book',
      select: 'name bookUrl bookImage publisher',
    });

  // console.log(updateLiveId);

  return liveChat || {};
};
const addLiveToDB = async (
  chatId: string,
  role: string,
  book: string,
  name: string,
  userId: string,
) => {
  const token = generateAgoraToken(chatId, role, userId);

  const existChat = Chat.findOne({ _id: chatId });

  // console.log(book);

  if (!existChat) {
    throw new Error('Chat does not exist');
  }
  // Check if a live chat with the same chatId already exists
  let liveChat = await Live.findOne({ chat: chatId });
  if (!liveChat) {
    liveChat = await Live.create({
      chat: chatId,
      createBy: userId,
      book: book,
      name: name,
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
const removeUserFormDB = async (chatId: string, userId: string) => {
  // Check if the userId needs to be converted to ObjectId (if it's stored as ObjectId in MongoDB)
  const results = await Live.updateOne(
    {
      chat: chatId, // The chat ID where the user exists
      'activeUsers.user': userId, // Directly use userId if it's stored as a string
    },
    {
      $pull: {
        activeUsers: {
          user: userId, // Remove the user with this ID
        },
      },
    },
  );

  const liveChat = await Live.findOne({ chat: chatId }).lean();

  if (!liveChat) {
    throw new Error('Chat does not exist');
  }

  // have not active users with host then remove the live chat
  if (!liveChat.activeUsers.find((user) => user.role === 'host')) {
    await Live.deleteOne({ chat: chatId });
    await Chat.deleteOne({ _id: chatId });
  }

  // message handling with socket
  //@ts-ignore
  const socketIo = global.io;
  if (socketIo) {
    socketIo.emit(`live::${chatId?.toString()}`, {
      message: 'leave',
      user: userId,
    });
  }

  // Return results for debugging
  return results;
};

const liveJoin = async (chatId: string, userId: string) => {
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
    token = generateAgoraToken(
      chatId,
      existingUser ? existingUser.role : 'audience',
      userId,
    );

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
              role:
                liveChat?.createBy?.toString() === userId?.toString()
                  ? 'host'
                  : 'audience',
              token,
            },
          },
        },
        { upsert: true, new: true },
      );
    }
  }
  //message
  //@ts-ignore
  const socketIo = global.io;
  if (socketIo) {
    socketIo.emit(`live::${chatId?.toString()}`, {
      message: 'join',
      user: userId,
    });
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
  )
    .select('activeUsers.user')
    .lean();

  if (!result) {
    throw new Error('User or chat not found, or role not updated');
  }

  //message
  //@ts-ignore
  const socketIo = global.io;
  if (socketIo) {
    socketIo.emit(`live::${chatId?.toString()}`, result.activeUsers[0]);
  }

  return {
    message: 'Role and token updated successfully',
    data: result.activeUsers[0],
  };
};
const updateLiveDB = async (
  payload: { name: string; book: string; chatId: string },
  userId: string,
) => {
  const result = await Live.findOneAndUpdate(
    { chat: payload?.chatId, 'activeUsers.user': userId },
    {
      $set: {
        name: payload?.name,
        book: payload?.book,
      },
    },
    { new: true }, // Return the updated document
  ).lean();

  if (!result) {
    throw new Error('User or chat not found, or role not updated');
  }

  return {
    message: 'Live updated successfully',
    data: result,
  };
};
const roleRequest = async (chatId: string, userId: string, message: string) => {
  // Validate role (only 'host' and 'audience' allowed)

  // Attempt to find and update the user's role and token in the activeUsers array
  const result = await Live.findOne({
    chat: chatId,
    'activeUsers.user': userId,
  }).lean();

  // console.log('hostId', result?.host);

  //message
  //@ts-ignore
  const socketIo = global.io;

  if (message === 'request') {
    if (socketIo) {
      socketIo.emit(`live::${result?.createBy?.toString()}::${chatId}`, {
        message: message,
        user: result?.activeUsers?.find(
          (user) => user.user.toString() === userId,
        )?.user,
      });
    }
  }
  if (message === 'reject') {
    if (socketIo) {
      socketIo.emit(`live::${userId}::${chatId}`, {
        message: message,
      });
    }
  }
  if (message === 'accept') {
    if (socketIo) {
      socketIo.emit(`live::${userId}::${chatId}`, {
        message: message,
      });
    }
  }

  return {
    message: 'request sent successfully',
  };
};

export const LiveServices = {
  getToLiveBd,
  addLiveToDB,
  liveJoin,
  updateRole,
  roleRequest,
  removeUserFormDB,
  updateLiveDB,
};
