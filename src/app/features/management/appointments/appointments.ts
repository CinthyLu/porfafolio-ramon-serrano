import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { CommunicationService } from '../../../services/communication.service';
import { Appointment } from '../../../models/appointment.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, DatePipe],
  templateUrl: './appointments.html',
  styleUrl: '../../consulting/consulting.scss',
})
export class Appointments implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  sub!: Subscription;

  constructor(private apptService: AppointmentService, private auth: AuthService, private comm: CommunicationService) {}

  async ngOnInit() {
    const pid = this.auth.currentUser?.id;
    if (pid) {
      this.appointments = await this.apptService.listByProgrammer(pid);
    }

    this.sub = this.comm.message$.subscribe(async (m: any) => {
      if (!m) return;
      if (m.type === 'new-appointment' && m.appointment?.programmerId === this.auth.currentUser?.id) {
        this.appointments = await this.apptService.listByProgrammer(this.auth.currentUser!.id!);
      }
      if (m.type === 'appointment-updated') {
        this.appointments = await this.apptService.listByProgrammer(this.auth.currentUser!.id!);
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async respond(id: string | undefined, approve: boolean) {
    if (!id) return;
    const status = approve ? 'approved' : 'rejected';
    const message = approve ? 'He aprobado la asesoría' : 'Lo siento, no puedo en ese horario';
    await this.apptService.updateAppointmentStatus(id, status, message);
    this.appointments = await this.apptService.listByProgrammer(this.auth.currentUser!.id!);
  }
}
