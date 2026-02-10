import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../models/user.model';
import { Role } from '../models/role.enum';
import {  doc } from "firebase/firestore";


@Injectable({ providedIn: 'root' })
export class AuthService {

  private auth = getAuth();

  /** usuario Firebase crudo (solo UID, email, photo, etc.) */
  private firebaseUser: FirebaseUser | null = null;

  /** perfil de Firestore */
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  /** indica que onAuthStateChanged ya corrió */
  private readySubject = new BehaviorSubject<boolean>(false);
  public ready$ = this.readySubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, async (user) => {
      console.log('[auth] onAuthStateChanged ->', user);

      this.firebaseUser = user;

      if (user?.email) {
        // cargamos perfil desde Firestore
        const profile = await this.loadUserProfileByEmail(user.email);
        this.userSubject.next(profile);
      } else {
        this.userSubject.next(null);
      }

      // primera vez que Firebase responde
      if (!this.readySubject.value) {
        this.readySubject.next(true);
      }
    });

  }

  /** Cargar perfil por email desde Firestore */
  private async loadUserProfileByEmail(email: string): Promise<User | null> {
    try {
      const ref = doc(db, 'users', email);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as User;
        data.id = snap.id;
        return data;
      }

      return null;
    } catch (err) {
      console.error('[auth] Error cargando perfil:', err);
      return null;
    }


  }
  // Crear el perfil en Firestore si no existe (para login con Google)
  async ensureUserProfile(user: FirebaseUser): Promise<User> {
    if (!user.email) {
      throw new Error('El usuario autenticado no tiene email.');
    }

    const email = user.email;
    const ref = doc(db, 'users', email);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as User;
      data.id = snap.id;
      return data;
    }

    const newProfile: User = {
      id: user.uid,
      email,
      fullName: user.displayName || 'Usuario',
      role: Role.User, //
      photoUrl: user.photoURL || '',
      createdAt: new Date().toISOString(),
      contacts: {},
    };

    await setDoc(ref, newProfile);
    return newProfile;
  }
  /** Perfil actual ya mapeado + rol (lo que usas en guards) */
  get currentUser(): User | null {
    return this.userSubject.value;
  }
  set currentUser(user: User | null) {
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const ref = doc(db, 'users', email);
      const snap = await getDoc(ref);

      if (!snap.exists()) return null;

      const data = snap.data() as User;
      data.id = snap.id;
      return data;
    } catch (err) {
      console.error('[auth] getUserByEmail error:', err);
      return null;
    }
  }


  /** Verificar rol */
hasRole(role: string | string[]): boolean {
  const user = this.currentUser;
  if (!user) return false;

  if (Array.isArray(role)) return role.includes(user.role);
  return user.role === role;
}

  /** Cerrar sesión */
  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.userSubject.next(null);
  }

  /** Esperar a que Firebase termine de verificar si hay usuario */
  async waitUntilReady(): Promise<void> {
    if (this.readySubject.value) return;

    return new Promise((resolve) => {
      const sub = this.ready$.subscribe((ready) => {
        if (ready) {
          sub.unsubscribe();
          resolve();
        }
      });
    });
  }
}
