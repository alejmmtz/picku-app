export enum UserRole {
  CONSUMER = 'consumer',
  ENTREPRENEUR = 'entrepreneur',
}

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  createdAt: string;
};

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

export interface AuthenticateUserDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  password?: string;
  name?: string;
  phone?: string;
}
