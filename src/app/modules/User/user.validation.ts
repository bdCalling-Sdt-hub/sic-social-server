import { z } from 'zod';

const createUserSchema = z.object({
  body: z.object({
    fullName: z.string({
      required_error: 'Full name is required.',
      invalid_type_error: 'Full name must be a string.',
    }),

    email: z
      .string({
        required_error: 'Email is required.',
        invalid_type_error: 'Email must be a string.',
      })
      .email('Invalid email format.'),

    phoneNumber: z.string({
      required_error: 'Phone number is required.',
      invalid_type_error: 'Phone number must be a string.',
    }),

    password: z.string({
      required_error: 'Password is required.',
      invalid_type_error: 'Password must be a string.',
    }),
  }),
});

const createAdminSchema = z.object({
  body: z.object({
    fullName: z.string({
      required_error: 'Full name is required.',
      invalid_type_error: 'Full name must be a string.',
    }),

    email: z
      .string({
        required_error: 'Email is required.',
        invalid_type_error: 'Email must be a string.',
      })
      .email('Invalid email format.'),

    password: z.string({
      required_error: 'Password is required.',
      invalid_type_error: 'Password must be a string.',
    }),
  }),
});

export const userValidationSchema = {
  createUserSchema,
  createAdminSchema,
};
