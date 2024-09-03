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

const router = Router();

const routes = [
  { path: '/users', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/friends', route: FriendRoutes },
  { path: '/chat', route: ChatRoutes },
  { path: '/message', route: MessageRoutes },
  { path: '/facedowns', route: FacedownRoutes },

  // Settings
  { path: '/faqs', route: FaqRoutes },
  { path: '/privacy-policy', route: PrivacyPolicyRoutes },
  { path: '/terms-and-conditions', route: TermsAndConditionRoutes },
  { path: '/about-sic', route: AboutSicRoutes },
  { path: '/sic-guidelines', route: SicGuidelinesRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
