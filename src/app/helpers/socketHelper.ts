/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../utils/winstonLogger';
import { Friend } from '../modules/Friend/friend.model';
const activeUsers = new Map<string, string>();

const socket = (io: Server) => {
  io.on('connection', socket => {
    logger.info(colors.blue('A user connected'));

    // Handle user activation (store the userId and socketId)
    socket.on('active', (userId) => {
      activeUsers.set(userId, socket.id);
      logger.info(colors.green(`User ${userId} is now active`));
    });

    socket.on("activeUsers", async (props)=>{

      const {userId} = JSON.parse(props);

      const friends:any = await Friend.find({ status: 'accepted', recipientId: userId })
      .populate({
        path: 'senderId',
        select: 'fullName avatar',
      })
      .select('senderId');

      // Filter friends who are currently active
      const activeFriends = friends.filter((friend:any) => 
      activeUsers.has(friend?.senderId?._id.toString()));

      // Send the active friends back to the client
      socket.emit(`activeFriends`, activeFriends);
    })

    //disconnect
    socket.on('disconnect', async() => {
      logger.info(colors.red('A user disconnect'));
      const userId = [...activeUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
      if (userId) {
        activeUsers.delete(userId);
        logger.info(colors.yellow(`User ${userId} is now inactive`));
      }
    });
  });
};

export const socketHelper = { socket };
