import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { CommunicationService } from './communication.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private comm = inject(CommunicationService);
  private apiUrl = `${environment.apiUrl}/advisories`;

  async createAppointment(a: Appointment): Promise<Appointment> {
    const appointment = await firstValueFrom(
      this.http.post<Appointment>(this.apiUrl, {
        programmerId: a.programmerId,
        userEmail: a.userEmail,
        datetime: a.datetime,
        comment: a.comment,
        userId: a.userId
      })
    );
    
    this.comm.sendMessage({ type: 'new-appointment', appointment });
    return appointment;
  }

  async listByProgrammer(email: string): Promise<Appointment[]> {
    return await firstValueFrom(
      this.http.get<Appointment[]>(`${this.apiUrl}/programmer/${email}`)
    );
  }

  async updateAppointmentStatus(id: string, status: string, responseMessage?: string): Promise<void> {
    await firstValueFrom(
      this.http.put(`${this.apiUrl}/${id}/status`, { status, responseMessage })
    );
    
    this.comm.sendMessage({ type: 'appointment-updated', id, status, responseMessage });
  }

  async listByUser(email: string): Promise<Appointment[]> {
    return await firstValueFrom(
      this.http.get<Appointment[]>(`${this.apiUrl}/user/${email}`)
    );
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await firstValueFrom(
      this.http.get<Appointment[]>(this.apiUrl)
    );
  }
}
