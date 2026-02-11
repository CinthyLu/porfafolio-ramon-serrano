import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { Role } from '../../../models/role.enum';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-users',
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  Role = Role;

  users: User[] = [];
  selectedEmail: string | null = null;
  filteredUsers: User[] = [];

  filterRole: 'all' | Role = 'all';

  creating = false;

  // Edición de perfil programador
  editingId: string | null = null;
  fullName = '';
  email = '';
  specialty = '';
  bio = '';

  isAdmin = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  selectUser(u: User) {
    this.selectedEmail = u.email;
  }

  isSelected(u: User): boolean {
    return this.selectedEmail === u.email;
  }

  clearSelection() {
    this.selectedEmail = null;
  }
  async ngOnInit() {
    this.isAdmin = this.authService.currentUser?.role === Role.Admin;
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.users = await this.userService.listUsers();
      this.applyFilter();
    } catch (e) {
      console.error('Error loading users', e);
      alert('No se pudieron cargar los usuarios.');
    }
  }

  applyFilter() {
    if (this.filterRole === 'all') {
      this.filteredUsers = [...this.users];
      return;
    }
    this.filteredUsers = this.users.filter(u => u.role === this.filterRole);
  }

  async changeRole(u: User, newRoleValue: string) {
    if (!this.isAdmin) {
      alert('Solo el administrador puede cambiar roles.');
      return;
    }

    const newRole = newRoleValue as Role;
    if (u.email === this.authService.currentUser?.email && newRole === Role.User) {
      alert('No puedes quitarte el rol admin a ti misma.');
      return;
    }

    try {
      await this.userService.updateUserRole(u.email || '', newRole);
      u.role = newRole;
      this.applyFilter();
    } catch (e) {
      console.error('Error updating role', e);
      alert('No se pudo actualizar el rol. Revisa permisos/reglas.');
    }
  }

  async deleteUser(user: User) {
    if (!user?.id) {
      alert('No se puede eliminar: usuario sin ID.');
      return;
    }
    if (!confirm(`¿Eliminar al usuario ${user.email}?`)) return;

    try {
      await this.userService.deleteUser(user.id);
      await this.loadUsers();
    } catch (e) {
      console.error('Error deleting user', e);
      alert('No se pudo eliminar. Revisa consola/permisos.');
    }
  }


  startEdit(u: any) {
    this.editingId = u.email || null;
    this.fullName = u.fullName || '';
    this.email = u.email || '';
    this.specialty = u.specialty || '';
    this.bio = u.bio || '';
  }

  cancelEdit() {
    this.editingId = null;
    this.fullName = '';
    this.email = '';
    this.specialty = '';
    this.bio = '';
  }

  async saveProgrammer() {
    if (this.creating) return;

    if (!this.fullName.trim() || !this.email.trim()) {
      alert('Nombre y email son obligatorios.');
      return;
    }

    try {
      this.creating = true;

      if (this.editingId) {
        await this.userService.updateUser(this.editingId, {
          fullName: this.fullName.trim(),
          specialty: this.specialty.trim(),
          bio: this.bio.trim(),
        });

        this.cancelEdit();
        await this.loadUsers();
        return;
      }

      await this.userService.createProgrammer({
        name: this.fullName.trim(),
        email: this.email.trim(),
        bio: this.bio.trim(),
        phone: this.specialty.trim(), // Usar specialty como phone temporalmente
        avatarUrl: '',
        role: Role.Programmer,
      });

      this.cancelEdit();
      await this.loadUsers();
    } catch (e) {
      console.error('Error creating/updating programmer', e);
      alert('No se pudo guardar. Revisa consola/permisos.');
    } finally {
      this.creating = false;
    }
  }
}