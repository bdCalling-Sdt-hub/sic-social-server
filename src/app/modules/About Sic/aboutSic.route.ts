import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { AboutSicControllers } from './aboutSic.controller';

const router = Router();

router
  .route('/')

  // GET request to fetch all about sic entries
  .get(AboutSicControllers.getAboutSic)

  // POST request to create a new about sic entry
  .post(
    validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
    AboutSicControllers.getAboutSic,
  );

// PATCH request to update an existing about sic entry by its ID
router.patch(
  '/:id',
  validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AboutSicControllers.updateAboutSicById,
);

export const AboutSicRoutes = router;
