import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  loading = true;
  saving = false;

  email = '';
  photoUrl = '';

  fullName = '';
  specialty = '';
  bio = '';

  companyName = '';
  companyRole = '';
  companyDescription = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    const cu = this.authService.currentUser;
    if (!cu?.email) {
      await this.router.navigateByUrl('/login');
      return;
    }

    this.email = cu.email;
    this.photoUrl = cu.photoUrl || '';

    try {
      const u = await this.userService.getUserByEmail(this.email);

      this.fullName = u?.fullName || cu.fullName || '';
      this.specialty = u?.specialty || '';
      this.bio = u?.bio || '';

      this.companyName = (u as any)?.companyName || '';
      this.companyRole = (u as any)?.companyRole || '';
      this.companyDescription = (u as any)?.companyDescription || '';
    } finally {
      this.loading = false;
    }
  }

  async save() {
    if (this.saving) return;
    if (!this.fullName.trim()) {
      alert('El nombre es obligatorio.');
      return;
    }

    try {
      this.saving = true;

      await this.userService.updateMyProfile(this.email, {
        fullName: this.fullName.trim(),
        specialty: this.specialty.trim(),
        bio: this.bio.trim(),
        companyName: this.companyName.trim(),
        companyRole: this.companyRole.trim(),
        companyDescription: this.companyDescription.trim(),
      });

      alert('Perfil actualizado.');
    } catch (e) {
      console.error(e);
      alert('No se pudo guardar. Revisa permisos/reglas.');
    } finally {
      this.saving = false;
    }
  }
}
