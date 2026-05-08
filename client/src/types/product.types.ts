export interface Product {
  id: number;
  entrepreneur_id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  img: string;
  is_available: boolean;
}

export interface CreateProductDTO {
  entrepreneur_id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  img: string;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  img?: string;
}