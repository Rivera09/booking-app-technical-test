import 'express';

declare global {
  namespace Express {
    interface User {
      sub: string;
      email?: string;
      [key: string]: any;
    }

    interface Request {
      user?: User;
    }
  }
}
