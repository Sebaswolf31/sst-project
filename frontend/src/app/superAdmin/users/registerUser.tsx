"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@/app/components/botton";
import * as Yup from "yup";
import { IUser, UserRole } from "@/app/interface";
import { registerService } from "@/app/services/auth";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import SelectCompany from "./selectCompany";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
  identification: Yup.string()
    .min(8, "La identificacion es de al menos 8 digitos")
    .required("La identificacion es obligatorio"),
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(15, "La contraseña no puede tener más de 15 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$^&*])/,
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial."
    )
    .required("La contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
    .required("La confirmación de la contraseña es obligatoria"),
  phone: Yup.string()
    .matches(
      /^\+(\d{1,3})\d{9}$/,
      "Teléfono debe ser un número válido (ej: +573001234567)"
    )
    .required("El teléfono es obligatorio"),
  role: Yup.string().required("El rol es obligatorio"),
  companyId: Yup.string().required("El Id de la empresa es requerido"),
});
const roleOptions = [
  { value: "", label: "Seleccione un rol" },
  { value: UserRole.RolSuperAdmin, label: "Administrador Superior" },
  { value: UserRole.RolAdministrador, label: "Administrador" },
  { value: UserRole.RolOperario, label: "Operador" },
  { value: UserRole.RolInspector, label: "Inspector" },
];
const RegisterUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnSubmit = async (values: IUser, { resetForm }: any) => {
    try {
      const token = localStorage.getItem("access_token");
      console.log(token, "token");
      if (!token) {
        toast.error("No hay token disponible");
        return;
      }
      const formattedUserData = {
        name: values.name,
        identification: values.identification,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phone: values.phone,
        role: values.role,
        companyId: values.companyId,
      };
      console.log("Datos enviados al backend:", formattedUserData);
      await registerService(formattedUserData, token);
      toast.success("¡Usuario registrado correctamente!");
      resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl">
        <h2 className="mb-8 text-2xl font-semibold text-center text-gray-800">
          Registro Usuarios
        </h2>

        <Formik
          initialValues={{
            name: "",
            identification: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            role: "",
            companyId: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleOnSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  name="name"
                  type="text"
                  placeholder="Nombre"
                  className="w-full p-3 text-gray-800 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-greenP"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="mt-2 text-sm text-red-500"
                />
              </div>

              <div>
                <Field
                  name="identification"
                  type="text"
                  placeholder="Número de Identificación"
                  className="w-full p-3 text-gray-800 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-greenP"
                />
                <ErrorMessage
                  name="identification"
                  component="div"
                  className="mt-2 text-sm text-red-500"
                />
              </div>

              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 text-gray-800 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-greenP"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-2 text-sm text-red-500"
                />
              </div>

              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="w-full h-12 p-3 pr-12 text-gray-800 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-greenP"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-600 transform -translate-y-1/2 right-3 top-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-2 text-sm text-red-500"
                />
              </div>

              <div className="relative">
                <Field
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirma Contraseña"
                  className="w-full p-3 pr-12 text-gray-800 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-greenP"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute text-gray-600 transform -translate-y-1/2 right-3 top-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="mt-2 text-sm text-red-500"
                />
              </div>

              <div>
                <Field
                  name="phone"
                  type="string"
                  placeholder="Teléfono"
                  className="w-full p-3 text-gray-800 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-greenP"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="mt-2 text-sm text-red-500"
                />
              </div>

              <div>
                <Field
                  as="select"
                  name="role"
                  className="w-full p-3 text-gray-800 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-greenP"
                >
                  <option value="Seleccione un rol"></option>
                  {roleOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="mt-2 text-sm text-red-500"
                />
              </div>

              <SelectCompany />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-white rounded-lg bg-greenP hover:bg-green-600 focus:outline-none"
              >
                {isSubmitting ? "Registrando..." : "Registrar Usuario"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterUser;
