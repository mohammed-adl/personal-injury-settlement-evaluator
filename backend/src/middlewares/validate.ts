import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

type ValidationSchemas = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.validatedBody = schemas.body.parse(req.body);
      if (schemas.query) req.validatedQuery = schemas.query.parse(req.query);
      if (schemas.params) req.validatedParams = schemas.params.parse(req.params);

      next();
    } catch (err: any) {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: err.errors || err,
      });
    }
  };
