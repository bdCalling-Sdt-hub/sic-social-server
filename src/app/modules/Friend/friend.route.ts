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
  '/requests/accept',
  validateAuth(USER_ROLE.user),
  FriendControllers.acceptFriendRequest,
);

export const FriendRoutes = router;
