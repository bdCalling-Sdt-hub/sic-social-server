import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { TermsAndConditionControllers } from './termsAndConditions.controller';

const router = Router();

router
  .route('/')

  .get(TermsAndConditionControllers.getTermsAndConditions)
  .post(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE.SUPERADMIN),
    TermsAndConditionControllers.createTermsAndConditions,
  );

router.patch(
  '/:id',
  validateAuth(USER_ROLE.ADMIN, USER_ROLE.SUPERADMIN),
  TermsAndConditionControllers.updateTermsAndConditionsById,
);

export const TermsAndConditionRoutes = router;
