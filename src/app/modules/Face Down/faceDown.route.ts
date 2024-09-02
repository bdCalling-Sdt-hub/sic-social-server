import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { FacedownControllers } from './faceDown.controller';

const router = Router();

router
  .route('/')

  .get(FacedownControllers.getFacedowns)
  .post(validateAuth(USER_ROLE.user), FacedownControllers.createFacedown);

router
  .route('/:id')

  .patch(validateAuth(USER_ROLE.user), FacedownControllers.updateFacedownById)
  .delete(validateAuth(USER_ROLE.user), FacedownControllers.deleteFacedownById);

export const FacedownRoutes = router;
