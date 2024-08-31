import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { IAboutSic } from './aboutSic.interface';
import { AboutSic } from './aboutSic.model';

const createAboutSicToDB = async (user: JwtPayload, payload: IAboutSic) => {
  // Check the total number of about sic in the database
  const aboutSicCount = await AboutSic.countDocuments();

  // If the total number of sliders has reached the limit (5), throw an error
  if (aboutSicCount >= 1) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'About Sic creation limit reached!',
    );
  }

  // Set the createdBy field to the ID of the user who is creating the About Sic
  payload.createdBy = user?.userId;

  // Create the new About Sic entry in the database
  const result = await AboutSic.create(payload);
  return result;
};

const getAboutSicFromDB = async () => {
  // Fetch all about sic entries from the database
  const result = await AboutSic.find();
  return result;
};

const updateAboutSicByIdFromDB = async (
  aboutSicId: string,
  payload: Partial<IAboutSic>,
) => {
  // Fetch the existing about sic entry from the database by its ID
  const existingAboutSic = await AboutSic.findById(aboutSicId);

  // If the About Sic entry does not exist, throw an error
  if (!existingAboutSic) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `About Sic with ID: ${aboutSicId} not found!`,
    );
  }

  // Prevent modification of the createdBy field to maintain integrity
  delete payload.createdBy;
  payload.lastUpdated = new Date();

  // Update the About Sic entry in the database with the new data
  const result = await AboutSic.findByIdAndUpdate(aboutSicId, payload, {
    new: true, // Return the updated document
    runValidators: true,
  });

  return result;
};

export const AboutSicServices = {
  createAboutSicToDB,
  getAboutSicFromDB,
  updateAboutSicByIdFromDB,
};
