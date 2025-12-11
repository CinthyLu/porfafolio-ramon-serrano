import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/role.enum';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const allowed = route.data['roles'] as Role[] | Role | undefined;
    if (!allowed) return true;
    const ok = this.auth.hasRole(allowed as any);
    if (!ok) {
      this.router.navigate(['/']);
    }
    return ok;
  }
}
