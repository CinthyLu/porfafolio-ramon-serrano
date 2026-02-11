import { Injectable } from '@angular/core';

const KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  set(token: string) {
    localStorage.setItem(KEY, token);
  }

  get(): string | null {
    return localStorage.getItem(KEY);
  }

  clear() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(REFRESH_KEY);
  }

  setRefresh(token: string) {
    localStorage.setItem(REFRESH_KEY, token);
  }

  getRefresh(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }
}