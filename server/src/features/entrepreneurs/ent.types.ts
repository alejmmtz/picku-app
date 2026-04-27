export interface Entrepreneur {
    id: string;
    student_id: string;
    name: string;
    img: string;
    description: string;
    contact_info: string;
    category: string;
    latitude: number;
    longitude: number;
    is_active: boolean;
}

//Create 
export interface CreateEntrepreneurDTO {
    student_id: string;
    name: string;
    img: string;
    description: string;
    contact_info: string;
    category: string;
    latitude: number;
    longitude: number;
}

//Update/edit
export interface UpdateEntrepreneurDTO {
    name?: string;
    img?: string;
    description?: string;
    contact_info?: string;
    category?: string;
    latitude?: number;
    longitude?: number;
}

//Update status (open/closed)
export interface UpdateEntrepreneurStatusDTO {
    is_active: boolean;
}