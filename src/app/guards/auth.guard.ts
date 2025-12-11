import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    // Esperar a que onAuthStateChanged haya corrido y el perfil (si existe) haya cargado
    await this.auth.waitUntilReady();

    const user = this.auth.currentUser;

    if (!user) {
      // Guardamos la ruta destino (usa route.routeConfig?.path si lo usas)
      const redirectTo = route.routeConfig?.path ? '/' + route.routeConfig!.path : '/';
      this.router.navigate(['/login'], {
        queryParams: { redirectTo }
      });
      return false;
    }

    return true;
  }
}
