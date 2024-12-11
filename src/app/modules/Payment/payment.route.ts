import { Router } from 'express';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { PaymentControllers } from './payment.controller';

const router = Router();

router
  .route('/')

  // GET request to fetch all "Payment" entries
  .get(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
    PaymentControllers.getPayments,
  )

  // POST request to create a new "Payment" entry
  .post(validateAuth(USER_ROLE.USER), PaymentControllers.savePaymentInfo);

router.post('/payment-intent/create', PaymentControllers.createPaymentIntent);

export const PaymentRoutes = router;
