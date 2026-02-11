import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CommunicationService } from './communication.service';
import { environment } from '../../environments/environment';

export interface Advisory {
  id?: string;
  programmerId: string;
  externalId?: string;
  programmerName?: string;
  externalName?: string;
  scheduledAt: string;
  status: string;
  requestComment?: string;
  responseMessage?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private comm = inject(CommunicationService);

  // ====== EXTERNAL USER (rol USER) ======

  /** Crear una solicitud de asesoría (usuario externo) */
  async createAppointment(data: {
    programmerId: string;
    scheduledAt: string;
    comment?: string;
  }): Promise<Advisory> {
    const advisory = await firstValueFrom(
      this.http.post<Advisory>(`${environment.apiUrl}/external/advisories`, {
        programmerId: data.programmerId,
        scheduledAt: data.scheduledAt,
        comment: data.comment
      })
    );

    this.comm.sendMessage({ type: 'new-appointment', appointment: advisory });
    return advisory;
  }

  /** Listar mis asesorías solicitadas (usuario externo, usa JWT) */
  async listMyAdvisories(): Promise<Advisory[]> {
    const response = await firstValueFrom(
      this.http.get<any>(`${environment.apiUrl}/external/advisories`)
    );
    // El backend devuelve Page<AdvisoryResponse>, extraer content
    return response.content || response || [];
  }

  /** Cancelar una asesoría pendiente (usuario externo) */
  async cancelAdvisory(id: string): Promise<Advisory> {
    return await firstValueFrom(
      this.http.put<Advisory>(`${environment.apiUrl}/external/advisories/${id}/cancel`, {})
    );
  }

  // ====== PROGRAMMER ======

  /** Listar asesorías recibidas (programador, usa JWT) */
  async listProgrammerAdvisories(status?: string): Promise<Advisory[]> {
    let url = `${environment.apiUrl}/programmer/advisories`;
    if (status) {
      url += `?status=${status}`;
    }
    const response = await firstValueFrom(
      this.http.get<any>(url)
    );
    return response.content || response || [];
  }

  /** Aprobar una asesoría (programador) */
  async approveAdvisory(id: string, message?: string): Promise<Advisory> {
    return await firstValueFrom(
      this.http.put<Advisory>(
        `${environment.apiUrl}/programmer/advisories/${id}/approve`,
        { message: message || '' }
      )
    );
  }

  /** Rechazar una asesoría (programador) */
  async rejectAdvisory(id: string, message?: string): Promise<Advisory> {
    return await firstValueFrom(
      this.http.put<Advisory>(
        `${environment.apiUrl}/programmer/advisories/${id}/reject`,
        { message: message || '' }
      )
    );
  }

  /** Completar una asesoría (programador) */
  async completeAdvisory(id: string): Promise<Advisory> {
    return await firstValueFrom(
      this.http.put<Advisory>(
        `${environment.apiUrl}/programmer/advisories/${id}/complete`,
        {}
      )
    );
  }

  // ====== ADMIN ======

  /** Listar todas las asesorías (admin) */
  async listAllAdvisories(status?: string): Promise<Advisory[]> {
    let url = `${environment.apiUrl}/admin/advisories`;
    if (status) {
      url += `?status=${status}`;
    }
    const response = await firstValueFrom(
      this.http.get<any>(url)
    );
    return response.content || response || [];
  }

  /** Obtener una asesoría por ID */
  async getAdvisory(id: string): Promise<Advisory> {
    return await firstValueFrom(
      this.http.get<Advisory>(`${environment.apiUrl}/admin/advisories/${id}`)
    );
  }

  // ====== REPORTES ======

  /** Descargar reporte PDF de asesorías (admin) */
  async downloadAdminAdvisoriesReport(format: 'pdf' | 'excel'): Promise<Blob> {
    const ext = format === 'pdf' ? 'pdf' : 'excel';
    return await firstValueFrom(
      this.http.get(`${environment.apiUrl}/admin/reports/advisories/${ext}`, {
        responseType: 'blob'
      })
    );
  }

  /** Descargar reporte PDF de proyectos (admin) */
  async downloadAdminProjectsReport(format: 'pdf' | 'excel'): Promise<Blob> {
    const ext = format === 'pdf' ? 'pdf' : 'excel';
    return await firstValueFrom(
      this.http.get(`${environment.apiUrl}/admin/reports/projects/${ext}`, {
        responseType: 'blob'
      })
    );
  }

  /** Descargar reporte de asesorías del programador */
  async downloadProgrammerAdvisoriesReport(format: 'pdf' | 'excel'): Promise<Blob> {
    const ext = format === 'pdf' ? 'pdf' : 'excel';
    return await firstValueFrom(
      this.http.get(`${environment.apiUrl}/programmer/reports/advisories/${ext}`, {
        responseType: 'blob'
      })
    );
  }

  /** Descargar reporte de proyectos del programador */
  async downloadProgrammerProjectsReport(format: 'pdf' | 'excel'): Promise<Blob> {
    const ext = format === 'pdf' ? 'pdf' : 'excel';
    return await firstValueFrom(
      this.http.get(`${environment.apiUrl}/programmer/reports/projects/${ext}`, {
        responseType: 'blob'
      })
    );
  }
}
