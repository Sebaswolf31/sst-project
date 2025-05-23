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
export enum FieldType {
  Texto = "text",
  Numero = "number",
  Checkbox = "checkbox",
  Fecha = "date",
  Opciones = "dropdown",
}
export interface IInspection {
  id?: string;
  fieldName: string;
  displayName: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}
export interface CreateInspectionTemplateDto {
  name: string;
  fields: IInspection[];
}
