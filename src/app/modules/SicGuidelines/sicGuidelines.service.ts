import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { ISicGuidelines } from './sicGuidelines.interface';
import { SicGuidelines } from './sicGuidelines.model';

const createSicGuidelinesToDB = async (
  user: JwtPayload,
  payload: ISicGuidelines,
) => {
  // Check the total number of Sic guidelines in the database
  const SicGuidelinesCount = await SicGuidelines.countDocuments();

  // If the total number of Sic guidelines has reached the limit 1, throw an error
  if (SicGuidelinesCount >= 1) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Sic guidelines creation limit reached!',
    );
  }

  // Set the createdBy field to the ID of the user who is creating the Sic guidelines
  payload.createdBy = user?.userId;

  // Create the new Sic guidelines entry in the database
  const result = await SicGuidelines.create(payload);
  return result;
};

const getSicGuidelinesFromDB = async () => {
  // Fetch all Sic guidelines entries from the database
  const result = await SicGuidelines.find();
  return result;
};

const updateSicGuidelinesByIdFromDB = async (
  sicGuidelinesId: string,
  payload: Partial<ISicGuidelines>,
) => {
  // Fetch the existing Sic guidelines entry from the database by its ID
  const existingSicGuidelines = await SicGuidelines.findById(sicGuidelinesId);

  // If the Sic guidelines entry does not exist, throw an error
  if (!existingSicGuidelines) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Sic guidelines with ID: ${sicGuidelinesId} not found!`,
    );
  }

  // Prevent modification of the createdBy field to maintain integrity
  delete payload.createdBy;

  // Update the Sic guidelines entry in the database with the new data
  const result = await SicGuidelines.findByIdAndUpdate(
    sicGuidelinesId,
    payload,
    {
      new: true, // Return the updated document
      runValidators: true,
    },
  );

  return result;
};

export const SicGuidelinesServices = {
  createSicGuidelinesToDB,
  getSicGuidelinesFromDB,
  updateSicGuidelinesByIdFromDB,
};
