import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { FriendControllers } from './friend.controller';

const router = Router();

router.get('/', validateAuth(USER_ROLE.USER), FriendControllers.getFriendsList);

router.get(
  '/suggestions',
  validateAuth(USER_ROLE.USER),
  FriendControllers.getFriendSuggestions,
);

router.post(
  '/requests',
  validateAuth(USER_ROLE.USER),
  FriendControllers.sendFriendRequest,
);

router.post(
  '/requests/cancel',
  validateAuth(USER_ROLE.USER),
  FriendControllers.cancelFriendRequest,
);

router.post(
  '/requests/remove',
  validateAuth(USER_ROLE.USER),
  FriendControllers.removeFriend,
);

router.post(
  '/requests/accept',
  validateAuth(USER_ROLE.USER),
  FriendControllers.acceptFriendRequest,
);

router.get(
  '/requests/received',
  validateAuth(USER_ROLE.USER),
  FriendControllers.getAllReceivedFriendRequests,
);

router.get(
  '/requests/sent',
  validateAuth(USER_ROLE.USER),
  FriendControllers.getAllSentFriendRequests,
);

router.get(
  '/profile/:id',
  validateAuth(USER_ROLE.USER),
  FriendControllers.friendProfile,
);

export const FriendRoutes = router;
