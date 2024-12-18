import { IUser } from './user.interface';

// Fields that can be searched in user queries.
export const UserSearchableFields = ['email', 'address'];

// Fields that cannot be updated by the user.
export const userFieldsToExclude: (keyof IUser)[] = [
  'email',
  'password',
  'passwordChangedAt',
  'role',
  'status',
  'isBlocked',
  'isVerified',
  'otp',
  'otpExpiresAt',
];

// User roles within the system.
export const USER_ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  'SUPER-ADMIN': 'SUPER-ADMIN',
} as const;

// Possible user account statuses.
export const USER_STATUS = {
  'in-progress': 'in-progress',
  active: 'active',
  blocked: 'blocked',
} as const;

// Gender options available for users.
export const GENDER = {
  male: 'male',
  female: 'female',
  others: 'others',
} as const;
