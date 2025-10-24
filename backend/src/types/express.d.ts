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
