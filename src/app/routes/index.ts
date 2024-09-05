import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { FaqRoutes } from '../modules/FAQ/faq.route';
import { PrivacyPolicyRoutes } from '../modules/PrivacyPolicy/privacyPolicy.route';
import { AboutSicRoutes } from '../modules/AboutSic/aboutSic.route';
import { TermsAndConditionRoutes } from '../modules/TermsAndConditions/termsAndConditions.route';
import { FriendRoutes } from '../modules/Friend/friend.route';
import { ChatRoutes } from '../modules/chat/chat.route';
import { MessageRoutes } from '../modules/message/message.route';
import { SicGuidelinesRoutes } from '../modules/SicGuidelines/sicGuidelines.route';
import { FacedownRoutes } from '../modules/Facedown/facedown.route';
import { DonationRoutes } from '../modules/Donation/donation.route';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { BookRoutes } from '../modules/Book/book.route';
import { FeedbackRoutes } from '../modules/Feedback/feedback.route';
import { DashboardRoutes } from '../modules/Dashboard/dashboard.route';

const router = Router();

const routes = [
  // app
  { path: '/users', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/friends', route: FriendRoutes },
  { path: '/chat', route: ChatRoutes },
  { path: '/message', route: MessageRoutes },
  { path: '/facedowns', route: FacedownRoutes },
  { path: '/payments', route: PaymentRoutes },
  { path: '/feedbacks', route: FeedbackRoutes },

  // dashboard
  { path: '/dashboard', route: DashboardRoutes },
  { path: '/donations', route: DonationRoutes },
  { path: '/categories', route: CategoryRoutes },
  { path: '/books', route: BookRoutes },

  // Settings
  { path: '/about-sic', route: AboutSicRoutes },
  { path: '/faqs', route: FaqRoutes },
  { path: '/terms-and-conditions', route: TermsAndConditionRoutes },
  { path: '/privacy-policy', route: PrivacyPolicyRoutes },
  { path: '/sic-guidelines', route: SicGuidelinesRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
