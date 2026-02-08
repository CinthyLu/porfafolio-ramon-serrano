import { Component } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '../../../../main';
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/role.enum';

@Component({
  selector: 'app-login',
  imports: [RouterLink, NgIf, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  notification = { visible: false, message: '', type: '' };
  private notificationTimeout: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  private showNotification(message: string, type: string = 'info', duration: number = 3000) {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.visible = true;
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => (this.notification.visible = false), duration);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email || '';
      if (!email) {
        this.showNotification('Google no devolvió email', 'error');
        return;
      }

            // 1) Asegurar documento en Firestore
      const ref = doc(db, 'users', email);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          fullName: result.user.displayName || 'Usuario',
          email,
          photoUrl: result.user.photoURL || '',
          role: 'user', 
          createdAt: new Date().toISOString(),
          contacts: {},
        });
      }

      // 2) Leer perfil real desde Firestore
      const usuario = await this.authService.getUserByEmail(email);

      // 3) Determinar rol con fallback seguro
      const rol = (usuario?.role as Role) || Role.User;

      // 4) Set currentUser (sin explotar si usuario es null)
      this.authService.currentUser = {
        id: result.user.uid,
        email,
        fullName: usuario?.fullName || result.user.displayName || 'Usuario',
        role: rol,
        photoUrl: usuario?.photoUrl || result.user.photoURL || '',
        contacts: usuario?.contacts || {},
        createdAt: usuario?.createdAt || new Date().toISOString(),
      };

      this.showNotification('Inicio de sesión exitoso', 'success');

      const redirectToRaw = this.route.snapshot.queryParamMap.get('redirectTo') || '/home';
      const redirectTo = decodeURIComponent(redirectToRaw);
      const path = redirectTo.startsWith('/') ? redirectTo : '/' + redirectTo;


      await this.router.navigateByUrl(path);
    } catch (error) {
      console.error('[login] Google sign-in error', error);
      this.showNotification('Ocurrió un error inesperado', 'error');
    }
  }
}
