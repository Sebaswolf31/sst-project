export enum UserRole {
  RolSuperAdmin = "superadmin",
  RolAdministrador = "admin",
  RolOperario = "operator",
  RolInspector = "inspector",
}
export interface IUser {
  id?: string;
  name: string;
  identification?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone: string;
  role?: UserRole | "";
  companyId?: string | "";
}

export interface IUserLogin {
  email: string;
  password: string;
}
export interface ICompany {
  name: string;
  id?: string;
}
