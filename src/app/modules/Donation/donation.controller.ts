import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DonationServices } from './donation.service';

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

export const DonationControllers = {
  createDonation,
  getDonations,
  updateDonationById,
};
