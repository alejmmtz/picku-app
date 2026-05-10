import type { AxiosInstance } from "axios";
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "../types/product.types";

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

export const getProductById = async (
  axiosInstance: AxiosInstance,
  productId: string
): Promise<Product> => {
  const response = await axiosInstance.get(`/picku/api/products/${productId}`);
  return response.data;
};

export const createProduct = async (
  axiosInstance: AxiosInstance,
  productData: CreateProductDTO
): Promise<Product> => {
  const response = await axiosInstance.post("/picku/api/products", productData);
  return response.data;
};

export const updateProduct = async (
  axiosInstance: AxiosInstance,
  productId: string,
  productData: UpdateProductDTO
): Promise<Product> => {
  const response = await axiosInstance.patch(
    `/picku/api/products/${productId}`,
    productData
  );
  return response.data;
};

export const deleteProduct = async (
  axiosInstance: AxiosInstance,
  productId: string
): Promise<Product> => {
  const response = await axiosInstance.delete(`/picku/api/products/${productId}`);

  return response.data;
};