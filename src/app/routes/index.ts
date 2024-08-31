import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { FaqRoutes } from '../modules/FAQ/faq.route';
import { PrivacyPolicyRoutes } from '../modules/Privacy Policy/privacyPolicy.route';
import { AboutSicRoutes } from '../modules/About Sic/aboutSic.route';
import { TermsAndConditionRoutes } from '../modules/TermsAndConditions/termsAndConditions.route';

const router = Router();

const routes = [
  { path: '/users', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },

  // Settings
  { path: '/faqs', route: FaqRoutes },
  { path: '/privacy-policy', route: PrivacyPolicyRoutes },
  { path: '/terms-and-conditions', route: TermsAndConditionRoutes },
  { path: '/about-sic', route: AboutSicRoutes },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
