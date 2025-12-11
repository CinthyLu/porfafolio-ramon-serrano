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
  fullName: string;
  role: Role;
  photoUrl?: string;
  contacts?: ContactLinks;
  createdAt?: string;
}
