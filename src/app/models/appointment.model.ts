export type AppointmentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Appointment {
  id?: string;
  programmerId: string;
  userEmail: string;
  userId?: string; // optional for anonymous requests
  datetime: string; // ISO string
  comment?: string;
  status: AppointmentStatus;
  responseMessage?: string;
  createdAt?: string;
}
