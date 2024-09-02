import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../utils/winstonLogger';
const activeUsers = new Set(); 

const socket = (io: Server) => {
  io.on('connection', socket => {
    logger.info(colors.blue('A user connected'));

    socket.on("active", (userId)=>{
      activeUsers.add(userId);
    })

    socket.on("activeUsers", (userId)=>{
      console.log(userId);
    })



    //disconnect
    socket.on('disconnect', () => {
      logger.info(colors.red('A user disconnect'));
    });
  });
};

export const socketHelper = { socket };
