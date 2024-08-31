import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { PrivacyPolicyControllers } from './privacyPolicy.controller';

const router = Router();

router
  .route('/')

  // GET request to fetch all privacy policy entries
  .get(PrivacyPolicyControllers.getPrivacyPolicy)

  // POST request to create a new privacy policy entry
  .post(
    validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
    PrivacyPolicyControllers.createPrivacyPolicy,
  );

// PATCH request to update an existing privacy policy entry by its ID
router.patch(
  '/:id',
  validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
  PrivacyPolicyControllers.updatePrivacyPolicyById,
);

export const StoryRoutes = router;