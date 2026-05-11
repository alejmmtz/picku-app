import type { AxiosInstance } from "axios";
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "../types/product.types";

const toNumber = (value: unknown): number => Number(value);

const normalizeProduct = (product: Product): Product => ({
  ...product,
  id: toNumber(product.id),
  price: toNumber(product.price),
});

const normalizeProducts = (products: Product[]): Product[] =>
  products.map(normalizeProduct);

export const getProducts = async (
  axiosInstance: AxiosInstance
): Promise<Product[]> => {
  const response = await axiosInstance.get("/picku/api/products");

  return normalizeProducts(response.data as Product[]);
};

export const getProductsByEntrepreneurId = async (
  axiosInstance: AxiosInstance,
  entrepreneurId: string
): Promise<Product[]> => {
  const response = await axiosInstance.get(
    `/picku/api/products/entrepreneur/${entrepreneurId}`
  );

  return normalizeProducts(response.data as Product[]);
};

export const getProductById = async (
  axiosInstance: AxiosInstance,
  productId: string
): Promise<Product> => {
  const response = await axiosInstance.get(`/picku/api/products/${productId}`);
  return normalizeProduct(response.data as Product);
};

export const createProduct = async (
  axiosInstance: AxiosInstance,
  productData: CreateProductDTO
): Promise<Product> => {
  const response = await axiosInstance.post("/picku/api/products", productData);
  return normalizeProduct(response.data as Product);
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
  return normalizeProduct(response.data as Product);
};

export const deleteProduct = async (
  axiosInstance: AxiosInstance,
  productId: string
): Promise<Product> => {
  const response = await axiosInstance.delete(`/picku/api/products/${productId}`);

  return normalizeProduct(response.data as Product);
};
