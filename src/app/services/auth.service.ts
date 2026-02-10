import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private readySubject = new BehaviorSubject<boolean>(false);
  public ready$ = this.readySubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const user = await firstValueFrom(
          this.http.get<User>(`${this.apiUrl}/auth/me`)
        );
        this.userSubject.next(user);
      } catch (error) {
        console.error('[auth] Error loading user profile:', error);
        await this.tryRefreshToken();
      }
    }
    this.readySubject.next(true);
  }

  async loginWithGoogle(idToken: string): Promise<User> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/auth/google`, { idToken })
    );
    
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    this.userSubject.next(response.user);
    
    return response.user;
  }

  private async tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearAuth();
      return false;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken })
      );
      
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
      this.userSubject.next(response.user);
      
      return true;
    } catch (error) {
      console.error('[auth] Refresh token failed:', error);
      this.clearAuth();
      return false;
    }
  }

  async signOut(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await firstValueFrom(
          this.http.post(`${this.apiUrl}/auth/logout`, { refreshToken })
        );
      } catch (error) {
        console.error('[auth] Logout error:', error);
      }
    }
    this.clearAuth();
  }

  private clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.userSubject.next(null);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  hasRole(role: string | string[]): boolean {
    const user = this.currentUser;
    if (!user) return false;

    if (Array.isArray(role)) return role.includes(user.role);
    return user.role === role;
  }

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

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/users/email/${email}`)
      );
    } catch (error) {
      console.error('[auth] getUserByEmail error:', error);
      return null;
    }
  }
}
