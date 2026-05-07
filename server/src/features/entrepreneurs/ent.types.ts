export interface Entrepreneur {
    id: string;
    student_id: string;
    name: string;
    img: string;
    description: string;
    contact_info: string;
    category: string;
    is_active: boolean;
    campus_locations?: number;
    entrepreneur_position?: unknown;
    owner_name?: string;
}
//Create 
export interface CreateEntrepreneurDTO {
    student_id: string;
    name: string;
    img: string;
    description: string;
    contact_info: string;
    category: string;
    campus_locations?: number;
    entrepreneur_position?: unknown;
}

//Update/edit
export interface UpdateEntrepreneurDTO {
    name?: string;
    img?: string;
    description?: string;
    contact_info?: string;
    category?: string;
    campus_locations?: number;
    entrepreneur_position?: unknown;
}

//Update status (open/closed)
export interface UpdateEntrepreneurStatusDTO {
    is_active: boolean;
}