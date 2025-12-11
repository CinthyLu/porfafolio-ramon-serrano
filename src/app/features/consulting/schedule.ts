import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-schedule',
  imports: [FormsModule, NgFor, RouterLink],
  templateUrl: './schedule.html',
  styleUrl: './consulting.scss',
})
export class Schedule implements OnInit {
  programmers: User[] = [];
  selectedProgrammer = '';
  date = '';
  time = '';
  comment = '';
  submitting = false;

  constructor(private userService: UserService, private appointmentService: AppointmentService, private auth: AuthService) {}

  async ngOnInit() {
    this.programmers = await this.userService.listProgrammers();
  }

  async submit() {
    if (!this.selectedProgrammer || !this.date || !this.time) return;
    this.submitting = true;
    try {
      const datetime = new Date(this.date + 'T' + this.time).toISOString();
      const appointment = await this.appointmentService.createAppointment({
        programmerId: this.selectedProgrammer,
        userId: this.auth.currentUser?.id,
        datetime,
        comment: this.comment,
        status: 'pending',
      } as any);
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
