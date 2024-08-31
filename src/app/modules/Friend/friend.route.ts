import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { FriendControllers } from './friend.controller';

const router = Router();

router.post(
  '/requests',
  validateAuth(USER_ROLE.user),
  FriendControllers.sendFriendRequest,
);

router.post(
  '/requests/cancel',
  validateAuth(USER_ROLE.user),
  FriendControllers.cancelFriendRequest,
);

router.post(
  '/requests/accept',
  validateAuth(USER_ROLE.user),
  FriendControllers.acceptFriendRequest,
);

router.get(
  '/requests/received',
  validateAuth(USER_ROLE.user),
  FriendControllers.getAllReceivedFriendRequests,
);

router.get(
  '/requests/sent',
  validateAuth(USER_ROLE.user),
  FriendControllers.getAllSentFriendRequests,
);

export const FriendRoutes = router;
