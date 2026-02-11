import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppointmentService, Advisory } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DatePipe, CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments implements OnInit, OnDestroy {
  advisories: Advisory[] = [];
  sub!: Subscription;
  loading = true;
  filterStatus = 'all';
  responseMessage = '';
  selectedAdvisory: Advisory | null = null;

  // Notificaciones
  notification = { visible: false, message: '', type: '' };
  private notificationTimeout: any;

  constructor(
    private apptService: AppointmentService,
    private auth: AuthService
  ) { }

  async ngOnInit() {
    await this.auth.waitUntilReady();

    if (!this.auth.currentUser) {
      this.loading = false;
      return;
    }

    await this.loadAdvisories();
    this.loading = false;

    // Updates en vivo via CommunicationService
    this.sub = new Subscription();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async loadAdvisories() {
    try {
      this.loading = true;
      const status = this.filterStatus !== 'all' ? this.filterStatus : undefined;
      this.advisories = await this.apptService.listProgrammerAdvisories(status);
    } catch (e: any) {
      console.error('[appointments] Error:', e);
      this.showNotification('Error cargando asesorías', 'error');
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

  async approve(advisory: Advisory) {
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

  async reject(advisory: Advisory) {
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

  async complete(advisory: Advisory) {
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
      const blob = await this.apptService.downloadProgrammerAdvisoriesReport(format);
      const filename = format === 'pdf' ? 'mis-asesorias.pdf' : 'mis-asesorias.xlsx';
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      this.showNotification(`Reporte ${format.toUpperCase()} descargado`, 'success');
    } catch (e) {
      this.showNotification(`Error descargando reporte ${format}`, 'error');
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
