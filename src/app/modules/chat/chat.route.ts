import express from 'express'
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { ChatController } from './chat.controller'
const router = express.Router()

router.post('/', validateAuth(USER_ROLE.user), ChatController.createChat)
router.get('/chat-list',validateAuth(USER_ROLE.user), ChatController.chatListFromDB)
router.get('/news-feed',validateAuth(USER_ROLE.user), ChatController.publicChatList)
router.patch('/update-conversation/:id',validateAuth(USER_ROLE.user), ChatController.addMember)

export const ChatRoutes = router;