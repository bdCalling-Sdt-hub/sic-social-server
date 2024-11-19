import { LiveController } from './live.controller';
import { Router } from 'express';
import { USER_ROLE } from '../User/user.constant';
import validateAuth from '../../middlewares/validateAuth';

const router = Router();

// Route to generate Agora token, accessible only by authenticated users
router.get('/:id', validateAuth(USER_ROLE.USER), LiveController.getLiveById);
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
router.post('/permission', LiveController.givePermissionRole);
router.post('/request', LiveController.requestRole);
router.patch(
  '/remove',
  validateAuth(USER_ROLE.USER),
  LiveController.removeUser,
);

export const LiveRoutes = router;
