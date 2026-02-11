import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss',   // ✔ SOLO styleUrl
})

export class Schedule implements OnInit {
  programmers: User[] = [];
  selectedProgrammer = '';
  date = '';
  time = '';
  comment = '';
  submitting = false;

  loading = true;
  error: string | null = null;
  user: User | null = null;

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    console.log('[schedule] Iniciando Schedule...');

    // ⏳ ESPERAMOS a que Firebase cargue el usuario
    await this.auth.waitUntilReady();
    this.user = this.auth.currentUser;
    this.minDate = this.toMinDateISO();

    console.log('[schedule] Usuario cargado:', this.user);

    // ❌ SI NO HAY USUARIO → REENVIAR A LOGIN
    if (!this.user) {
      console.warn('[schedule] Sin usuario. Redirigiendo al login…');
      this.router.navigate(['/login'], {
        queryParams: { redirectTo: '/consulting/schedule' }
      });
      return;
    }

    // ✔️ YA HAY USUARIO → cargar programadores
    try {
      console.log('[schedule] Cargando programadores...');
      this.programmers = await this.userService.listProgrammers();
      console.log('[schedule] Programadores cargados:', this.programmers);
      
      if (this.programmers.length === 0) {
        this.error = 'No hay programadores disponibles en este momento.';
        this.showNotification(this.error ?? 'No hay programadores', 'error');
      }
    } catch (e: any) {
      console.error('[schedule] Error cargando programadores:', e);
      this.error = e?.error?.message || 'Error al cargar programadores. Intenta nuevamente.';
      this.showNotification(this.error ?? 'Error cargando programadores', 'error');
    } finally {
      this.loading = false;
    }
  }

  async submit() {
    if (this.submitting) return;

    if (!this.selectedProgrammer || !this.date || !this.time) {
      this.showNotification('Completa programador, fecha y hora', 'error');
      return;
    }

    const selected = new Date(this.date + 'T' + this.time);
    if (isNaN(selected.getTime())) {
      this.showNotification('Fecha u hora inválida', 'error');
      return;
    }

    if (selected.getTime() < Date.now()) {
      this.showNotification('Selecciona una fecha/hora futura', 'error');
      return;
    }

    this.submitting = true;

    try {
      const datetime = selected.toISOString();

      await this.appointmentService.createAppointment({
        programmerId: this.selectedProgrammer, // docId = email del programador
        userEmail: this.user!.email,
        userId: this.user!.id,
        datetime,
        comment: this.comment?.trim(),
        status: 'pending',
      });

      this.showNotification('Solicitud enviada', 'success');

      this.selectedProgrammer = '';
      this.date = '';
      this.time = '';
      this.comment = '';
    } catch (e) {
      console.error(e);
      this.showNotification('Error al enviar la solicitud', 'error');
    } finally {
      this.submitting = false;
    }
  }

  getLabel(p: any) {
    return p.specialty || p.role || p.fullName;
  }
  notification = { visible: false, message: '', type: '' };
  private notificationTimeout: any;

  minDate = '';

  private showNotification(message: string, type: 'info' | 'success' | 'error' = 'info', duration = 3000) {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.visible = true;
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => (this.notification.visible = false), duration);
  }

  private toMinDateISO(): string {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

}
