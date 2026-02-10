import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

declare const google: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  fullName = '';
  email = '';
  password = '';
  password1 = '';

  submitting = false;

  notification = { visible: false, message: '', type: '' };
  private notificationTimeout: any;

  constructor(
    private router: Router,
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

  private showNotification(
    message: string,
    type: 'info' | 'success' | 'error' = 'info',
    duration = 3000
  ) {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.visible = true;
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => (this.notification.visible = false), duration);
  }

  private isStrongPassword(p: string): boolean {
    return p.length >= 6;
  }

  async register(form: NgForm) {
    // Note: Email/password registration is removed. 
    // Use Google Sign-In or implement backend endpoint for email/password registration
    this.showNotification('Por favor usa Google Sign-In para registrarte', 'info');
  }

  async loginWithGoogle() {
    if (this.submitting) return;
    this.submitting = true;

    try {
      if (typeof google !== 'undefined') {
        google.accounts.id.prompt();
      } else {
        this.showNotification('Google Sign-In no está disponible', 'error');
      }
    } catch (e) {
      console.error('Error login Google en register:', e);
      this.showNotification('Ocurrió un error con Google', 'error');
    } finally {
      this.submitting = false;
    }
  }

  private async handleGoogleResponse(response: any) {
    this.ngZone.run(async () => {
      try {
        const user = await this.authService.loginWithGoogle(response.credential);
        
        this.showNotification('Inicio de sesión exitoso', 'success');
        await this.router.navigate(['/home']);
      } catch (e) {
        console.error('Error login Google:', e);
        this.showNotification('Ocurrió un error con Google', 'error');
      }
    });
  }
}
