import { Friend } from '../modules/Friend/friend.model';
import { Server } from 'socket.io';
import colors from 'colors';
import { logger } from '../utils/winstonLogger';
import mongoose from 'mongoose';

const activeUsers = new Map<string, string>();

const socket = (io: Server) => {
  io.on('connection', (socket) => {
    logger.info(colors.blue('A user connected'));

    // Handle user activation (store the userId and socketId)
    socket.on('active', (userData) => {
      try {
        const { userId } = JSON.parse(userData);
        if (userId) {
          activeUsers.set(userId, socket.id);
          logger.info(colors.green(`User ${userId} is now active`));
        }
      } catch (error) {
        logger.error('Failed to parse user data for activation:', error);
      }
    });

    socket.on('activeUsers', async (props) => {
      try {
        // Parse userId from props and validate it
        const { userId } = JSON.parse(props);
        if (!userId) throw new Error('Invalid userId');

        logger.info(
          colors.green(`User ${userId} is now fetching active users`),
        );

        // Fetch accepted friends for the given userId
        const friends = await Friend.find({
          status: 'accepted',
          $or: [
            { senderId: new mongoose.Types.ObjectId(userId) },
            { recipientId: new mongoose.Types.ObjectId(userId) },
          ],
        })
          .populate({
            path: 'senderId',
            select: 'fullName avatar',
          })
          .populate({
            path: 'recipientId',
            select: 'fullName avatar',
          })
          .select('senderId recipientId');

        const activeFriends = friends
          .filter((friend: any) => {
            const senderId = friend.senderId._id.toString();
            const recipientId = friend.recipientId._id.toString();

            const isSenderActive =
              senderId === userId && activeUsers.has(recipientId);
            const isRecipientActive =
              recipientId === userId && activeUsers.has(senderId);

            // console.log({
            //   userId,
            //   senderId,
            //   recipientId,
            //   isSenderActive,
            //   isRecipientActive,
            //   activeUsersMap: [...activeUsers.keys()],
            // });

            return isSenderActive || isRecipientActive;
          })
          .map((friend: any) => {
            if (friend.senderId._id.toString() === userId) {
              return {
                _id: friend.recipientId._id,
                fullName: friend.recipientId.fullName,
                avatar: friend.recipientId.avatar,
              };
            } else {
              return {
                _id: friend.senderId._id,
                fullName: friend.senderId.fullName,
                avatar: friend.senderId.avatar,
              };
            }
          });

        // Log active friends for debugging
        // console.log(activeFriends);
        // Send the list of active friends back to the client
        // socket.to(socket.id).emit('activeFriends', activeFriends);
        socket.emit('activeFriends', activeFriends);
      } catch (error) {
        logger.error('Failed to fetch active users:', error);
        socket.emit('error', 'Failed to fetch active users');
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnected'));
      const userId = [...activeUsers.entries()].find(
        ([_, id]) => id === socket.id,
      )?.[0];
      if (userId) {
        activeUsers.delete(userId);
        logger.info(colors.yellow(`User ${userId} is now inactive`));
      }
    });
  });
};

export const socketHelper = { socket };
