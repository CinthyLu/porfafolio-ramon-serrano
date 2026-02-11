import { Injectable } from '@angular/core';

const KEY = 'portfolio_jwt';

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
  }
}