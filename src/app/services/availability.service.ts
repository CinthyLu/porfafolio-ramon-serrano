import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Availability } from '../models/availability.model';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = `${environment.apiUrl}/programmer/availability`;

  constructor(private http: HttpClient) {}

  async list(): Promise<Availability[]> {
    try {
      return await firstValueFrom(this.http.get<Availability[]>(this.apiUrl));
    } catch (error) {
      console.error('Error loading availabilities:', error);
      throw error;
    }
  }

  async create(availability: Availability): Promise<Availability> {
    try {
      return await firstValueFrom(
        this.http.post<Availability>(this.apiUrl, availability)
      );
    } catch (error) {
      console.error('Error creating availability:', error);
      throw error;
    }
  }

  async update(id: string, availability: Availability): Promise<Availability> {
    try {
      return await firstValueFrom(
        this.http.put<Availability>(`${this.apiUrl}/${id}`, availability)
      );
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete<void>(`${this.apiUrl}/${id}`)
      );
    } catch (error) {
      console.error('Error deleting availability:', error);
      throw error;
    }
  }
}
