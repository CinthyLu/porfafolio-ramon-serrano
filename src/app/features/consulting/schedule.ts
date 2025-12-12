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
    this.programmers = await this.userService.listProgrammers();

    this.loading = false;
  }

  async submit() {
    if (!this.selectedProgrammer || !this.date || !this.time) return;
    this.submitting = true;

    try {
      const datetime = new Date(this.date + 'T' + this.time).toISOString();

      await this.appointmentService.createAppointment({
        programmerId: this.selectedProgrammer,
        userEmail: this.user!.email,
        userId: this.user!.id, // <-- AHORA SÍ EXISTE
        datetime,
        comment: this.comment,
        status: 'pending'
      });

      alert('Solicitud enviada');
      this.selectedProgrammer = '';
      this.date = '';
      this.time = '';
      this.comment = '';
    } catch (e) {
      console.error(e);
      alert('Error al enviar la solicitud');
    } finally {
      this.submitting = false;
    }
  }

  getLabel(p: any) {
    return p.specialty || p.role || p.fullName;
  }
}
