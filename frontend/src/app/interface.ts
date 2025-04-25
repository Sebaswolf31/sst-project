export interface IUser {
  name: string;
  identification: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: string;
  companyId: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}
