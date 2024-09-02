import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { FacedownControllers } from './facedown.controller';
import { MemberControllers } from '../Member/member.controller';

const router = Router();

router
  .route('/')

  .get(FacedownControllers.getFacedowns)
  .post(validateAuth(USER_ROLE.user), FacedownControllers.createFacedown);

router
  .route('/:facedownId')

  .patch(validateAuth(USER_ROLE.user), FacedownControllers.updateFacedownById)
  .delete(validateAuth(USER_ROLE.user), FacedownControllers.deleteFacedownById);

router
  .route('/members')

  .get(MemberControllers.getMembers)
  .post(validateAuth(USER_ROLE.user), MemberControllers.addMember);

router
  .route('/members')
  .delete(validateAuth(USER_ROLE.user), MemberControllers.removeMemberById);

export const FacedownRoutes = router;
