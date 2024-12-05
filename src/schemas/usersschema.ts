import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const userSchema = z.object({
  createdAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'createdAt must be a valid date string',
  }),
  updatedAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'updatedAt must be a valid date string',
  }),
  email: z.string().email(),
  id: z.number().int(),
  name: z.string().min(1, 'Name must not be empty'),
  phone: z.string()
    .nullable() // Allow null values
    .refine(
      (value) => value === null || isValidPhoneNumber(value, 'HN'),
      {
        message: 'Invalid phone number for Honduras',
      }
    )
    .optional(),
});

export const createUserSchema = z.object({
  createdAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'createdAt must be a valid date string',
  }),
  email: z.string().email(),
  name: z.string().min(1, 'Name must not be empty'),
  phone: z.string()
    .nullable() // Allow null values
    .refine(
      (value) => value === null || isValidPhoneNumber(value, 'HN'),
      {
        message: 'Invalid phone number for Honduras',
      }
    )
    .optional(),
  password: z.string().min(1, 'Password is required'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // This will highlight the confirmPassword field in the error
});


export const updateUserSchema = z.object({
  createdAt: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'createdAt must be a valid date string',
  }),
  email: z.string().email(),
  name: z.string().min(1, 'Name must not be empty'),
  phone: z.string()
    .nullable() // Allow null values
    .refine(
      (value) => value === null || isValidPhoneNumber(value, 'HN'),
      {
        message: 'Invalid phone number for Honduras',
      }
    )
    .optional(),
})

export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>
