import express from 'express';
import { upload } from '../../helpers/uploadConfig';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { MessageController } from './message.controller';

const router = express.Router();

router.post(
  '/send-message',
  validateAuth(USER_ROLE?.USER),
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
    {
      name: 'audio',
      maxCount: 1,
    },
  ]),
  MessageController.sendMessage,
);

router.get(
  '/chatId/:chatId',
  validateAuth(USER_ROLE?.USER),
  MessageController.getMessages,
);

export const MessageRoutes = router;
