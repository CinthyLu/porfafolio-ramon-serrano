import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-consulting',
  templateUrl: './consulting.html',
  styleUrls: ['./consulting.scss'],
})
export class Consulting {

  constructor(private router: Router, private auth: AuthService, private seoService: SeoService) {
    this.seoService.setSeoData(
      'Consultoría - Portafolio Ramón Serrano',
      'Servicios de consultoría en desarrollo de software y tecnología.',
      'Consultoría, Software, Tecnología, Asesoría, Ramón Serrano'
    );
  }

  async contactar() {
    console.log('[consultar] iniciar contactar()');

    try {
      // Esperamos a que Firebase termine su primer estado
      console.log('[consultar] esperando auth.waitUntilReady()...');
      await this.auth.waitUntilReady();
      console.log('[consultar] auth listo');

      const user = this.auth.currentUser;
      console.log('[consultar] usuario actual =', user);

      if (user) {
        console.log('[consultar] usuario logueado → ir a /consulting/schedule');
        await this.router.navigateByUrl('/consulting/schedule');
      } else {
        console.log('[consultar] usuario NO logueado → redirigir a login');
        await this.router.navigate(['/login'], {
          queryParams: { redirectTo: '/consulting/schedule' }
        });
      }

    } catch (err) {
      console.error('[consultar] error en contactar():', err);

      await this.router.navigate(['/login'], {
        queryParams: { redirectTo: '/consulting/schedule' }
      });
    }
  }
}
