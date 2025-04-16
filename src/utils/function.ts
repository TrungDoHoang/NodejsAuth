import { TokenPayload, Tokens } from "types";
import jwt from "jsonwebtoken";
import { t } from "i18next";

// Generate tokens
export const generateTokens = (
  userId: string,
  roles: string[] = []
): Tokens => {
  const accessToken = jwt.sign(
    { userId, roles } as TokenPayload,
    process.env.JWT_SECRET as any,
    { expiresIn: 60 * 60 } // 1 hour
  );

  const refreshToken = jwt.sign(
    { userId } as TokenPayload,
    process.env.JWT_REFRESH_SECRET as any,
    { expiresIn: 60 * 60 * 24 * 7 } // 7 days
  );

  return { accessToken, refreshToken };
};

export const formattedErrors = (err: any) =>
  err.errors.map((error: any) => {
    const field = error.path.join(".") || "body";
    const min = error.minimum;
    const max = error.maximum;

    return {
      field,
      message: t(error.message, {
        field,
        min,
        max,
      }),
    };
  });
