import { Injectable } from '@angular/core';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../main';
import { Appointment } from '../models/appointment.model';
import { CommunicationService } from './communication.service';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private col = collection(db, 'appointments');

  constructor(private comm: CommunicationService) {}

  async createAppointment(a: Appointment) {
    const payload = { ...a, status: 'pending', createdAt: new Date().toISOString() };
    const docRef = await addDoc(this.col, payload as any);
    const id = docRef.id;
    const appointment = { ...payload, id } as Appointment;
    // Notify programmer via CommunicationService (internal simulation)
    this.comm.sendMessage({ type: 'new-appointment', appointment });
    return appointment;
  }

  async listByProgrammer(programmerId: string) {
    const q = query(this.col, where('programmerId', '==', programmerId));
    const snaps = await getDocs(q);
    const items: Appointment[] = [];
    snaps.forEach(s => items.push({ ...(s.data() as Appointment), id: s.id }));
    return items;
  }

  async updateAppointmentStatus(id: string, status: string, responseMessage?: string) {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, { status, responseMessage } as any);
    this.comm.sendMessage({ type: 'appointment-updated', id, status, responseMessage });
  }
}
