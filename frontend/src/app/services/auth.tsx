"use server";
import axios from "axios";
import { IUser } from "../interface";
const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export const registerService = async (userData: IUser, token: string) => {
  try {
    const response = await axiosApiBack.post("/auth/register", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    let errorMessage = "Error desconocido";
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error en Registro:", errorMessage);
    throw new Error(errorMessage);
  }
};
