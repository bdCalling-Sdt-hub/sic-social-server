import { Router } from 'express';
import { USER_ROLE } from '../User/user.constant';
import { FeedbackControllers } from './feedback.controller';
import validateAuth from '../../middlewares/validateAuth';

const router = Router();

// Route to get all feedbacks or create a new feedback
router
  .route('/')

  .get(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
    FeedbackControllers.getAllFeedbacks,
  )

  .post(validateAuth(USER_ROLE.USER), FeedbackControllers.createFeedback);

export const FeedbackRoutes = router;
