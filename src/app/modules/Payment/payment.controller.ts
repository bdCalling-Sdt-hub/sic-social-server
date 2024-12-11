import httpStatus from 'http-status';
import Stripe from 'stripe';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';
const stripe = new Stripe(config.stripeSecretKey as string);

const savePaymentInfo = catchAsync(async (req, res) => {
  const result = await PaymentServices.savePaymentInfoToDB(
    req?.user,
    req?.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment processed successfully!',
    data: result,
  });
});

const getPayments = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentsFromDB(req?.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment records retrieved successfully!',
    data: result,
  });
});

const createPaymentIntent = catchAsync(async (req, res) => {
  const { price } = req.body;
  const isPriceValid = typeof price === 'number' && price > 0;

  if (!isPriceValid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'The price must be a positive number.',
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

export const PaymentControllers = {
  savePaymentInfo,
  getPayments,
  createPaymentIntent,
};
