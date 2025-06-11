"use server";
import axios from "axios";
import { CreateInspection } from "../interface";
const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export const createInspection = async (inspection: CreateInspection) => {
  try {
    const response = await axiosApiBack.post("/inspections", inspection);
    console.log("Respuesta de la API CREATEINSPECTIONS:", response.data);
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
export const createInspectionFile = async (
  file: File,
  inspectionId: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const inspectionFile = await axiosApiBack.post(
      `inspections/${inspectionId}/attachment`,
      formData
    );
    console.log(inspectionFile);
    return inspectionFile.data;
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

export const getInspections = async (page: number, limit: number) => {
  try {
    const params: Record<string, string | number> = { page, limit };

    const response = await axiosApiBack.get("/inspections", { params });
    console.log("Respuesta de la API GET INSPECTIONS:", response.data);
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
export const getInspectionsReportByTemplate = async () => {
  try {
    const response = await axiosApiBack.get("inspections/reports/by-template");
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
export const getInspectionsReportByFormType = async () => {
  try {
    const response = await axiosApiBack.get("inspections/reports/by-form-type");
    console.log("Respuesta de la API GET INSPECTIONSBY FORM:", response.data);
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
