import { z } from 'zod';

export enum UserRole {
  CONSUMER = 'consumer',
  ENTREPRENEUR = 'entrepreneur',
}

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  createdAt: string;
};

export const authenticateUserSchema = z.object({
  email: z.email('Email must be valid'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.email('Email must be valid'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
  phone: z.string().trim().min(7, 'Phone is required'),
  role: z.nativeEnum(UserRole),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must have at least 2 characters').optional(),
    email: z.email('Email must be valid').optional(),
    password: z
      .string()
      .min(6, 'Password must have at least 6 characters')
      .optional(),
    phone: z.string().trim().min(7, 'Phone must have at least 7 characters').optional(),
    role: z.nativeEnum(UserRole).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update the user',
  });

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type AuthenticateUserDTO = z.infer<typeof authenticateUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
