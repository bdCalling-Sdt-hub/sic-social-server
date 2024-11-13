import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { LiveController } from './live.controller';

const router = Router();

// Route to generate Agora token, accessible only by authenticated users
router.post(
  '/',
  validateAuth(USER_ROLE.USER),
  LiveController.checkAndRegenerateToken,
);
router.post(
  '/create',
  validateAuth(USER_ROLE.USER),
  LiveController.createNewLive,
);
router.post(
  '/permission',
  validateAuth(USER_ROLE.USER),
  LiveController.givePermissionRole,
);

export const LiveRoutes = router;
