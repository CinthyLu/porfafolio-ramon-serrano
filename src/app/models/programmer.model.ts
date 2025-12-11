import { User } from './user.model';

export interface AvailabilitySlot {
  day: string; // e.g., 'Monday' or ISO date for special slots
  from: string; // '09:00'
  to: string;   // '11:00'
}

export interface Programmer extends User {
  specialty?: string;
  bio?: string;
  social?: { [key: string]: string };
  availability?: AvailabilitySlot[];
}
