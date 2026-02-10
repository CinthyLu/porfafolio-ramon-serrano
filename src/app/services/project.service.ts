import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  async createProject(p: Project & { programmerId: string }): Promise<Project> {
    return await firstValueFrom(
      this.http.post<Project>(this.apiUrl, p)
    );
  }

  async listByProgrammer(programmerId: string): Promise<Project[]> {
    return await firstValueFrom(
      this.http.get<Project[]>(`${this.apiUrl}/programmer/${programmerId}`)
    );
  }

  async updateProject(id: string, data: Partial<Project>): Promise<void> {
    await firstValueFrom(
      this.http.put(`${this.apiUrl}/${id}`, data)
    );
  }

  async deleteProject(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/${id}`)
    );
  }

  async getAllProjects(): Promise<Project[]> {
    return await firstValueFrom(
      this.http.get<Project[]>(this.apiUrl)
    );
  }
}
