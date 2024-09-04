import { Router } from 'express';
import { USER_ROLE } from '../User/user.constant';
import { FeedbackControllers } from './feedback.controller';
import validateAuth from '../../middlewares/validateAuth';

const router = Router();

// Route to get all feedbacks or create a new feedback
router
  .route('/')

  .get(
    validateAuth(USER_ROLE.admin, USER_ROLE.superAdmin),
    FeedbackControllers.getAllFeedbacks,
  )

  .post(
    validateAuth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    FeedbackControllers.createFeedback,
  );

export const FeedbackRoutes = router;
