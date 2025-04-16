import { z } from "zod";

// Register DTO
export const registerSchema = z
  .object({
    username: z.string().min(3, { message: "errors.validation.minLength" }),
    email: z.string().email({ message: "errors.validation.email.invalid" }),
    password: z
      .string()
      .min(6, { message: "errors.validation.passwordRequirements" }),
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
      .min(6, { message: "errors.validation.passwordRequirements" }),
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
