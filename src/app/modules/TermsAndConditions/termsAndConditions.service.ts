import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { ITermsAndConditions } from './termsAndConditions.interface';
import { TermsAndConditions } from './termsAndConditions.model';

const createTermsAndConditionsToDB = async (
  user: JwtPayload,
  payload: ITermsAndConditions,
) => {
  // Check the total number of Terms And Conditions in the database
  const termsAndConditionsCount = await TermsAndConditions.countDocuments();

  // Enforce the global limit of 1 Terms And Conditions
  if (termsAndConditionsCount >= 1) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Terms and conditions creation limit reached!',
    );
  }

  payload.createdBy = user?.userId;

  const result = await TermsAndConditions.create(payload);
  return result;
};

const getTermsAndConditionsFromDB = async () => {
  const result = await TermsAndConditions.find();
  return result;
};

const updateTermsAndConditionsByIdFromDB = async (
  termsAndConditionsId: string,
  payload: Partial<ITermsAndConditions>,
) => {
  // Remove the createdBy field from the payload
  delete payload.createdBy;

  // Update the Terms And Conditions
  const result = await TermsAndConditions.findByIdAndUpdate(
    termsAndConditionsId,
    payload,
    {
      new: true, // Return the updated document
    },
  );

  // Handle case where no Terms And Conditions is found
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Terms and conditions with ID: ${termsAndConditionsId} not found!`,
    );
  }

  return result;
};

export const TermsAndConditionServices = {
  createTermsAndConditionsToDB,
  getTermsAndConditionsFromDB,
  updateTermsAndConditionsByIdFromDB,
};
