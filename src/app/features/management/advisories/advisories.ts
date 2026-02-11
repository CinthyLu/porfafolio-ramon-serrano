import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Advisory } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';

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

  // Notificaciones
  notification = { visible: false, message: '', type: '' };
  private notificationTimeout: any;

  constructor(
    private apptService: AppointmentService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.isAdmin = this.authService.currentUser?.role === 'ADMIN';
    this.isProgrammer = this.authService.currentUser?.role === 'PROGRAMMER';
    await this.loadAdvisories();
  }

  async loadAdvisories() {
    try {
      this.loading = true;
      this.error = null;
      const status = this.filterStatus !== 'all' ? this.filterStatus : undefined;

      if (this.isAdmin) {
        this.advisories = await this.apptService.listAllAdvisories(status);
      } else if (this.isProgrammer) {
        this.advisories = await this.apptService.listProgrammerAdvisories(status);
      }
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
    if (!advisory.id) return;
    try {
      await this.apptService.approveAdvisory(advisory.id, this.responseMessage);
      advisory.status = 'APPROVED';
      this.responseMessage = '';
      this.selectedAdvisory = null;
      this.showNotification('✅ Asesoría aprobada', 'success');
    } catch (e) {
      this.showNotification('Error aprobando asesoría', 'error');
    }
  }

  async rejectAdvisory(advisory: Advisory) {
    if (!advisory.id) return;
    try {
      await this.apptService.rejectAdvisory(advisory.id, this.responseMessage);
      advisory.status = 'REJECTED';
      this.responseMessage = '';
      this.selectedAdvisory = null;
      this.showNotification('❌ Asesoría rechazada', 'success');
    } catch (e) {
      this.showNotification('Error rechazando asesoría', 'error');
    }
  }

  async completeAdvisory(advisory: Advisory) {
    if (!advisory.id) return;
    try {
      await this.apptService.completeAdvisory(advisory.id);
      advisory.status = 'COMPLETED';
      this.showNotification('✅ Asesoría completada', 'success');
    } catch (e) {
      this.showNotification('Error completando asesoría', 'error');
    }
  }

  async downloadReport(format: 'pdf' | 'excel') {
    try {
      let blob: Blob;
      let filename: string;

      if (this.isAdmin) {
        blob = await this.apptService.downloadAdminAdvisoriesReport(format);
        filename = format === 'pdf' ? 'asesorias-admin.pdf' : 'asesorias-admin.xlsx';
      } else {
        blob = await this.apptService.downloadProgrammerAdvisoriesReport(format);
        filename = format === 'pdf' ? 'mis-asesorias.pdf' : 'mis-asesorias.xlsx';
      }

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      this.showNotification(`Reporte ${format.toUpperCase()} descargado`, 'success');
    } catch (e) {
      this.showNotification(`Error descargando reporte ${format}`, 'error');
    }
  }

  async downloadProjectReport(format: 'pdf' | 'excel') {
    try {
      let blob: Blob;
      let filename: string;

      if (this.isAdmin) {
        blob = await this.apptService.downloadAdminProjectsReport(format);
        filename = format === 'pdf' ? 'proyectos-admin.pdf' : 'proyectos-admin.xlsx';
      } else {
        blob = await this.apptService.downloadProgrammerProjectsReport(format);
        filename = format === 'pdf' ? 'mis-proyectos.pdf' : 'mis-proyectos.xlsx';
      }

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      this.showNotification(`Reporte de proyectos ${format.toUpperCase()} descargado`, 'success');
    } catch (e) {
      this.showNotification(`Error descargando reporte de proyectos`, 'error');
    }
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
}
