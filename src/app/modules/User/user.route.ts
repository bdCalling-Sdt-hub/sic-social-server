import { NextFunction, Request, Response, Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userValidationSchema } from './user.validation';
import validateAuth from '../../middlewares/validateAuth';
import { upload } from '../../helpers/uploadConfig';
import { USER_ROLE } from './user.constant';

const router = Router();

router.get(
  '/',
  validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  UserControllers.getUsers,
);

router.get(
  '/admins',
  validateAuth(USER_ROLE['SUPER-ADMIN']),
  UserControllers.getAdmins,
);

router.get(
  '/profile',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  UserControllers.getUserProfile,
);

router.get('/user-count', UserControllers.getUsersCount);
router.get('/user-count/:year', UserControllers.getUserCountByYear);

router.post(
  '/create-user',
  validateRequest(userValidationSchema.createUserSchema),
  UserControllers.createUser,
);

router.post(
  '/create-admin',
  validateAuth(USER_ROLE['SUPER-ADMIN']),
  validateRequest(userValidationSchema.createAdminSchema),
  UserControllers.createAdmin,
);

router.patch(
  '/update-profile',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  upload.single('avatar'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req?.body?.data);
    next();
  },
  UserControllers.updateUserProfile,
);

export const UserRoutes = router;
