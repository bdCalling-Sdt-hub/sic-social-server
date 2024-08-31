import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { IPrivacyPolicy } from './privacyPolicy.interface';
import { PrivacyPolicy } from './privacyPolicy.model';

const createPrivacyPolicyToDB = async (
  user: JwtPayload,
  payload: IPrivacyPolicy,
) => {
  // Check the total number of our stories in the database
  const privacyPolicyCount = await PrivacyPolicy.countDocuments();

  // If the total number of sliders has reached the limit (5), throw an error
  if (privacyPolicyCount >= 1) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Privacy Policy creation limit reached!',
    );
  }

  // Set the createdBy field to the ID of the user who is creating the Privacy Policy
  payload.createdBy = user?.userId;

  // Create the new Privacy Policy entry in the database
  const result = await PrivacyPolicy.create(payload);
  return result;
};

const getPrivacyPolicyFromDB = async () => {
  // Fetch all our stories entries from the database
  const result = await PrivacyPolicy.find();
  return result;
};

const updatePrivacyPolicyByIdFromDB = async (
  privacyPolicyId: string,
  payload: Partial<IPrivacyPolicy>,
) => {
  // Fetch the existing our stories entry from the database by its ID
  const existingPrivacyPolicy = await PrivacyPolicy.findById(privacyPolicyId);

  // If the Privacy Policy entry does not exist, throw an error
  if (!existingPrivacyPolicy) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Privacy Policy with ID: ${privacyPolicyId} not found!`,
    );
  }

  // Prevent modification of the createdBy field to maintain integrity
  delete payload.createdBy;
  payload.lastUpdated = new Date();

  // Update the Privacy Policy entry in the database with the new data
  const result = await PrivacyPolicy.findByIdAndUpdate(
    privacyPolicyId,
    payload,
    {
      new: true, // Return the updated document
      runValidators: true,
    },
  );

  return result;
};

export const PrivacyPolicyServices = {
  createPrivacyPolicyToDB,
  getPrivacyPolicyFromDB,
  updatePrivacyPolicyByIdFromDB,
};
