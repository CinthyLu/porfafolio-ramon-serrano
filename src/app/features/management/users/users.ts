import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { Role } from '../../../models/role.enum';

@Component({
  selector: 'app-users',
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  programmers: User[] = [];

  // Create form
  fullName = '';
  email = '';
  specialty = '';
  bio = '';

  creating = false;

  constructor(private userService: UserService) {}

  async ngOnInit() {
    await this.loadProgrammers();
  }

  async loadProgrammers() {
    try {
      this.programmers = await this.userService.listProgrammers();
    } catch (e) {
      console.error('Error loading programmers', e);
    }
  }

  async createProgrammer() {
    if (!this.email || !this.fullName) return;
    this.creating = true;
    try {
      const user: User = {
        email: this.email,
        fullName: this.fullName,
        role: Role.Programmer,
        photoUrl: '',
        contacts: {},
      };
      await this.userService.createProgrammer(user);
      this.fullName = '';
      this.email = '';
      this.specialty = '';
      this.bio = '';
      await this.loadProgrammers();
    } catch (e) {
      console.error('Error creating programmer', e);
    } finally {
      this.creating = false;
    }
  }

  async deleteUser(id: string | undefined) {
    if (!id) return;
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await this.userService.deleteUser(id);
      await this.loadProgrammers();
    } catch (e) {
      console.error('Error deleting user', e);
    }
  }
}
