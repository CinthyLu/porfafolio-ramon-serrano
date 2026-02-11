import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);

  // ====== PROGRAMMER ENDPOINTS ======

  /** Listar mis proyectos (programador autenticado) */
  async listMyProjects(): Promise<Project[]> {
    const response = await firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/programmer/projects`)
    );
    return response.content || response || [];
  }

  /** Obtener proyecto por ID */
  async getProject(id: string): Promise<Project> {
    return await firstValueFrom(
      this.http.get<Project>(`${environment.apiUrl}/programmer/projects/${id}`)
    );
  }

  /** Crear proyecto (programador autenticado) */
  async createProject(p: Partial<Project>): Promise<Project> {
    return await firstValueFrom(
      this.http.post<Project>(`${environment.apiUrl}/programmer/projects`, p)
    );
  }

  /** Actualizar proyecto */
  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return await firstValueFrom(
      this.http.put<Project>(`${environment.apiUrl}/programmer/projects/${id}`, data)
    );
  }

  /** Eliminar proyecto */
  async deleteProject(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/programmer/projects/${id}`)
    );
  }

  // ====== PUBLIC ENDPOINTS ======

  /** Obtener portafolio público de un programador */
  async getPublicPortfolio(programmerId: string): Promise<any> {
    return await firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/public/programmers/${programmerId}/portfolio`)
    );
  }

  /** Listar programadores públicos */
  async listPublicProgrammers(): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/public/programmers`)
    );
    return response.content || response || [];
  }
}
