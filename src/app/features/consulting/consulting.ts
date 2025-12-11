import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-consulting',
  imports: [],
  templateUrl: './consulting.html',
  styleUrl: './consulting.scss',
})
export class Consulting {

  constructor(private router: Router, private auth: AuthService) {}

  async contactar() {
    try {
      // Si tu AuthService tiene waitUntilReady(), úsalo para asegurarnos que auth+profile se cargaron
      if ((this.auth as any).waitUntilReady) {
        await (this.auth as any).waitUntilReady();
      } else {
        // fallback: esperar el primer valor (puede ser null)
        await firstValueFrom(this.auth.user$);
      }

      const user = this.auth.currentUser;

      if (user) {
        // Usuario logueado → ir directo a agendar
        await this.router.navigateByUrl('/consulting/schedule');
      } else {
        // No logueado → mandar a login con redirectTo para regresar después
        await this.router.navigate(['/login'], {
          queryParams: { redirectTo: '/consulting/schedule' }
        });
      }
    } catch (err) {
      console.error('Error al comprobar auth o navegar:', err);
      // en caso de error, mandamos a login igualmente
      await this.router.navigate(['/login'], {
        queryParams: { redirectTo: '/consulting/schedule' }
      });
    }
  }
}
