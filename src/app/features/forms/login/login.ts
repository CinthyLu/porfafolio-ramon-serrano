import { Component, OnInit, NgZone } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [RouterLink, NgIf, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  notification = { visible: false, message: '', type: '' };
  private notificationTimeout: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: '320854215368-h2jrnsaglbup26ghhik7h5kck64s3hv6.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleResponse(response),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      
      // Renderizar el botón de Google
      const buttonDiv = document.getElementById('googleSignInButton');
      if (buttonDiv) {
        google.accounts.id.renderButton(
          buttonDiv,
          { theme: 'outline', size: 'large', width: 300, text: 'continue_with' }
        );
      }
    }
  }

  private showNotification(message: string, type: string = 'info', duration: number = 3000) {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.visible = true;
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => (this.notification.visible = false), duration);
  }

  async loginWithGoogle() {
    // Este método ya no es necesario, el botón se renderiza automáticamente
    // Pero lo mantenemos por compatibilidad con el HTML
    this.showNotification('Por favor usa el botón de Google', 'info');
  }

  private async handleGoogleResponse(response: any) {
    this.ngZone.run(async () => {
      try {
        const user = await this.authService.loginWithGoogle(response.credential);
        
        this.showNotification('Inicio de sesión exitoso', 'success');

        const redirectToRaw = this.route.snapshot.queryParamMap.get('redirectTo') || '/home';
        const redirectTo = decodeURIComponent(redirectToRaw);
        const path = redirectTo.startsWith('/') ? redirectTo : '/' + redirectTo;

        await this.router.navigateByUrl(path);
      } catch (error) {
        console.error('[login] Google sign-in error', error);
        this.showNotification('Ocurrió un error inesperado', 'error');
      }
    });
  }
}
