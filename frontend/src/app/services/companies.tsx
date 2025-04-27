"use server";

import axios from "axios";
import { ICompany } from "../interface";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const createCompanyService = async (
  companyData: { name: string },
  token: string
) => {
  try {
    const response = await axiosApiBack.post("/companies", companyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta de la API:", response.data);
    return response.data;
  } catch (error) {
    let errorMessage = "Error desconocido";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error en createCompany:", errorMessage);
    throw new Error(errorMessage);
  }
};
export const getCompanyById = async (token: string, companyId: string) => {
  try {
    const response = await axiosApiBack.get(`/companies/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta de la API companybyid ID:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error desde el backend:", error.response.data);
      throw new Error(error.response.data.message || "Error desconocido");
    } else if (axios.isAxiosError(error) && error.request) {
      console.error("No hubo respuesta del servidor:", error.request);
      throw new Error("No hubo respuesta del servidor");
    } else {
      console.error("Error inesperado:", (error as Error).message);
      throw new Error((error as Error).message || "Error desconocido");
    }
  }
};
export const getCompanies = async (token: string) => {
  try {
    const response = await axiosApiBack.get(`/companies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta de la API get companies:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error desde el backend:", error.response.data);
      throw new Error(error.response.data.message || "Error desconocido");
    } else if (axios.isAxiosError(error) && error.request) {
      console.error("No hubo respuesta del servidor:", error.request);
      throw new Error("No hubo respuesta del servidor");
    } else {
      console.error("Error inesperado:", (error as Error).message);
      throw new Error((error as Error).message || "Error desconocido");
    }
  }
};
export const updateCompany = async (
  companyId: string,
  data: Partial<ICompany>,
  token: string
) => {
  try {
    const response = await axiosApiBack.patch(`/companies/${companyId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta de la API UPDATE COMPANY:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error desde el backend:", error.response.data);
      throw new Error(error.response.data.message || "Error desconocido");
    } else if (axios.isAxiosError(error) && error.request) {
      console.error("No hubo respuesta del servidor:", error.request);
      throw new Error("No hubo respuesta del servidor");
    } else {
      console.error("Error inesperado:", (error as Error).message);
      throw new Error((error as Error).message || "Error desconocido");
    }
  }
};
export const deleteCompanyService = async (
  companyId: string,
  token: string
) => {
  try {
    console.log(token, "token en servicio de users");
    const response = await axiosApiBack.delete(`/companies/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta de la API delete company:", response.data);
    if (response.status === 200) {
      return { status: "success", message: "Empresa eliminado exitosamente" };
    } else {
      throw new Error("No se pudo eliminar al Empresa");
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error desde el backend:", error.response.data);
      throw new Error(error.response.data.message || "Error desconocido");
    } else if (axios.isAxiosError(error) && error.request) {
      console.error("No hubo respuesta del servidor:", error.request);
      throw new Error("No hubo respuesta del servidor");
    } else {
      console.error("Error inesperado:", (error as Error).message);
      throw new Error((error as Error).message || "Error desconocido");
    }
  }
};
