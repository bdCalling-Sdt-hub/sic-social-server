/* eslint-disable @typescript-eslint/no-explicit-any */

import { endOfMonth, startOfMonth } from 'date-fns';
import { errorLogger, logger } from '../../utils/winstonLogger';

import colors from 'colors';
import ejs from 'ejs';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import cron from 'node-cron';
import path from 'path';
import QueryBuilder from '../../builder/QueryBuilder';
import ApiError from '../../errors/ApiError';
import { sendEmail } from '../../helpers/emailService';
import { unlinkFile } from '../../helpers/fileHandler';
import generateOtp from '../../helpers/generateOtp';
import getPathAfterUploads from '../../helpers/getPathAfterUploads';
import { UserSearchableFields } from './user.constant';
import { IUser } from './user.interface';
import { User } from './user.model';

const createUserToDB = async (payload: IUser) => {
  // Check if a user with the provided email already exists
  // console.log(payload);
  if (await User.isUserExistsByEmail(payload?.email)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'A user with this email already exists!',
    );
  }

  // Set default values for new users
  payload.role = 'USER';
  payload.status = 'in-progress';

  // Generate OTP and set expiration for email verification
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

  // Add OTP and expiration time to the payload
  payload.otp = Number(otp);
  payload.otpExpiresAt = otpExpiresAt;

  // Path to the email verification template
  const verifyEmailTemplatePath = path.join(
    process.cwd(),
    'src',
    'app',
    'templates',
    'verifyEmailTemplate.ejs',
  );

  // Render the email template with user's name and OTP
  const verifyEmailTemplate = await ejs.renderFile(verifyEmailTemplatePath, {
    fullName: payload?.fullName,
    otp,
  });

  // Email options for sending the verification email
  const emailOptions = {
    to: payload?.email, // Receiver's email address (user's email)
    subject: 'Verify Your Email Address - Sic Social', // Subject of the email
    html: verifyEmailTemplate, // HTML content of the email
  };

  // Send the verification email to the user
  await sendEmail(emailOptions);

  // Create the new user in the database
  await User.create(payload);
};

const createAdminToDB = async (payload: IUser) => {
  // Check if a user with the provided email already exists
  if (await User.isUserExistsByEmail(payload?.email)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'An admin with this email already exists!',
    );
  }

  // Set default values for new admins
  payload.role = 'ADMIN';
  payload.status = 'active';
  payload.isVerified = true;

  // Create the new admin in the database
  await User.create(payload);
};

const getUsersFromDB = async (query: Record<string, unknown>) => {
  // Build the query using QueryBuilder with the given query parameters
  const usersQuery = new QueryBuilder(
    User.find({
      role: 'USER',
    }),
    query,
  )
    .search(UserSearchableFields) // Apply search conditions based on searchable fields
    .sort() // Apply sorting based on the query parameter
    .paginate(); // Apply pagination based on the query parameter

  // Get the total count of matching documents and total pages for pagination
  const meta = await usersQuery.countTotal();
  // Execute the query to retrieve the users
  const result = await usersQuery.modelQuery;

  return { meta, result };
};

const getAdminsFromDB = async () => {
  // Build the query using QueryBuilder with the given query parameters

  const result = await User.find({ role: 'ADMIN' })
    .select('fullName email avatar')
    .sort({ createdAt: -1 });

  // Get the total count of matching documents and total pages for pagination
  // const meta = await usersQuery.countTotal();
  // Execute the query to retrieve the users
  // const result = await usersQuery.modelQuery;

  return result;
};

const getUsersCountFromDB = async () => {
  const totalUser = await User.countDocuments({
    role: 'user',
    isVerified: true,
  });

  // Define start and end dates for the current month
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  // Count users created in the current month
  const currentMonthTotal = await User.countDocuments({
    role: 'user',
    isVerified: true,
    createdAt: {
      $gte: start,
      $lte: end,
    },
  });

  return { totalUser, currentMonthTotal };
};

const getUserProfileFromDB = async (user: JwtPayload) => {
  const options = { includeRole: true };
  const result = await User.findById(user?.userId);

  // Convert user document to JSON if it exists
  if (result) {
    return result.toJSON(options);
  }

  // Handle case where no User is found
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `User with ID: ${user?.userId} not found!`,
    );
  }
};

const updateUserProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>,
  file: any,
) => {
  // Find the existing user to get the current avatar path
  const existingUser = await User.findById(user?.userId);

  // Ensure the user trying to update the profile is the creator
  if (existingUser?._id?.toString() !== user?.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You do not have permission to update this property!',
    );
  }
  // console.log(file);
  // Handle avatar update if a new avatar is uploaded
  if (file?.path) {
    const newAvatarPath = getPathAfterUploads(file?.path);

    payload.avatar = newAvatarPath;
    // Delete the old avatar file if it exists and is not the default
    if (
      existingUser?.avatar &&
      existingUser?.avatar !== 'https://i.ibb.co/z5YHLV9/profile.png'
    ) {
      unlinkFile(existingUser?.avatar);
    }
  }

  // Exclude specific fields from being updated
  // userFieldsToExclude?.forEach((field) => delete payload[field]);

  // console.log(payload);
  // Update user profile with the filtered data and return the result
  const result = await User.findByIdAndUpdate(user?.userId, payload, {
    new: true,
  });

  return result;
};

// Schedule a cron job to delete expired, unverified users every 12 hours
cron.schedule('0 */12 * * *', async () => {
  const now = new Date();

  try {
    const result = await User.deleteMany({
      otpExpiresAt: { $lt: now }, // Condition 1: OTP has expired
      status: 'in-progress', // Condition 2: User registration is in-progress
      isVerified: false, // Condition 3: User is not verified
    });

    // Log results of the deletion operation using custom logger with colors
    if (result?.deletedCount > 0) {
      logger.info(
        colors.bgGreen(
          `${result?.deletedCount} expired unverified users were deleted!`,
        ),
      );
    } else {
      logger.info(
        colors.bgYellow('No expired unverified users found for deletion.'),
      );
    }
  } catch (error) {
    errorLogger.error(colors.bgRed(`Error deleting expired users: ${error}`));
  }
});

export const UserServices = {
  createUserToDB,
  createAdminToDB,
  getUsersFromDB,
  getUsersCountFromDB,
  getAdminsFromDB,
  getUserProfileFromDB,
  updateUserProfileToDB,
};
