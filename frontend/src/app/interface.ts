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
export enum InspectionType {
  WORK_AREAS = "areas y puestos de trabajo",
  MACHINERY = "maquinaria y equipos",
  PROTECTIVE_EQUIPMENT = "elementos de protección personal",
  MEDICAL = "botiquines y camillas",
}
export interface IInspection {
  id?: string;
  date: Date;
  fieldName: string;
  inspectionType: InspectionType;
  displayName: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  value?: string | number | boolean | Date;
}
export interface CreateInspectionTemplateDto {
  id?: string;
  name: string;
  fields: IInspection[];
}
export interface CreateInspection {
  id?: string;
  title: string;
  date: Date;
  inspectorId?: string;
  templateId: string;
  dynamicFields: Record<string, unknown>;
}
export interface DynamicField {
  fieldName: string;
  value: string | number | boolean | null | Date;
  fieldType: FieldType;
}

export interface IGetInspection {
  id?: string;
  title: string;
  date: Date;
  dynamicFields: DynamicField[];
  inspector: IUser;
  inspectorId: string;
  template: CreateInspectionTemplateDto;
  createdAt: Date;
}
export interface IFormattedInspection extends IGetInspection {
  camposFormateados: { key: string; valorFormateado: string; label: string }[];
}
