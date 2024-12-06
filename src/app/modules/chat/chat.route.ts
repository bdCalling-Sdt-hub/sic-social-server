import express from 'express'
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { ChatController } from './chat.controller'
const router = express.Router()

router.post('/', validateAuth(USER_ROLE.USER), ChatController.createChat)
router.get('/chat-list',validateAuth(USER_ROLE.USER), ChatController.chatListFromDB)
router.get('/news-feed',validateAuth(USER_ROLE.USER), ChatController.publicChatList)
router.patch('/update-conversation/:id',validateAuth(USER_ROLE.USER), ChatController.addMember);
router.patch('/participants/:id', validateAuth(USER_ROLE.USER), ChatController.chatParticipants);
router.patch('/remove/:id', validateAuth(USER_ROLE.USER), ChatController.removeParticipant);
router.delete('/delete/:id', validateAuth(USER_ROLE.USER), ChatController.deleteChat);

export const ChatRoutes = router;