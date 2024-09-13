import { Schema, model } from 'mongoose';
import { GENDER, USER_ROLE, USER_STATUS } from './user.constant';
import { IUser, UserModel } from './user.interface';

import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../config';
import ApiError from '../../errors/ApiError';

// Define the schema for the User model
const userSchema = new Schema<IUser, UserModel>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
    },
    avatar: {
      type: String,
      default: 'https://i.ibb.co.com/4VyT9gr/Epty-Image-User.jpg',
    },
    bio: {
      type: String,
      maxlength: 300,
      trim: true,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    address: {
      type: String,
    },
    occupations: {
      type: String,
    },
    worksAt: {
      type: String,
    },
    studiedAt: {
      type: String,
    },
    relationshipStatus: {
      type: String,
    },
    instagramUrl: {
      type: String,
      trim: true,
    },
    interests: {
      type: [String],
    },
    isPrivateProfile: {
      type: Boolean,
      default: false, // Default value for new users
    },
    password: {
      type: String,
      required: true,
      select: 0, // Exclude password by default
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: 'USER',
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: 'in-progress',
    },
    otp: {
      type: Number,
    },
    otpExpiresAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }, // Automatically adds createdAt and updatedAt fields
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is new or changed
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcryptSaltRounds),
  );

  // Remove interests field if the role is admin or superadmin
  if (this.role === USER_ROLE['SUPER-ADMIN'] || this.role === USER_ROLE.ADMIN) {
    this.set('interests', undefined, { strict: false }); // Remove interests
    this.set('isPrivateProfile', undefined, { strict: false }); // Remove isPrivateProfile
  }

  next();
});

// Remove sensitive fields before converting to JSON
userSchema.methods.toJSON = function (options?: { includeRole?: boolean }) {
  const userObject = this.toObject();

  // Remove sensitive fields
  delete userObject?.password;
  delete userObject?.passwordChangedAt;
  delete userObject?.isBlocked;
  delete userObject?.isDeleted;
  delete userObject?.isVerified;
  delete userObject?.otp;
  delete userObject?.otpExpiresAt;

  if (!options?.includeRole) {
    delete userObject?.role; // Remove role if not needed
  }

  return userObject;
};

// Check if a user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password'); // Include password in results
};

// Compare plain text password with hashed password
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Check if JWT was issued before password change
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAt: Date,
  jwtIssuedTime: number,
) {
  const passwordChangedTime = new Date(passwordChangedAt).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTime;
};

// Verify OTP for user authentication
userSchema.statics.verifyOtp = async function (email: string, otp: number) {
  const existingUser = await User.isUserExistsByEmail(email);

  // Check if user exists
  if (!existingUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist!',
    );
  }

  // Validate OTP input
  if (!otp) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'OTP is required. Please check your email for the code!',
    );
  }

  // Verify OTP expiration
  if (!existingUser?.otpExpiresAt || existingUser?.otpExpiresAt < new Date()) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'OTP has expired. Please request a new one!',
    );
  }

  // Check if OTP matches
  if (existingUser?.otp !== otp) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Incorrect OTP. Please try again!',
    );
  }

  // If OTP is correct, remove OTP fields and verify the user
  await User.findByIdAndUpdate(existingUser._id, {
    $unset: {
      otp: '',
      otpExpiresAt: '',
    },
    $set: {
      isVerified: true,
      status: 'active',
    },
  });

  return null;
};

// Create the User model using the schema
export const User = model<IUser, UserModel>('User', userSchema);
