import type { AxiosInstance } from "axios";
import type { Entrepreneur } from "../types/entrepreneur.types";

export const getEntrepreneurs = async (
  axiosInstance: AxiosInstance
): Promise<Entrepreneur[]> => {
  const response = await axiosInstance.get("/picku/api/entrepreneurs");
  return response.data;
};