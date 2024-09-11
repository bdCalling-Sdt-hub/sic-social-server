import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import seedSuperAdmin from './app/DB';
import logger from './app/logger/winston.logger';
import colors from 'colors';

let server: Server;

async function main() {
  try {
    const connectionInstance = await mongoose.connect(
      `${config.dbURL}/${config.collectionName}`,
    );

    seedSuperAdmin();

    logger.info(
      colors.bgGreen.bold(
        `✅ Database Connected! Host: ${connectionInstance?.connection?.host}`,
      ),
    );

    server = app.listen(Number(config.port), config.ipAddress as string, () => {
      logger.info(
        colors.bgYellow.bold(
          `🚀 Server running on: ${config.ipAddress}:${config.port}`,
        ),
      );
    });
  } catch (error) {
    logger.error(colors.bgCyan.bold(`❌ MongoDB connection error: ${error}`));
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (error) => {
  logger.error(
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
  logger.error(
    colors.bgRed.bold(`❌ Uncaught exception: ${error}, shutting down...`),
  );
  process.exit(1);
});
