import { formattedErrors } from "@/utils/function";
import { NextFunction, Request, Response } from "express";
import { t } from "i18next";
import { AnyZodObject } from "zod";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request body against the schema
      await schema.parseAsync({
        ...req.body,
        ...req.params,
        ...req.query,
      });

      return next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: t("errors.validation.validationError"),
        errors: formattedErrors(error),
      });
    }
  };
