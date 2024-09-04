import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { FriendControllers } from './friend.controller';

const router = Router();

router.get(
  '/',
  validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  FriendControllers.getFriendsList,
);

router.get(
  '/suggestions',
  validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  FriendControllers.getFriendSuggestions,
);

router.post(
  '/requests',
  validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  FriendControllers.sendFriendRequest,
);

router.post(
  '/requests/cancel',
  validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  FriendControllers.cancelFriendRequest,
);

router.post(
  '/requests/remove',
  validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  FriendControllers.removeFriend,
);

router.post(
  '/requests/accept',
  validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  FriendControllers.acceptFriendRequest,
);

router.get(
  '/requests/received',
  validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  FriendControllers.getAllReceivedFriendRequests,
);

router.get(
  '/requests/sent',
  validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  FriendControllers.getAllSentFriendRequests,
);

export const FriendRoutes = router;
