import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AvailabilityService } from '../../../services/availability.service';
import { Availability, DayOfWeek, DAY_NAMES } from '../../../models/availability.model';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, FormsModule, RouterLink],
  templateUrl: './availability.html',
  styleUrl: './availability.scss',
})
export class AvailabilityManagement implements OnInit {
  availabilities: Availability[] = [];
  loading = true;
  showForm = false;
  editingId: string | null = null;

  // Formulario
  formData: Availability = {
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '09:00:00',
    endTime: '17:00:00'
  };

  // Días de la semana
  daysOfWeek = Object.values(DayOfWeek);
  dayNames = DAY_NAMES;

  // Mensajes
  successMessage = '';
  errorMessage = '';

  constructor(private availabilityService: AvailabilityService) {}

  async ngOnInit() {
    await this.loadAvailabilities();
  }

  async loadAvailabilities() {
    try {
      this.loading = true;
      this.availabilities = await this.availabilityService.list();
    } catch (error: any) {
      this.errorMessage = 'Error al cargar disponibilidades: ' + (error.error?.message || error.message);
    } finally {
      this.loading = false;
    }
  }

  openCreateForm() {
    this.showForm = true;
    this.editingId = null;
    this.formData = {
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '09:00:00',
      endTime: '17:00:00'
    };
    this.clearMessages();
  }

  openEditForm(availability: Availability) {
    this.showForm = true;
    this.editingId = availability.id || null;
    this.formData = {
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime
    };
    this.clearMessages();
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
    this.clearMessages();
  }

  async submitForm() {
    try {
      this.clearMessages();

      // Validaciones
      if (!this.formData.dayOfWeek) {
        this.errorMessage = 'Debe seleccionar un día de la semana';
        return;
      }

      if (!this.formData.startTime || !this.formData.endTime) {
        this.errorMessage = 'Debe especificar hora de inicio y fin';
        return;
      }

      // Convertir formato HH:mm a HH:mm:ss si es necesario
      this.formData.startTime = this.normalizeTime(this.formData.startTime);
      this.formData.endTime = this.normalizeTime(this.formData.endTime);

      // Validar que la hora de fin sea mayor que la de inicio
      if (this.formData.startTime >= this.formData.endTime) {
        this.errorMessage = 'La hora de fin debe ser posterior a la hora de inicio';
        return;
      }

      if (this.editingId) {
        // Actualizar
        await this.availabilityService.update(this.editingId, this.formData);
        this.successMessage = 'Disponibilidad actualizada correctamente';
      } else {
        // Crear
        await this.availabilityService.create(this.formData);
        this.successMessage = 'Disponibilidad creada correctamente';
      }

      await this.loadAvailabilities();
      this.showForm = false;
      this.editingId = null;

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => this.clearMessages(), 3000);
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Error al guardar la disponibilidad';
    }
  }

  async deleteAvailability(id: string | undefined) {
    if (!id) return;

    if (!confirm('¿Está seguro de eliminar esta disponibilidad?')) {
      return;
    }

    try {
      this.clearMessages();
      await this.availabilityService.delete(id);
      this.successMessage = 'Disponibilidad eliminada correctamente';
      await this.loadAvailabilities();

      setTimeout(() => this.clearMessages(), 3000);
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Error al eliminar la disponibilidad';
    }
  }

  private normalizeTime(time: string): string {
    // Si ya tiene formato HH:mm:ss, retornar
    if (time.split(':').length === 3) {
      return time;
    }
    // Si tiene formato HH:mm, agregar :00
    return time + ':00';
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getDayName(dayOfWeek: DayOfWeek): string {
    return this.dayNames[dayOfWeek] || dayOfWeek;
  }

  formatTime(time: string): string {
    // Convertir HH:mm:ss a HH:mm para mostrar
    return time.substring(0, 5);
  }
}
