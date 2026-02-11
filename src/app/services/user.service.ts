import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { Role } from '../models/role.enum';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  // PERFIL (Spring Boot)
  getMe(): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${environment.apiUrl}/auth/me`));
  }

  updateMe(data: any): Promise<any> {
    return firstValueFrom(this.http.put<any>(`${environment.apiUrl}/auth/me`, data));
  }

  // Crear programador/usuario
  async createProgrammer(user: User): Promise<string> {
    const payload = {
      email: user.email,
      name: user.name || user.email.split('@')[0],
      phone: user.phone,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: Role.Programmer
    };
    const created = await firstValueFrom(
      this.http.post<User>(this.apiUrl, payload)
    );
    return created.email;
  }

  async createUser(user: User, role: Role = Role.User): Promise<string> {
    const payload = {
      email: user.email,
      name: user.name || user.email.split('@')[0],
      phone: user.phone,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: role
    };
    const created = await firstValueFrom(
      this.http.post<User>(this.apiUrl, payload)
    );
    return created.email;
  }

  async updateUser(id: string, data: Partial<User>): Promise<void> {
    await firstValueFrom(this.http.put(`${this.apiUrl}/${id}`, data));
  }

  async deleteUser(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await firstValueFrom(this.http.get<User>(`${this.apiUrl}/${id}`));
    } catch (error) {
      return null;
    }
  }

  async updateUserByEmail(email: string, data: Partial<any>): Promise<void> {
    await firstValueFrom(this.http.put(`${this.apiUrl}/email/${email}`, data));
  }

  async listProgrammers(): Promise<User[]> {
    return await firstValueFrom(
      this.http.get<User[]>(`${this.apiUrl}/role/PROGRAMMER`)
    );
  }

  async listUsers(): Promise<User[]> {
    return await firstValueFrom(this.http.get<User[]>(this.apiUrl));
  }

  async updateUserRole(email: string, role: Role): Promise<void> {
    await firstValueFrom(
      this.http.put(`${this.apiUrl}/email/${email}/role`, { role })
    );
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await firstValueFrom(this.http.get<User>(`${this.apiUrl}/email/${email}`));
    } catch (error) {
      return null;
    }
  }

  async updateMyProfile(email: string, data: any): Promise<void> {
    const { role, ...safe } = data;
    await firstValueFrom(this.http.put(`${this.apiUrl}/email/${email}`, safe));
  }
}
