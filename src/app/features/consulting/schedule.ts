import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Availability, DAY_NAMES, DayOfWeek } from '../../models/availability.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

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

  // Disponibilidades del programador seleccionado
  programmerAvailabilities: Availability[] = [];
  loadingAvailabilities = false;
  availabilityInfo = '';

  // Notificaciones
  notification = { visible: false, message: '', type: '' };
  private notificationTimeout: any;
  minDate = '';

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
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
// Validar disponibilidad del programador
    const dayOfWeek = this.getDayOfWeekFromDate(selected);
    const timeStr = this.time + ':00';
    
    if (this.programmerAvailabilities.length > 0) {
      const isAvailable = this.programmerAvailabilities.some(avail => 
        avail.dayOfWeek === dayOfWeek && 
        avail.isActive &&
        timeStr >= avail.startTime && 
        timeStr <= avail.endTime
      );

      if (!isAvailable) {
        this.showNotification('El programador no está disponible en ese horario', 'error');
        return;
      }
    }

    this.submitting = true;

    try {
      await this.appointmentService.createAppointment({
        programmerId: this.selectedProgrammer,
        datetime: selected.toISOString(),
        comment: this.comment?.trim(),
        userEmail: this.user?.email || '',
        status: 'pending'
      });

      this.showNotification('✅ Solicitud enviada correctamente', 'success');

      this.selectedProgrammer = '';
      this.date = '';
      this.time = '';
      this.comment = '';
      this.programmerAvailabilities = [];
      this.availabilityInfo = '';
    } catch (e: any) {
      console.error(e);
      const errorMsg = e?.error?.message || 'Error al enviar la solicitud';
      this.showNotification(errorMsg, 'error');
    } finally {
      this.submitting = false;
    }
  }

  async onProgrammerChange() {
    this.availabilityInfo = '';
    this.programmerAvailabilities = [];
    
    if (!this.selectedProgrammer) {
      return;
    }

    this.loadingAvailabilities = true;
    
    try {
      // Obtener disponibilidades del programador desde el endpoint público
      const url = `${environment.apiUrl}/public/users/${this.selectedProgrammer}`;
      const programmer: any = await firstValueFrom(this.http.get(url));
      
      if (programmer.availability && programmer.availability.length > 0) {
        this.programmerAvailabilities = programmer.availability;
        this.availabilityInfo = this.formatAvailabilityInfo(programmer.availability);
      } else {
        this.availabilityInfo = '⚠️ Este programador no tiene horarios configurados. Puede que no pueda aceptar su solicitud.';
      }
    } catch (error) {
      console.error('Error loading programmer availability:', error);
      this.availabilityInfo = '';
    } finally {
      this.loadingAvailabilities = false;
    }
  }

  private formatAvailabilityInfo(availabilities: Availability[]): string {
    const byDay = availabilities
      .filter(a => a.isActive)
      .reduce((acc, avail) => {
        const dayName = DAY_NAMES[avail.dayOfWeek];
        const timeRange = `${this.formatTime(avail.startTime)} - ${this.formatTime(avail.endTime)}`;
        
        if (!acc[dayName]) {
          acc[dayName] = [];
        }
        acc[dayName].push(timeRange);
        return acc;
      }, {} as Record<string, string[]>);

    const lines = Object.entries(byDay).map(([day, ranges]) => 
      `${day}: ${ranges.join(', ')}`
    );

    return lines.length > 0 
      ? '📅 Horarios disponibles:\n' + lines.join('\n')
      : '';
  }

  private getDayOfWeekFromDate(date: Date): DayOfWeek {
    const dayIndex = date.getDay();
    const daysMap = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY
    ];
    return daysMap[dayIndex];
  }

  private formatTime(time: string): string {
    return time.substring(0, 5);
  }

  getLabel(p: any) {
    return p.specialty || p.role || p.fullName;
  }

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
