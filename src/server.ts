/* eslint-disable @typescript-eslint/no-explicit-any */

import { errorLogger, logger } from './app/utils/winstonLogger';

import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './app/config';
import seedSuperAdmin from './app/DB';
import { socketHelper } from './app/helpers/socketHelper';

let server:any;

async function main() {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.dbURL}/${config.collectionName}`,
    );

    seedSuperAdmin();

    logger.info(
      colors.bgGreen.bold(
        `✅ Database Connected! Host: ${connectionInstance?.connection?.host} ${config.dbURL}/${config.collectionName}`,
      ),
    );

    server = app.listen(Number(config.port), config.ipAddress as string, () => {
      logger.info(
        colors.bgYellow.bold(
          `🚀 Server running on: ${config.ipAddress}:${config.port}`,
        ),
      );
    });

    //socket
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });

    socketHelper.socket(io);
    global.io = io;


  } catch (error) {
    errorLogger.error(
      colors.bgCyan.bold(`❌ MongoDB connection error: ${error}`),
    );
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (error) => {
  errorLogger.error(
    colors.bgYellow.bold(`⚠️ Unhandled rejection, shutting down... ${error}`),
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  errorLogger.error(
    colors.bgRed.bold(`❌ Uncaught exception: ${error}, shutting down...`),
  );
  process.exit(1);
});
