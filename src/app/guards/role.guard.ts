import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    // Esperar a que auth esté listo antes de verificar roles
    await this.auth.waitUntilReady();

    const allowed = route.data['roles'] as Role[] | Role | undefined;
    if (!allowed) return true;

    const ok = this.auth.hasRole(allowed as any);
    if (!ok) {
      this.router.navigate(['/']);
    }
    return ok;
  }
}
