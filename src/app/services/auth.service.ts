import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../main';
import { User } from '../models/user.model';
import { Role } from '../models/role.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentFirebaseUser: FirebaseUser | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  // indica que onAuthStateChanged ya fue invocado al menos 1 vez
  private readySubject = new BehaviorSubject<boolean>(false);
  public ready$ = this.readySubject.asObservable();

  constructor() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (u) => {
      this.currentFirebaseUser = u;

      // cargamos perfil (si existe)
      if (u && u.email) {
        const profile = await this.loadUserProfileByEmail(u.email);
        this.userSubject.next(profile);
      } else {
        this.userSubject.next(null);
      }

      // IMPORTANTE: señalamos que ya terminó el primer onAuthStateChanged
      if (!this.readySubject.value) {
        this.readySubject.next(true);
      }
    });
  }

  async loadUserProfileByEmail(email: string): Promise<User | null> {
    try {
      // Nota: en tu implementación original usabas el email como id del doc.
      // Asegúrate de tener la colección 'users' con doc id = email o cambia:
      const docRef = doc(db, 'users', email);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as User;
        data.id = snap.id;
        return data;
      }
      return null;
    } catch (e) {
      console.error('Error loading user profile', e);
      return null;
    }
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  hasRole(role: Role | Role[]): boolean {
    const user = this.currentUser;
    if (!user) return false;
    if (Array.isArray(role)) return role.includes(user.role);
    return user.role === role;
  }

  async signOut() {
    try {
      const auth = getAuth();
      await auth.signOut();
      this.userSubject.next(null);
    } catch (e) {
      console.error('Error signing out', e);
    }
  }

  // helper para código que necesite esperar a que auth+profile estén listos
  async waitUntilReady(): Promise<void> {
    if (this.readySubject.value) return;
    return new Promise(resolve => {
      const sub = this.ready$.subscribe(v => {
        if (v) {
          sub.unsubscribe();
          resolve();
        }
      });
    });
  }
}
