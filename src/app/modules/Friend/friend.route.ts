import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { FriendControllers } from './friend.controller';

const router = Router();

router.get(
  '/',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  FriendControllers.getFriendsList,
);

router.get(
  '/suggestions',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  FriendControllers.getFriendSuggestions,
);

router.post(
  '/requests',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  FriendControllers.sendFriendRequest,
);

router.post(
  '/requests/cancel',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  FriendControllers.cancelFriendRequest,
);

router.post(
  '/requests/remove',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  FriendControllers.removeFriend,
);

router.post(
  '/requests/accept',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  FriendControllers.acceptFriendRequest,
);

router.get(
  '/requests/received',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  FriendControllers.getAllReceivedFriendRequests,
);

router.get(
  '/requests/sent',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  FriendControllers.getAllSentFriendRequests,
);

export const FriendRoutes = router;
