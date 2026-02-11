import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/role.enum';

interface Advisory {
  id: string;
  programmerId: string;
  externalId: string;
  programmername?: string;
  externalName?: string;
  scheduledAt: string;
  status: string;
  requestComment?: string;
  responseMessage?: string;
}

@Component({
  selector: 'app-advisories',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DatePipe, CommonModule, FormsModule],
  templateUrl: './advisories.html',
  styleUrl: './advisories.scss',
})
export class Advisories implements OnInit {
  advisories: Advisory[] = [];
  loading = true;
  error: string | null = null;
  isAdmin = false;
  isProgrammer = false;
  filterStatus = 'all';
  selectedAdvisory: Advisory | null = null;
  responseMessage = '';
  responding = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.isAdmin = this.authService.currentUser?.role === 'ADMIN';
    this.isProgrammer = this.authService.currentUser?.role === 'PROGRAMMER';
    await this.loadAdvisories();
  }

  async loadAdvisories() {
    try {
      this.loading = true;
      const url = `${environment.apiUrl}/admin/advisories`;
      const data = await this.http.get<Advisory[]>(url).toPromise();
      this.advisories = data || [];
      console.log('[advisories] Loaded:', this.advisories);
    } catch (e: any) {
      console.error('[advisories] Error:', e);
      this.error = e?.error?.message || 'Error cargando asesorías';
    } finally {
      this.loading = false;
    }
  }

  getFilteredAdvisories(): Advisory[] {
    if (this.filterStatus === 'all') {
      return this.advisories;
    }
    return this.advisories.filter(a => a.status === this.filterStatus);
  }

  selectAdvisory(advisory: Advisory) {
    this.selectedAdvisory = this.selectedAdvisory?.id === advisory.id ? null : advisory;
  }

  isSelected(advisory: Advisory): boolean {
    return this.selectedAdvisory?.id === advisory.id;
  }

  async approveAdvisory(advisory: Advisory) {
    try {
      const url = `${environment.apiUrl}/programmer/advisories/${advisory.id}/approve`;
      await this.http.put(url, {}).toPromise();
      advisory.status = 'APPROVED';
      this.showNotification('Asesoría aprobada', 'success');
    } catch (e) {
      this.showNotification('Error aprobando asesoría', 'error');
    }
  }

  async rejectAdvisory(advisory: Advisory) {
    try {
      const url = `${environment.apiUrl}/programmer/advisories/${advisory.id}/reject`;
      await this.http.put(url, { message: this.responseMessage }).toPromise();
      advisory.status = 'REJECTED';
      this.responseMessage = '';
      this.selectedAdvisory = null;
      this.showNotification('Asesoría rechazada', 'success');
    } catch (e) {
      this.showNotification('Error rechazando asesoría', 'error');
    }
  }

  async downloadReport(format: 'pdf' | 'excel') {
    try {
      const url = format === 'pdf'
        ? `${environment.apiUrl}/admin/reports/advisories/pdf`
        : `${environment.apiUrl}/admin/reports/advisories/excel`;
      
      const data = await this.http.get(url, { responseType: 'blob' }).toPromise();
      const blob = data as Blob;
      const filename = format === 'pdf' ? 'asesorias.pdf' : 'asesorias.xlsx';
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      
      this.showNotification(`Reporte ${format.toUpperCase()} descargado`, 'success');
    } catch (e) {
      this.showNotification(`Error descargando reporte ${format}`, 'error');
    }
  }

  notification = { visible: false, message: '', type: '' };
  private notificationTimeout: any;

  private showNotification(
    message: string,
    type: 'info' | 'success' | 'error' = 'info',
    duration = 3000
  ) {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.visible = true;
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(
      () => (this.notification.visible = false),
      duration
    );
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      PENDING: 'pending',
      SCHEDULED: 'scheduled',
      APPROVED: 'approved',
      REJECTED: 'rejected',
      COMPLETED: 'completed',
    };
    return colors[status] || 'pending';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      PENDING: 'Pendiente',
      SCHEDULED: 'Programada',
      APPROVED: 'Aprobada',
      REJECTED: 'Rechazada',
      COMPLETED: 'Completada',
    };
    return labels[status] || status;
  }
}
