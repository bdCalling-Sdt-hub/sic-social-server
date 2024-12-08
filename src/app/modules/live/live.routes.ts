import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { LiveController } from './live.controller';

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
router.post('/update', validateAuth(USER_ROLE.USER), LiveController.liveUpdate);
router.post('/permission', LiveController.givePermissionRole);
router.post('/request', LiveController.requestRole);
router.patch(
  '/toggle_mute',
  validateAuth(USER_ROLE.USER),
  LiveController.ToggleMute,
);
router.patch(
  '/remove',
  validateAuth(USER_ROLE.USER),
  LiveController.removeUser,
);

export const LiveRoutes = router;
