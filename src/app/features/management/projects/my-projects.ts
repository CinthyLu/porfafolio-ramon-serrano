import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { AuthService } from '../../../services/auth.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-my-projects',
  imports: [NgFor, NgIf, FormsModule],
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

  constructor(private ps: ProjectService, private auth: AuthService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    const pid = this.auth.currentUser?.id;
    if (!pid) return;
    this.projects = await this.ps.listByProgrammer(pid);
  }

  async create() {
    const pid = this.auth.currentUser?.id;
    if (!pid) return alert('No autenticado');
    if (!this.name) return alert('Nombre requerido');
    this.loading = true;
    try {
      const p: any = {
        name: this.name,
        description: this.description,
        category: this.category,
        participation: this.participation,
        technologies: this.technologies.split(',').map(t => t.trim()),
        repoUrl: this.repoUrl,
        deployUrl: this.deployUrl,
        programmerId: pid,
      };
      await this.ps.createProject(p);
      this.name = '';
      this.description = '';
      this.technologies = '';
      this.repoUrl = '';
      this.deployUrl = '';
      await this.load();
    } catch (e) {
      console.error(e);
      alert('Error creando proyecto');
    } finally { this.loading = false; }
  }

  async delete(id?: string) {
    if (!id) return;
    if (!confirm('Eliminar proyecto?')) return;
    await this.ps.deleteProject(id);
    await this.load();
  }
}
