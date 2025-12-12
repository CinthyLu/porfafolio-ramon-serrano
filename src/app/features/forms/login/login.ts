import { Component } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { AuthService } from '../../../services/auth.service';
import { Role } from '../../../models/role.enum';

@Component({
  selector: 'app-login',
  imports: [RouterLink, NgIf, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  notification = {
    visible: false,
    message: '',
    type: '' // success | error | info
  };
  private notificationTimeout: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  private showNotification(message: string, type: string = 'info', duration: number = 3000) {
    this.notification.message = message;
    this.notification.type = type;
    this.notification.visible = true;
    clearTimeout(this.notificationTimeout);
    this.notificationTimeout = setTimeout(() => {
      this.notification.visible = false;
    }, duration);
  }

  async loginWithGoogle() {
    console.log('[login] loginWithGoogle() iniciar');
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      console.log('[login] signInWithPopup -> success, result:', result);


      this.authService.currentUser = {
         id: result.user.uid,
         email: result.user.email || '',
         fullName: result.user.displayName || 'Usuario',
         role: Role.User,
         photoUrl: result.user.photoURL || '',
         contacts: undefined,
         createdAt: new Date().toISOString(),
       }

       
      const usuario:any =await this.authService.getUser() // de firestore
      
      console.log('------:', usuario.role);

      let Rol: Role;

      if(usuario.role == 'Admin'){
        Rol = Role.Admin
      }else if(usuario.role == 'Programmer'){
        Rol = Role.Programmer
      }else {
        Rol = Role.User
      }

      this.authService.currentUser = {
         id: result.user.uid,
         email: result.user.email || '',
         fullName: result.user.displayName || 'Usuario',
         role: Rol,
         photoUrl: result.user.photoURL || '',
         contacts: undefined,
         createdAt: new Date().toISOString(),
       }
      console.log('Usuario obtenido de Firestore:', this.authService.currentUser);

      
      this.showNotification('Inicio de sesión exitoso', 'success');

      // leer redirectTo y normalizar
      const redirectToRaw = this.route.snapshot.queryParamMap.get('redirectTo') || '/';
      const redirectTo = decodeURIComponent(redirectToRaw);
      const path = redirectTo.startsWith('/') ? redirectTo : '/' + redirectTo;
      console.log('[login] redirectTo param =', redirectTo);

      // ---> ESPERAMOS hasta que AuthService confirme que firebase+perfil están listos
      console.log('[login] esperando authService.waitUntilReady()...');
       // actualizar currentUser

       
      await this.authService.waitUntilReady();
      console.log('[login] authService listo, currentUser =', this.authService.currentUser);

      // ahora sí navegamos
     await this.router.navigateByUrl(path);
     console.log('[login] navegación completada a', path);

    } catch (error) {
      console.error('[login] signInWithPopup error', error);
      this.showNotification('Ocurrió un error inesperado', 'error');
    }
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
