/* eslint-disable @typescript-eslint/no-explicit-any */

import { JwtPayload } from 'jsonwebtoken';
import { IDonation } from './donation.interface';
import { Donation } from './donation.model';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { unlinkFile } from '../../helpers/fileHandler';
import getPathAfterUploads from '../../helpers/getPathAfterUploads';

const createDonationPostToDB = async (
  user: JwtPayload,
  payload: IDonation,
  file: any,
) => {
  // Set the createdBy field to the ID of the user who is creating the Donation
  payload.createdBy = user?.userId;

  // Check the total number of Donations in the database
  const donationCount = await Donation.countDocuments();

  // If the total number of Donations has reached the limit (5), throw an error
  if (donationCount >= 1) {
    unlinkFile(file?.path); // Remove the uploaded file to clean up
    throw new ApiError(httpStatus.CONFLICT, 'Donation creation limit reached!');
  }

  if (file && file?.path) {
    payload.details.image = getPathAfterUploads(file?.path);
  }

  // Create the new Donation entry in the database
  const result = await Donation.create(payload);
  return result;
};

const getDonationsFromDB = async () => {
  // Fetch all Donation entries from the database
  const result = await Donation.find();
  return result;
};

const updateDonationPostByIdFromDB = async (
  donationId: string,
  payload: Partial<IDonation>,
  file: any,
) => {
  // Prevent modification of the createdBy field to maintain integrity
  delete payload.createdBy;

  // Fetch the existing Donation entry from the database by its ID
  const existingDonation = await Donation.findById(donationId);

  // If the Donation entry does not exist, throw an error
  if (!existingDonation) {
    unlinkFile(file?.path); // Remove the uploaded file to clean up
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Donation with ID: ${donationId} not found!`,
    );
  }

  // If a new image is uploaded, update the image path in the payload
  if (file && file?.path) {
    const newImagePath = getPathAfterUploads(file?.path);
    // If a new image file is uploaded, update the image path in the payload
    if (existingDonation.details.image !== newImagePath) {
      unlinkFile(existingDonation?.details?.image); // Remove the old image file
      payload.details!.image = newImagePath; // Update the payload with the new image path
    }
  }

  // Update the Donation entry in the database with the new data
  const result = await Donation.findByIdAndUpdate(donationId, payload, {
    new: true, // Return the updated document
    runValidators: true,
  });
  return result;
};

export const DonationServices = {
  createDonationPostToDB,
  getDonationsFromDB,
  updateDonationPostByIdFromDB,
};
