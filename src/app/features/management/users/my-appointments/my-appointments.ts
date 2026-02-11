import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService, Advisory } from '../../../../services/appointment.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.scss',
})
export class MyAppointments implements OnInit {
  advisories: Advisory[] = [];
  loading = true;

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
  }

  async loadAdvisories() {
    try {
      this.loading = true;
      this.advisories = await this.apptService.listMyAdvisories();
    } catch (e: any) {
      console.error('[my-appointments] Error:', e);
      this.showNotification('Error cargando solicitudes', 'error');
    } finally {
      this.loading = false;
    }
  }

  async cancelAdvisory(advisory: Advisory) {
    if (!advisory.id) return;
    if (!confirm('¿Cancelar esta solicitud de asesoría?')) return;

    try {
      await this.apptService.cancelAdvisory(advisory.id);
      advisory.status = 'CANCELLED';
      this.showNotification('Solicitud cancelada', 'success');
    } catch (e) {
      this.showNotification('Error cancelando solicitud', 'error');
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobada',
      REJECTED: 'Rechazada',
      COMPLETED: 'Completada',
      CANCELLED: 'Cancelada',
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      PENDING: 'pending',
      APPROVED: 'approved',
      REJECTED: 'rejected',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
    };
    return colors[status] || 'pending';
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
