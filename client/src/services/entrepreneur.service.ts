import type { AxiosInstance } from "axios";
import type { Entrepreneur } from "../types/entrepreneur.types";

export const getEntrepreneurs = async (
  axiosInstance: AxiosInstance
): Promise<Entrepreneur[]> => {
  const response = await axiosInstance.get("/picku/api/entrepreneurs");
  return response.data;
};

export const getCurrentEntrepreneur = async (
  axiosInstance: AxiosInstance
): Promise<Entrepreneur> => {
  const response = await axiosInstance.get("/picku/api/entrepreneurs/me");
  return response.data;
};

export const getEntrepreneurById = async (
  axiosInstance: AxiosInstance,
  entrepreneurId: string
): Promise<Entrepreneur> => {
  const response = await axiosInstance.get(
    `/picku/api/entrepreneurs/${entrepreneurId}`
  );

  return response.data;
};
