import { z } from "zod";

const MIN_PASSWORD_LENGTH = 6;

// Register DTO
export const registerSchema = z
  .object({
    username: z.string().min(3, { message: "errors.validation.minLength" }),
    email: z.string().email({ message: "errors.validation.email.invalid" }),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, {
        message: "errors.validation.passwordRequirements",
      }),
  })
  .strict();

export type RegisterDto = z.infer<typeof registerSchema>;

// Login DTO
export const loginSchema = z
  .object({
    username: z.string().nonempty({ message: "errors.validation.required" }),
    password: z
      .string()
      .nonempty({ message: "errors.validation.required" })
      .min(MIN_PASSWORD_LENGTH, {
        message: "errors.validation.passwordRequirements",
      }),
  })
  .strict();

export type LoginDto = z.infer<typeof loginSchema>;

// RefreshToken DTO
export const refreshTokenSchema = z
  .object({
    refreshToken: z
      .string()
      .nonempty({ message: "errors.auth.refreshTokenRequired" }),
  })
  .strict();

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

// ChangePassword DTO
export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .nonempty({ message: "errors.validation.required" })
      .min(MIN_PASSWORD_LENGTH, {
        message: "errors.validation.passwordRequirements",
      }),
    newPassword: z
      .string()
      .nonempty({ message: "errors.validation.required" })
      .min(MIN_PASSWORD_LENGTH, {
        message: "errors.validation.passwordRequirements",
      }),
    newPasswordConfirm: z
      .string()
      .nonempty({ message: "errors.validation.required" })
      .min(MIN_PASSWORD_LENGTH, {
        message: "errors.validation.passwordRequirements",
      }),
  })
  .strict()
  .refine((values) => values.newPassword === values.newPasswordConfirm, {
    message: "errors.validation.passwordConfirmation",
    path: ["newPasswordConfirm"],
  })
  .refine((values) => values.newPassword !== values.oldPassword, {
    message: "errors.validation.newPasswordSameAsOld",
    path: ["newPassword"],
  });

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
