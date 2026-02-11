import { Role } from './role.enum';

export interface ContactLinks {
  email?: string;
  phone?: string;
  whatsapp?: string;
  linkedin?: string;
  github?: string;
  [key: string]: string | undefined;
}

export interface User {
  id?: string;
  email: string;
  fullName?: string;
  name?: string;

  role: string; // Changed from Role enum to string to match backend
  specialty?: string;
  bio?: string;
  phone?: string;

  photoUrl?: string;
  avatarUrl?: string;
  contacts?: ContactLinks;
  createdAt?: string;
  updatedAt?: string;
}
