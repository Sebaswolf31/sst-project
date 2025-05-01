"use client";

import React from "react";
import Button from "@/app/components/botton";
import * as Yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";

import { ICompany } from "@/app/interface";
import toast from "react-hot-toast";
import { createCompanyService } from "@/app/services/companies";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
});

const CreateCompany = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnSubmit = async (values: ICompany, { resetForm }: any) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("No hay token disponible");
        return;
      }
      console.log(values.name, "Que se envia añl back ");
      const companyName = String(values.name).trim();

      if (!companyName) {
        toast.error("El nombre de la empresa no puede estar vacío");
        return;
      }
      const companyData = { name: companyName };
      console.log(companyName, "Que se envia al back");
      await createCompanyService(companyData, token);
      toast.success("Empresa registrada correctamente!");
      resetForm();
    } catch (error) {
      console.error("Error al registrar la empresa:", error);
      toast.error("Ha ocurrido un error al registrar la empresa");
    }
  };
  return (
    <div className="flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl">
        <h2 className="mb-8 text-2xl font-semibold text-center text-gray-800">
          Registro Empresas
        </h2>

        <Formik
          initialValues={{
            name: "",
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

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-white rounded-lg bg-greenP hover:bg-green-600 focus:outline-none"
              >
                {isSubmitting ? "Registrando..." : "Registrar Empresa"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateCompany;
