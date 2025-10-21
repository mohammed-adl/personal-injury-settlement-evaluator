import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
      user?: {
        id: string;
        [key: string]: any;
      };
    }
  }
}

declare module "socket.io" {
  interface Socket {
    userId?: string;
  }
}

export type ValidatedRequestBody<T extends z.ZodTypeAny> = z.infer<T>;
export type ValidatedRequestQuery<T extends z.ZodTypeAny> = z.infer<T>;
export type ValidatedRequestParams<T extends z.ZodTypeAny> = z.infer<T>;
