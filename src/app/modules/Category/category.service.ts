import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { ICategory } from './category.interface';
import { Category } from './category.model';
import { JwtPayload } from 'jsonwebtoken';

const createCategoryToDB = async (user: JwtPayload, payload: ICategory) => {
  payload.createdBy = user?.userId;

  const result = await Category.create(payload);
  return result;
};

const getCategoriesFromDB = async () => {
  const result = await Category.find();
  return result;
};

const updateCategoryByIdFromDB = async (
  categoryId: string,
  payload: Partial<ICategory>,
) => {
  // Prevent modification of the createdBy field to maintain integrity
  delete payload.createdBy;

  // Fetch the existing Category entry from the database by its ID
  const existingCategory = await Category.findById(categoryId);

  // If the Category entry does not exist, throw an error
  if (!existingCategory) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Category with ID: ${categoryId} not found!`,
    );
  }

  // Update the Category with the provided status
  const result = await Category.findByIdAndUpdate(categoryId, payload, {
    new: true, // Return the updated document
  });

  return result;
};

const deleteCategoryByIdFromDB = async (categoryId: string) => {
  // Update the Category with the provided status
  const result = await Category.findByIdAndDelete(categoryId);

  // Handle case where no Category is found
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Category with ID: ${categoryId} not found!`,
    );
  }
};

export const CategoryServices = {
  createCategoryToDB,
  getCategoriesFromDB,
  updateCategoryByIdFromDB,
  deleteCategoryByIdFromDB,
};
