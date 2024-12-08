import { Router } from 'express';
import { upload } from '../../helpers/uploadConfig';
import validateAuth from '../../middlewares/validateAuth';
import { MemberControllers } from '../Member/member.controller';
import { USER_ROLE } from '../User/user.constant';
import { FacedownControllers } from './facedown.controller';

const router = Router();

router
  .route('/')
  .get(validateAuth(USER_ROLE.USER), FacedownControllers.getFacedowns)

  .post(
    validateAuth(USER_ROLE.USER),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    FacedownControllers.createFacedown,
  );
router
  .route('/others')
  .get(validateAuth(USER_ROLE.USER), FacedownControllers.othersFacedown);
router
  .route('/:facedownId')

  .patch(
    upload.fields([{ name: 'image', maxCount: 1 }]),
    validateAuth(USER_ROLE.USER),
    FacedownControllers.updateFacedownById,
  )
  .delete(validateAuth(USER_ROLE.USER), FacedownControllers.deleteFacedownById)
  .get(FacedownControllers.getFacedownById);

router
  .route('/members')
  .get(MemberControllers.getMembers)
  .post(validateAuth(USER_ROLE.USER), MemberControllers.addMember);

router
  .route('/members')
  .delete(validateAuth(USER_ROLE.USER), MemberControllers.removeMemberById);

export const FacedownRoutes = router;
