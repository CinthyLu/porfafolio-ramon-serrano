import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import { db } from '../../../../main';


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

 async register() {
    console.log("Registering user:", this.fullName, this.email);
    try {
  
      if (this.password !== this.password1) {
        console.error("Passwor Incorrect");
      }

      const docRef = await setDoc(doc(db, "users", this.email), {
    fullName: this.fullName,
    email: this.email,
    password: this.password,
    
  });
  console.log("Document written with ID: ", docRef);
} catch (e) {
  console.error("Error adding document: ", e);
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


