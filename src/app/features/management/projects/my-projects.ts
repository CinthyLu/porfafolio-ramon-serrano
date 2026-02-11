import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { AuthService } from '../../../services/auth.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-my-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-projects.html',
  styleUrl: './projects.scss',
})
export class MyProjects implements OnInit {
  projects: Project[] = [];

  // form
  name = '';
  description = '';
  category: any = 'academic';
  participation: any = 'Frontend';
  technologies = '';
  repoUrl = '';
  deployUrl = '';

  loading = false;

  // Notificaciones
  notification = { visible: false, message: '', type: '' };
  private notificationTimeout: any;

  constructor(private ps: ProjectService, private auth: AuthService) { }

  async ngOnInit() {
    await this.load();
  }

  async load() {
    if (!this.auth.currentUser) return;
    try {
      this.projects = await this.ps.listMyProjects();
    } catch (e) {
      console.error('Error loading projects:', e);
      this.showNotification('Error cargando proyectos', 'error');
    }
  }

  async create() {
    if (!this.auth.currentUser) {
      this.showNotification('No autenticado', 'error');
      return;
    }
    if (!this.name) {
      this.showNotification('Nombre del proyecto es requerido', 'error');
      return;
    }
    this.loading = true;
    try {
      const p: any = {
        name: this.name,
        description: this.description,
        category: this.category,
        participation: this.participation,
        technologies: this.technologies.split(',').map(t => t.trim()).filter(t => t),
        repoUrl: this.repoUrl,
        deployUrl: this.deployUrl,
      };
      await this.ps.createProject(p);
      this.name = '';
      this.description = '';
      this.technologies = '';
      this.repoUrl = '';
      this.deployUrl = '';
      await this.load();
      this.showNotification('✅ Proyecto creado correctamente', 'success');
    } catch (e) {
      console.error(e);
      this.showNotification('Error creando proyecto', 'error');
    } finally {
      this.loading = false;
    }
  }

  async delete(id?: string) {
    if (!id) return;
    if (!confirm('¿Eliminar proyecto?')) return;
    try {
      await this.ps.deleteProject(id);
      await this.load();
      this.showNotification('Proyecto eliminado', 'success');
    } catch (e) {
      console.error(e);
      this.showNotification('Error eliminando proyecto', 'error');
    }
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
