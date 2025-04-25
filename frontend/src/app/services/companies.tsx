"use server";

import axios from "axios";

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const createCompany = async (name: string, token: string) => {
  try {
    const response = await axiosApiBack.post("/companies", name, {
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
