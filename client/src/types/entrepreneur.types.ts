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
  owner_name?: string;
}