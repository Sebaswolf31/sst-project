import { UserRole } from '../../../src/users/entities/user.entity'; // Ajusta la ruta

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        companyId?: string | number | null;
      };
    }
  }
}
