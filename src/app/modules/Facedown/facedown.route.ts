import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { FacedownControllers } from './facedown.controller';
import { MemberControllers } from '../Member/member.controller';
import { upload } from '../../helpers/uploadConfig';

const router = Router();

router
  .route('/')
  .get(FacedownControllers.getFacedowns)

  .post(
    validateAuth(USER_ROLE.USER),
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'bookImage', maxCount: 1 },
    ]),
    FacedownControllers.createFacedown,
  );

router
  .route('/:facedownId')

  .patch(validateAuth(USER_ROLE.USER), FacedownControllers.updateFacedownById)
  .delete(validateAuth(USER_ROLE.USER), FacedownControllers.deleteFacedownById);

router
  .route('/members')
  .get(MemberControllers.getMembers)
  .post(validateAuth(USER_ROLE.USER), MemberControllers.addMember);

router
  .route('/members')
  .delete(validateAuth(USER_ROLE.USER), MemberControllers.removeMemberById);

router.get("/others", validateAuth(USER_ROLE.USER), FacedownControllers.othersFacedown);

export const FacedownRoutes = router;
