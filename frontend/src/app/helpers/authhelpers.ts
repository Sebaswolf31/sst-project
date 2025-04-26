import { IUser, UserRole } from "@/app/interface";

export const isSuperAdmin = (user: IUser | null) =>
  user?.role === UserRole.RolSuperAdmin;

export const isAdmin = (user: IUser | null) =>
  user?.role === UserRole.RolAdministrador;

export const isOperator = (user: IUser | null) =>
  user?.role === UserRole.RolOperario;
