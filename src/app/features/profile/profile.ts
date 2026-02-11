import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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

  phone = '';

  companyName = '';
  companyRole = '';
  companyDescription = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  async ngOnInit() {
    const cu = this.authService.currentUser;

    if (!cu?.email) {
      await this.router.navigateByUrl('/login');
      return;
    }

    this.email = cu.email;
    this.photoUrl = cu.photoUrl || '';

    try {
      const me: any = await this.userService.getMe();

      this.fullName = me?.name || me?.fullName || cu.fullName || '';
      this.specialty = me?.specialty || '';
      this.bio = me?.bio || '';
      this.phone = me?.phone || '';

      this.companyName = me?.companyName || '';
      this.companyRole = me?.companyRole || '';
      this.companyDescription = me?.companyDescription || '';
    } catch (e) {
      console.error(e);
      alert('No se pudo cargar el perfil. Revisa conexión y token.');
    } finally {
      this.loading = false;
    }
  }

  private normalizePhoneEC(input: string): string | null {
    if (!input) return null;

    let p = input.trim();
    p = p.replace(/[^\d+]/g, '');

    if (p.startsWith('+')) {
      return p.length >= 10 ? p : null;
    }

    p = p.replace(/\D/g, '');

    if (p.startsWith('0') && p.length === 10) {
      p = p.substring(1);
      return `+593${p}`;
    }

    if (p.length === 9 && p.startsWith('9')) {
      return `+593${p}`;
    }

    return null;
  }

  async save() {
    if (this.saving) return;

    if (!this.fullName.trim()) {
      alert('El nombre es obligatorio.');
      return;
    }

    const normalized = this.normalizePhoneEC(this.phone);

    if (!normalized) {
      alert('Teléfono inválido. Usa formato +5939XXXXXXXX o 09XXXXXXXX.');
      return;
    }

    try {
      this.saving = true;

      const updated: any = await this.userService.updateMyProfile(this.email, {
        name: this.fullName.trim(),
        phone: normalized,
        bio: this.bio.trim(),
        avatarUrl: this.photoUrl || null,
      });

      this.phone = (updated && (updated as any).phone) ? (updated as any).phone : normalized;
      alert('Perfil actualizado.');
    } catch (e) {
      console.error(e);
      alert('No se pudo guardar. Revisa permisos/reglas y el backend.');
    } finally {
      this.saving = false;
    }
  }
}
