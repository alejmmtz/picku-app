export interface Entrepreneur {
    id: string;
    student_id: string;
    name: string;
    img: string;
    description: string;
    contact_info: string;
    category: string;
    is_active: boolean;
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
}

//Update/edit
export interface UpdateEntrepreneurDTO {
    name?: string;
    img?: string;
    description?: string;
    contact_info?: string;
    category?: string;
}

//Update status (open/closed)
export interface UpdateEntrepreneurStatusDTO {
    is_active: boolean;
}
