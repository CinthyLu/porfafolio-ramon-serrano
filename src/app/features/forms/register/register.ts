import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '../../../../main';
import { Role } from '../../../models/role.enum';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  fullName = '';
  email = '';
  password = '';
  password1 = '';

  submitting = false;

  notification = { visible: false, message: '', type: '' };
  private notificationTimeout: any;

  constructor(private router: Router) {}

  private showNotification(
    message: string,
    type: 'info' | 'success' | 'error' = 'info',
    duration = 3000
  ) {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.visible = true;
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => (this.notification.visible = false), duration);
  }

  private isStrongPassword(p: string): boolean {
    return p.length >= 6;
  }

  async register(form: NgForm) {
    if (this.submitting) return;

    if (!form.valid) {
      this.showNotification('Revisa los campos marcados', 'error');
      return;
    }

    if (this.password !== this.password1) {
      this.showNotification('Las contraseñas no coinciden', 'error');
      return;
    }

    if (!this.isStrongPassword(this.password)) {
      this.showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    this.submitting = true;

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        this.email.trim(),
        this.password
      );

      await setDoc(
        doc(db, 'users', this.email.trim()),
        {
          fullName: this.fullName.trim(),
          email: this.email.trim(),
          photoUrl: userCredential.user.photoURL || '',
          role: Role.User,
          createdAt: new Date().toISOString(),
          contacts: {},
        },
        { merge: true }
      );

      this.showNotification('Cuenta creada correctamente', 'success');
      await this.router.navigate(['/home']);
} catch (e: any) {
  console.error('Error en registro:', e);

  const code = e?.code || '';
  let msg = 'No se pudo crear la cuenta';

  if (code === 'auth/email-already-in-use') msg = 'Ese correo ya está registrado';
  else if (code === 'auth/invalid-email') msg = 'El correo no es válido';
  else if (code === 'auth/weak-password') msg = 'La contraseña es muy débil (mínimo 6 caracteres)';
  else if (code === 'auth/operation-not-allowed') msg = 'Debes habilitar Email/Password en Firebase Authentication';
  else if (code === 'auth/network-request-failed') msg = 'Error de red. Revisa tu conexión';

  this.showNotification(msg, 'error');
} finally {
  this.submitting = false;
}
  }

  async loginWithGoogle() {
    if (this.submitting) return;
    this.submitting = true;

    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      const result = await signInWithPopup(auth, provider);

      const email = result.user.email || '';
      if (!email) {
        this.showNotification('Google no devolvió email', 'error');
        return;
      }

      const ref = doc(db, 'users', email);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          fullName: result.user.displayName || 'Usuario',
          email,
          photoUrl: result.user.photoURL || '',
          role: Role.User,
          createdAt: new Date().toISOString(),
          contacts: {},
        });
      }

      this.showNotification('Inicio de sesión exitoso', 'success');
      await this.router.navigate(['/home']);
    } catch (e) {
      console.error('Error login Google en register:', e);
      this.showNotification('Ocurrió un error con Google', 'error');
    } finally {
      this.submitting = false;
    }
  }
}
