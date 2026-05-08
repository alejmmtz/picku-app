import type { AxiosInstance } from "axios";
import type { Product } from "../types/product.types";

export const getProducts = async (
  axiosInstance: AxiosInstance
): Promise<Product[]> => {
  const response = await axiosInstance.get("/picku/api/products");

  return response.data;
};

export const getProductsByEntrepreneurId = async (
  axiosInstance: AxiosInstance,
  entrepreneurId: string
): Promise<Product[]> => {
  const response = await axiosInstance.get(
    `/picku/api/products/entrepreneur/${entrepreneurId}`
  );

  return response.data;
};