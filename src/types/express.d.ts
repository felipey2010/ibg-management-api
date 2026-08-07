import type { AuthUser } from '../v1/modules/auth/auth.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
