import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


@Component({
  selector: 'app-login',
  imports: [RouterLink, NgIf, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  PopUpsComponent: any;
  ConfirmDialogsComponent: any;
  notification = {
    visible: false,
    message: '',
    type: '' // 'success', 'error', 'info'
  };
  private notificationTimeout: any;


constructor(private router: Router)
 {

}

  private showNotification(message: string, type: string = 'info', duration: number = 3000) {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.visible = true;
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => {
      this.notification.visible = false;
    }, duration);
  }

  loginWithGoogle() {
   const provider = new GoogleAuthProvider();
  const auth = getAuth();

    //de firebase docs
    signInWithPopup(auth, provider)
  .then((result) => {
    this.showNotification('Inicio de sesión exitoso', 'success');
    this.router.navigate(['/main']);

  }).catch((error) => {
    this.showNotification('Ocurrió un error inesperado', 'error');
  });
}

desplegarExito(){
    this.showNotification('Inicio de sesión exitoso', 'success');
  }

  desplegarError(){
    this.showNotification('Ocurrió un error inesperado', 'error');
  }

  desplegarConfirmacion(){
    this.showNotification('¿Estás seguro de cerrar sesión?', 'info', 4000);
  }

}