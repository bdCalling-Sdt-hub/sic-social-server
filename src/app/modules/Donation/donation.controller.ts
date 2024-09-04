import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DonationServices } from './donation.service';
import ApiError from '../../errors/ApiError';
import Stripe from 'stripe';
import config from '../../config';
const stripe = new Stripe(config.stripeSecretKey as string);

const createDonation = catchAsync(async (req, res) => {
  const result = await DonationServices.createDonationToDB(
    req?.user,
    req?.body,
    req?.file,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Donation created successfully!',
    data: result,
  });
});

const getDonations = catchAsync(async (req, res) => {
  const result = await DonationServices.getDonationsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donations retrieved successfully!',
    data: result,
  });
});

const updateDonationById = catchAsync(async (req, res) => {
  const result = await DonationServices.updateDonationByIdFromDB(
    req?.params?.id,
    req?.body,
    req?.file,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation updated successfully!',
    data: result,
  });
});

const createPaymentIntent = catchAsync(async (req, res) => {
  const { price } = req.body;
  const isPriceValid = typeof price === 'number' && price > 0;

  if (!isPriceValid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'The price must be a positive number',
    );
  }

  const amountInCents = Math.round(price * 100);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment intent created successfully!',
    data: {
      clientSecret: paymentIntent?.client_secret,
    },
  });
});

export const DonationControllers = {
  createDonation,
  getDonations,
  updateDonationById,
  createPaymentIntent,
};
