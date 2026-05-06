import type { Entrepreneur } from "../types/entrepreneur.types";

export const filterEntrepreneurs = (
  entrepreneurs: Entrepreneur[],
  searchTerm: string
): Entrepreneur[] => {
  const normalizedSearch = searchTerm.toLowerCase().trim();

  if (!normalizedSearch) {
    return entrepreneurs;
  }

  return entrepreneurs.filter((entrepreneur) => {
    return (
      entrepreneur.name.toLowerCase().includes(normalizedSearch) ||
      entrepreneur.description.toLowerCase().includes(normalizedSearch) ||
      entrepreneur.category.toLowerCase().includes(normalizedSearch) ||
      entrepreneur.owner_name?.toLowerCase().includes(normalizedSearch)
    );
  });
};