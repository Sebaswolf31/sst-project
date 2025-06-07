"use server";
import axios from "axios";
import { CreateInspectionTemplateDto } from "../interface";
const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export const createInpectionTemplate = async (
  InspectionTemplate: CreateInspectionTemplateDto
) => {
  try {
    const response = await axiosApiBack.post(
      "/inspection-templates",
      InspectionTemplate
    );
    if (response.status === 200) {
      console.log("Exito", response.data);
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
export const getInpectionTemplate = async (page: number, limit: number) => {
  try {
    const params: Record<string, string | number> = { page, limit };

    const response = await axiosApiBack.get("/inspection-templates", {
      params,
    });
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
