import { Router } from 'express';
import { PaymentControllers } from './payment.controller';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';

const router = Router();

router
  .route('/')

  // GET request to fetch all "Payment" entries
  .get(
    validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
    PaymentControllers.getPayments,
  )

  // POST request to create a new "Payment" entry
  .post(
    validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    PaymentControllers.savePaymentInfo,
  );

router.post(
  '/payment-intent/create',
  validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  PaymentControllers.createPaymentIntent,
);

export const PaymentRoutes = router;
