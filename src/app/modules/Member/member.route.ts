import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { MemberControllers } from './member.controller';

const router = Router();

router
  .route('/')

  .get(MemberControllers.getMembers)
  .post(validateAuth(USER_ROLE.user), MemberControllers.createMember);

router
  .route('/:id')

  .patch(validateAuth(USER_ROLE.user), MemberControllers.updateMemberById)
  .delete(validateAuth(USER_ROLE.user), MemberControllers.deleteMemberById);

export const MemmberRoutes = router;
