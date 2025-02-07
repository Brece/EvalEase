import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validationMiddleware = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // returns { success: true, data: { ... } } or { success: false, error: { errors: [ ... ] } }
      const result = schema.safeParse(req.body);

      if (!result.success) {
        throw new ZodError(result.error.errors);
      }

      // Replace the request body with the parsed result and continue
      req.body = result.data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ message: 'Validation error', errors: error.errors });
      } else {
        res.status(400).json({
          message: 'Unexpected error while validating request DTO',
          error,
        });
      }
    }
    return; // Exit early if an error occurs
  };
};
