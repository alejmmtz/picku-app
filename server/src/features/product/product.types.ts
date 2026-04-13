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

//DTO to create product 
export interface CreateProductDTO {
    entrepreneur_id: string;

    name: string;
    price: number;
    description: string;
    category: string;
    img: string;
}

//DTO to update product 
export interface UpdateProductDTO {
    name?: string;
    price?: number;
    description?: string;
    category?: string;
    img?: string;
}

//DTO tp change availability 
export interface UpdateProductAvailabilityDTO {
    is_available: boolean;
}