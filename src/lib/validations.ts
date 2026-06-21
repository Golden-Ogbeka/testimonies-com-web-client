import { z } from 'zod';

const specialChar = /[!@#$%^&*()\-_=+[\]{}|;:',.<>?/]/;

export const emailSchema = z.string().email('Invalid email address').min(1, 'Email is required').max(100, 'Email is too long');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(specialChar, 'Password must contain at least one special character');
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be under 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');
export const phoneSchema = z.string().min(7, 'Phone number is too short').max(20, 'Phone number is too long');
export const nameSchema = z.string().min(2, 'Must be at least 2 characters').max(100, 'Must be under 100 characters');
export const optionalNameSchema = z.string().max(100, 'Must be under 100 characters').optional().or(z.literal(''));
export const bioSchema = z.string().min(2, 'Must be at least 2 characters').max(500, 'Must be under 500 characters').optional().or(z.literal(''));
export const otpSchema = z.string().length(6, 'Code must be exactly 6 digits').regex(/^\d{6}$/, 'Code must contain only digits');

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const individualSignUpFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Name is too long')
    .refine((v) => v.trim().split(/\s+/).length >= 2, 'Please enter your first and last name'),
  username: usernameSchema,
  email: emailSchema,
  phoneNumber: phoneSchema,
  password: passwordSchema,
});

export const organizationSignUpFormSchema = z.object({
  businessName: nameSchema,
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  businessPhoneNumber: phoneSchema,
  businessAddress: z.string().min(2, 'Address must be at least 2 characters').max(200, 'Address is too long'),
});

export const forgotPasswordOtpSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export const updateProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  bio: bioSchema,
});

export const updateOrgProfileSchema = z.object({
  businessName: nameSchema,
  businessAddress: z.string().min(2, 'Address must be at least 2 characters').max(200, 'Address is too long'),
  businessWebsite: z.string().max(200, 'URL is too long').optional().or(z.literal('')),
  businessBio: bioSchema,
});

export const updateEmailSchema = z.object({
  email: emailSchema,
});

export const updateUsernameSchema = z.object({
  username: usernameSchema,
});

export const updatePhoneSchema = z.object({
  phoneNumber: phoneSchema,
});

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: 'New password must differ from current password',
    path: ['newPassword'],
  });

export const deleteAccountSchema = z.object({
  password: passwordSchema,
});

export const deleteAllContentSchema = z.object({
  password: passwordSchema,
});

export const createTestimonySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description is too long'),
  tags: z
    .string()
    .transform((v) =>
      v
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    )
    .pipe(z.array(z.string().max(50, 'Tag is too long')).max(10, 'Maximum 10 tags allowed')),
  isBroadcast: z.boolean().optional(),
  isSecret: z.boolean().optional(),
});

export const createPromotionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional().or(z.literal('')),
});

export const updatePromotionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional().or(z.literal('')),
});

export const addTeamMemberSchema = z.object({
  email: emailSchema,
});

export const createTeamRoleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters').max(50, 'Role name is too long'),
  permissions: z.string().max(500, 'Too many characters').optional().or(z.literal('')),
});

export const assignTeamRoleSchema = z.object({
  roleId: z.string().min(1, 'Please select a role'),
});
