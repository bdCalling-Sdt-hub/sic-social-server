import express from 'express'
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { MessageController } from './message.controller'
import { upload } from '../../helpers/uploadConfig';
const router = express.Router()

router.post(
  '/send-message',
  validateAuth(USER_ROLE?.user),
  upload.fields([
    {
      name: "image", maxCount:1
    },
    {
      name: "audio" , maxCount: 1
    }
  ]),
  MessageController.sendMessage,
)

router.get(
  '/chatId/:chatId', validateAuth(USER_ROLE?.user), MessageController.getMessages,
)

export const MessageRoutes = router
