import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { SicGuidelinesControllers } from './sicGuidelines.controller';

const router = Router();

router
  .route('/')

  // GET request to fetch all sic guidelines entries
  .get(SicGuidelinesControllers.getSicGuidelines)

  // POST request to create a new sic guidelines entry
  .post(
    validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
    SicGuidelinesControllers.getSicGuidelines,
  );

// PATCH request to update an existing sic guidelines entry by its ID
router.patch(
  '/:id',
  validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SicGuidelinesControllers.updateSicGuidelinesById,
);

export const SicGuidelinesRoutes = router;