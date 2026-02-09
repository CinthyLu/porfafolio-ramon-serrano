import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AppointmentService } from '../../../../services/appointment.service';
import { AuthService } from '../../../../services/auth.service';
import { Appointment } from '../../../../models/appointment.model';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.scss',
})
export class MyAppointments implements OnInit {
  appointments: Appointment[] = [];
  loading = true;

  constructor(
    private apptService: AppointmentService,
    private auth: AuthService
  ) {}

  async ngOnInit() {
    await this.auth.waitUntilReady();

    const myEmail = this.auth.currentUser?.email;
    if (!myEmail) {
      this.loading = false;
      return;
    }

    this.appointments = await this.apptService.listByUser(myEmail);
    this.loading = false;
  }
}
