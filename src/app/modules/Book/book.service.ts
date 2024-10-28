/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import ApiError from '../../errors/ApiError';
import { unlinkFile } from '../../helpers/fileHandler';
import getPathAfterUploads from '../../helpers/getPathAfterUploads';
import { IBook } from './book.interface';
import { Book } from './book.model';

const createBookToDB = async (user: JwtPayload, payload: IBook, files: any) => {
  // Set the createdBy field to the ID of the user who is creating
  payload.createdBy = user?.userId;


  

  // Extract and set the image file path
  if (files && files?.coverImage) {
    payload.coverImage = getPathAfterUploads(files?.coverImage?.[0]?.path);
  }

  // Extract and set the pdf file path
  if (files && files?.bookPdf) {
    payload.bookPdf = getPathAfterUploads(files?.bookPdf?.[0]?.path);
  }

  const result = await Book.create(payload);
  return result;
};

const getBooksFromDB = async (query: Record<string, unknown>) => {
  // Build the query using QueryBuilder with the given query parameters
  const BooksQuery = new QueryBuilder(Book.find(), query)
    .sort() // Apply sorting based on the query parameter
    .paginate(); // Apply pagination based on the query parameter

  // Get the total count of matching documents and total pages for pagination
  const meta = await BooksQuery.countTotal();
  const result = await BooksQuery.modelQuery;

  return { meta, result };
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
  if (files && files?.coverImage) {
    const newCoverImagePath = getPathAfterUploads(files?.coverImage[0]?.path);

    // If a new image file is uploaded, update the image path in the payload
    if (existingBook?.coverImage !== newCoverImagePath) {
      payload.coverImage = newCoverImagePath; // Update the payload with the new image path
      unlinkFile(existingBook?.coverImage); // Remove the old image file
    }
  }

  // If a new image is uploaded, update the image path in the payload
  if (files && files?.bookPdf) {
    const newBookPdfPath = getPathAfterUploads(files?.coverImage[0]?.path);

    // If a new image file is uploaded, update the image path in the payload
    if (existingBook?.bookPdf !== newBookPdfPath) {
      payload.bookPdf = newBookPdfPath; // Update the payload with the new image path
      unlinkFile(existingBook?.bookPdf); // Remove the old image file
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
  if (result?.coverImage) {
    unlinkFile(result?.coverImage);
  }

  if (result?.bookPdf) {
    unlinkFile(result?.bookPdf);
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
};
