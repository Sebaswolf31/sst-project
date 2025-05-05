import { IUser } from "@/app/interface";

export const isSuperAdmin = (user: IUser | null) => user?.role === "superadmin";
export const isAdmin = (user: IUser | null) => user?.role === "admin";
export const isOperator = (user: IUser | null) => user?.role === "operator";
