import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DonationServices } from './donation.service';

const createDonationPost = catchAsync(async (req, res) => {
  const result = await DonationServices.createDonationPostToDB(
    req?.user,
    req?.body,
    req?.file,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Donation post created successfully!',
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

const updateDonationPostById = catchAsync(async (req, res) => {
  const result = await DonationServices.updateDonationPostByIdFromDB(
    req?.params?.id,
    req?.body,
    req?.file,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation post updated successfully!',
    data: result,
  });
});

export const DonationControllers = {
  createDonationPost,
  getDonations,
  updateDonationPostById,
};
