import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore"; 
import { db } from '../../../../main';
import { Role } from '../../../models/role.enum';


@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

fullName: string = '';
email: string = '';
password: string = '';
password1: string = '';

  constructor(private router: Router) {}

 async register() {
    console.log("Registering user:", this.fullName, this.email);
    try {
      if (this.password !== this.password1) {
        console.error("Password Incorrect");
        return;
      }

      const auth = getAuth();
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);

      // 2. Guardar perfil en Firestore
      await setDoc(doc(db, "users", this.email), {
        fullName: this.fullName,
        email: this.email,
        role: Role.User,
      });

      // 3. Redirigir a la página de perfil del usuario
      await this.router.navigate(['/portfolio'], { queryParams: { dev: this.email } });
      console.log("Usuario registrado y autenticado:", userCredential.user);

    } catch (e) {
      console.error("Error en registro:", e);
    }
  }

   loginWithGoogle() {
     const provider = new GoogleAuthProvider();
    const auth = getAuth();
  
      //de firebase docs
      signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      this.fullName = user.displayName + "" || '';
      this.email = user.email + "" ||'';
      console.log(user);
      console.log(credential);
      console.log(token);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
 // this.router.navigate(['/main']);
  
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
   
  }
  }


