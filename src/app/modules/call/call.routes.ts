import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { CallController } from './call.controller';

const router = Router();

router.post("/", validateAuth(USER_ROLE.USER), CallController.generateToken);

export const CallRoutes = router;