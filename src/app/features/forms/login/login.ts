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
        callback: (response: any) => this.handleGoogleResponse(response)
      });
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
    try {
      if (typeof google !== 'undefined') {
        google.accounts.id.prompt();
      } else {
        this.showNotification('Google Sign-In no está disponible', 'error');
      }
    } catch (error) {
      console.error('[login] Error initializing Google Sign-In:', error);
      this.showNotification('Error al iniciar sesión con Google', 'error');
    }
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
