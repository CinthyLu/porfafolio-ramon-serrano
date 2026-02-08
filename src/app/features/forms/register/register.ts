import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '../../../../main';
import { Role } from '../../../models/role.enum';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  fullName: string = '';
  email: string = '';
  password: string = '';
  password1: string = '';

  constructor(private router: Router) {}

  async register() {
    try {
      if (!this.fullName.trim() || !this.email.trim() || !this.password) return;

      if (this.password !== this.password1) {
        console.error('Passwords no coinciden');
        return;
      }

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);

      // Crear/Actualizar doc en Firestore
      await setDoc(doc(db, 'users', this.email), {
        fullName: this.fullName.trim(),
        email: this.email.trim(),
        photoUrl: userCredential.user.photoURL || '',
        role: Role.User,
        createdAt: new Date().toISOString(),
        contacts: {},
      }, { merge: true });

      // Redirige solo una vez
      await this.router.navigate(['/home']);
    } catch (e) {
      console.error('Error en registro:', e);
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();

      const result = await signInWithPopup(auth, provider);

      const email = result.user.email || '';
      if (!email) return;

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

      await this.router.navigate(['/home']);
    } catch (e) {
      console.error('Error login Google en register:', e);
    }
  }
}
