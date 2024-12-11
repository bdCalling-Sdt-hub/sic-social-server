import { NextFunction, Request, Response, Router } from 'express';

import { upload } from '../../helpers/uploadConfig';
import validateAuth from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { DonationControllers } from './donation.controller';

const router = Router();

router
  .route('/')

  // GET request to fetch all "Donation" entries
  .get(DonationControllers.getDonations)

  // POST request to create a new "Donation" entry
  .post(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req?.body?.data);
      next();
    },
    DonationControllers.createDonationPost,
  );

router
  .route('/:id')

  // PATCH request to update an existing "Donation" entry by its ID
  .patch(
    validateAuth(USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
    upload.single('image'),
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req?.body?.data);
      next();
    },
    DonationControllers.updateDonationPostById,
  );

export const DonationRoutes = router;
