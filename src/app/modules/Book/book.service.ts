/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { unlinkFile } from '../../helpers/fileHandler';
import getPathAfterUploads from '../../helpers/getPathAfterUploads';
import { Category } from '../Category/category.model';
import { IBook } from './book.interface';
import { Book } from './book.model';

const createBookToDB = async (user: JwtPayload, payload: IBook, files: any) => {
  // Set the createdBy field to the ID of the user who is creating
  payload.createdBy = user?.userId;

  // Extract and set the image file path
  if (files && files?.bookImage) {
    payload.bookImage = getPathAfterUploads(files?.bookImage?.[0]?.path);
  }

  // Extract and set the pdf file path
  if (files && files?.pdf) {
    payload.pdf = getPathAfterUploads(files?.pdf?.[0]?.path);
  }

  const result = await Book.create(payload);
  return result;
};

const getBooksAllFromDB = async (query: Record<string, unknown>) => {
  // Build the query using QueryBuilder with the given query parameters
  const books = await Book.find()
    .lean()
    .select('name bookUrl bookImage publisher category pdf');
  if (!books) return [];
  return books;
};
const getBooksFromDB = async (query: Record<string, unknown>) => {
  // Build the query using QueryBuilder with the given query parameters
  const categories = await Category.find().lean();
  if (!categories) return [];
  const results = await Promise.all(
    categories?.map(async (category: any) => {
      return {
        name: category.name,
        count: (await Book.countDocuments({ category: category.name })) || 0,

        booksList: await Book.find({ category: category.name })
          .lean()
          .select('name bookUrl bookImage publisher category pdf'),
      };
    }),
  );
  return results;
};

const getBookByIdFromDB = async (bookId: string) => {
  // Find the Book by ID
  const result = await Book.findById(bookId);

  // Handle case where no Book is found
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Book with ID: ${bookId} not found!`,
    );
  }

  return result;
};
const getBookByCategoryFromDB = async (category: string) => {
  // Find the Book by ID
  const result = await Book.find({ category: category }).select(
    'name bookUrl bookImage publisher category pdf',
  );

  // Handle case where no Book is found
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Book with ID: ${category} not found!`,
    );
  }

  return result;
};

const updateBookByIdFromDB = async (
  bookId: string,
  payload: Partial<IBook>,
  files: any,
) => {
  // Fetch the existing Book entry from the database by its ID
  const existingBook = await Book.findById(bookId);

  // If the Book entry does not exist, throw an error
  if (!existingBook) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Book with ID: ${bookId} not found!`,
    );
  }

  // Prevent modification of the createdBy field to maintain integrity
  delete payload.createdBy;

  // If a new image is uploaded, update the image path in the payload
  if (files && files?.bookImage) {
    const newCoverImagePath = getPathAfterUploads(files?.bookImage[0]?.path);

    // If a new image file is uploaded, update the image path in the payload
    if (existingBook?.bookImage !== newCoverImagePath) {
      payload.bookImage = newCoverImagePath; // Update the payload with the new image path
      unlinkFile(existingBook?.bookImage); // Remove the old image file
    }
  }

  // If a new image is uploaded, update the image path in the payload
  if (files && files?.pdf) {
    const newBookPdfPath = getPathAfterUploads(files?.bookImage[0]?.path);

    // If a new image file is uploaded, update the image path in the payload
    if (existingBook?.pdf !== newBookPdfPath) {
      payload.pdf = newBookPdfPath; // Update the payload with the new image path
      unlinkFile(existingBook?.pdf); // Remove the old image file
    }
  }

  // Update the Book with the provided status
  const result = await Book.findByIdAndUpdate(bookId, payload, {
    new: true, // Return the updated document
    runValidators: true,
  });

  return result;
};

const deleteBookByIdFromDB = async (bookId: string) => {
  // Delete the Book entry from the database by its ID
  const result = await Book.findByIdAndDelete(bookId);

  // If the Book entry has an associated image, remove the image file
  if (result?.bookImage) {
    unlinkFile(result?.bookImage);
  }

  if (result?.pdf) {
    unlinkFile(result?.pdf);
  }

  // If the Book entry does not exist, throw an error
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Book with ID: ${bookId} not found!`,
    );
  }
};

export const BookServices = {
  createBookToDB,
  getBooksFromDB,
  getBookByIdFromDB,
  updateBookByIdFromDB,
  deleteBookByIdFromDB,
  getBookByCategoryFromDB,
  getBooksAllFromDB,
};
