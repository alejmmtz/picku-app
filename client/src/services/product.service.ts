import type { AxiosInstance } from "axios";
import type { Product } from "../types/product.types";

export const getProductsByEntrepreneurId = async (
  axiosInstance: AxiosInstance,
  entrepreneurId: string
): Promise<Product[]> => {
  const response = await axiosInstance.get(
    `/picku/api/products/entrepreneur/${entrepreneurId}`
  );

  return response.data;
};

export const getProductById = async (
  axiosInstance: AxiosInstance,
  productId: string
): Promise<Product> => {
  const response = await axiosInstance.get(`/picku/api/products/${productId}`);

  return response.data;
};