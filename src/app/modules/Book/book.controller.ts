import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookServices } from './book.service';

const createBook = catchAsync(async (req, res) => {
  // console.log(req?.body);
  const result = await BookServices.createBookToDB(
    req?.user,
    req?.body,
    req?.files,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Book created successfully!',
    data: result,
  });
});

const getBooks = catchAsync(async (req, res) => {
  const result = await BookServices.getBooksFromDB(req?.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books retrieved successfully!',
    data: result,
  });
});

const getBookById = catchAsync(async (req, res) => {
  const result = await BookServices.getBookByIdFromDB(req?.params?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrieved successfully!',
    data: result,
  });
});

const updateBookById = catchAsync(async (req, res) => {
  const result = await BookServices.updateBookByIdFromDB(
    req?.params?.id,
    req?.body,
    req?.files,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully!',
    data: result,
  });
});

const deleteBookById = catchAsync(async (req, res) => {
  const result = await BookServices.deleteBookByIdFromDB(req?.params?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book deleted successfully!',
    data: result,
  });
});

export const BookControllers = {
  createBook,
  getBooks,
  getBookById,
  deleteBookById,
  updateBookById,
};
