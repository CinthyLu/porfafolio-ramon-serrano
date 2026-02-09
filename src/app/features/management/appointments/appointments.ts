import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { CommunicationService } from '../../../services/communication.service';
import { Appointment } from '../../../models/appointment.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DatePipe, CommonModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class Appointments implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  sub!: Subscription;

  loading = true;

  constructor(
    private apptService: AppointmentService,
    private auth: AuthService,
    private comm: CommunicationService
  ) {}

  async ngOnInit() {
    // 1) Esperar a que auth cargue
    await this.auth.waitUntilReady();

    const myEmail = this.auth.currentUser?.email;
    if (!myEmail) {
      this.loading = false;
      return;
    }

    // 2) Carga inicial (esto es lo que te faltaba)
    this.appointments = await this.apptService.listByProgrammer(myEmail);
    this.loading = false;

    // 3) Updates en vivo (simulación interna)
    this.sub = this.comm.message$.subscribe(async (m: any) => {
      if (!m) return;

      if (!this.auth.currentUser?.email) return;

      if (m.type === 'new-appointment' && m.appointment?.programmerId === myEmail) {
        this.appointments = await this.apptService.listByProgrammer(myEmail);
      }

      if (m.type === 'appointment-updated') {
        this.appointments = await this.apptService.listByProgrammer(myEmail);
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async respond(id: string | undefined, approve: boolean) {
    if (!id) return;

    const status = approve ? 'approved' : 'rejected';
    const responseMessage = approve ? 'He aprobado la asesoría' : 'Lo siento, no puedo en ese horario';

    await this.apptService.updateAppointmentStatus(id, status, responseMessage);

    const myEmail = this.auth.currentUser?.email;
    if (myEmail) {
      this.appointments = await this.apptService.listByProgrammer(myEmail);
    }
  }
}
