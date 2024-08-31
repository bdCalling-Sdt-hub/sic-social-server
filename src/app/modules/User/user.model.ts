import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { GENDER, USER_ROLE, USER_STATUS } from './user.constant';

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
      default: 'https://i.ibb.co/z5YHLV9/profile.png',
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
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    friendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    pendingRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    instagramUrl: {
      type: String,
      trim: true,
    },
    interests: [
      {
        type: String,
      },
    ],
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
      default: 'user',
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
    isDeleted: {
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
  next();
});

// Remove sensitive fields before converting to JSON
userSchema.methods.toJSON = function (options?: { includeRole?: boolean }) {
  const userObject = this.toObject();

  // Remove sensitive fields
  delete userObject?.password;
  delete userObject?.passwordChangedAt;
  delete userObject?.status;
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

// Function to suggest friends based on common interests
userSchema.statics.suggestFriendsBasedOnInterests = async function (
  email: string,
) {
  const existingUser = await User.findOne({ email });

  // Check if user exists
  if (!existingUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist!',
    );
  }

  // Find users with similar interests, excluding the user themselves
  const suggestedFriends = await this.find({
    _id: { $ne: existingUser?._id },
    interests: { $in: existingUser?.interests },
  });

  return suggestedFriends;
};

userSchema.statics.sendFriendRequest = async function (
  userEmail,
  targetUserId,
) {
  const existingUser = await User.findOne({ email: userEmail });
  const targetUser = await this.findById(targetUserId);

  // Check if user exists
  if (!existingUser || !targetUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  // Check if they are already friends
  if (existingUser?.friends?.includes(targetUserId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are already friends with this user.',
    );
  }

  // Add friend request
  targetUser?.friendRequests?.push(existingUser?._id);
  await targetUser.save();

  // Add target user to sender's pending requests list
  existingUser?.pendingRequests?.push(targetUserId);
  await existingUser.save();

  return targetUser;
};

userSchema.statics.cancelFriendRequest = async function (
  userEmail,
  targetUserId,
) {
  const existingUser = await User.findOne({ email: userEmail });
  const targetUser = await this.findById(targetUserId);

  // Check if both users exist
  if (!existingUser || !targetUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  // Check if the friend request exists in the target user's list
  if (!targetUser?.friendRequests?.includes(existingUser?._id)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No pending friend request from this user!',
    );
  }

  // Remove the friend request from the target user's list
  targetUser.friendRequests = targetUser?.friendRequests?.filter(
    (requesterId) => requesterId !== existingUser?._id,
  );

  // Optionally, remove the target user from the sender's pending requests list if you maintain such a list
  existingUser.pendingRequests = existingUser?.pendingRequests?.filter(
    (pendingRequest) => pendingRequest !== targetUserId,
  );

  // Save the changes to both users
  await targetUser.save();
  await existingUser.save();

  return existingUser;
};

userSchema.statics.acceptFriendRequest = async function (
  userEmail,
  requesterId,
) {
  const existingUser = await User.findOne({ email: userEmail });
  const requester = await this.findById(requesterId);

  // Check if user exists
  if (!existingUser || !requester) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  // Check if friend request exists
  if (!existingUser?.friendRequests?.includes(requesterId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No friend request from this user',
    );
  }

  // Add each other as friends
  existingUser?.friends?.push(requesterId);
  requester?.friends?.push(existingUser?._id);

  // Remove the friend request
  existingUser.friendRequests = existingUser?.friendRequests?.filter(
    (_id) => _id.toString() !== requesterId?.toString(),
  );

  existingUser.pendingRequests = existingUser.pendingRequests.filter(
    (_id) => _id.toString() !== requesterId?.toString(),
  );

  await existingUser.save();
  await requester.save();
  return existingUser;
};

userSchema.statics.removeFriend = async function (userEmail, friendId) {
  const existingUser = await User.findOne({ email: userEmail });
  const friend = await this.findById(friendId);

  // Check if user exists
  if (!existingUser || !friend) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!');
  }

  // Remove each other as friends
  existingUser.friends = existingUser?.friends?.filter(
    (_id) => _id?.toString() !== friendId?.toString(),
  );

  friend.friends = friend?.friends?.filter(
    (_id) => _id.toString() !== existingUser?._id?.toString(),
  );

  await existingUser.save();
  await friend.save();
  return existingUser;
};

// Create the User model using the schema
export const User = model<IUser, UserModel>('User', userSchema);
