import type { Entrepreneur } from "../types/entrepreneur.types";
import type { Product } from "../types/product.types";

export const filterEntrepreneurs = (
  entrepreneurs: Entrepreneur[],
  products: Product[],
  searchTerm: string
): Entrepreneur[] => {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  if (!normalizedSearch) {
    return entrepreneurs;
  }

  return entrepreneurs.filter((entrepreneur) => {
    // entrepreneur text match
    const matchesEntrepreneur =
      entrepreneur.name.toLowerCase().includes(normalizedSearch) ||
      entrepreneur.description.toLowerCase().includes(normalizedSearch) ||
      entrepreneur.category.toLowerCase().includes(normalizedSearch) ||
      entrepreneur.owner_name?.toLowerCase().includes(normalizedSearch);

    // product match
    const matchesProduct = products.some((product) => {
      return (
        product.entrepreneur_id === entrepreneur.id &&
        product.name.toLowerCase().includes(normalizedSearch)
      );
    });

    return matchesEntrepreneur || matchesProduct;
  });
};