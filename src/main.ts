import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeApp } from 'firebase/app';



// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAowoaYA8HiDgtoYGSrAWNzRVecEq8hilw",
  authDomain: "portafolio-ramon-serrano.firebaseapp.com",
  projectId: "portafolio-ramon-serrano",
  storageBucket: "portafolio-ramon-serrano.firebasestorage.app",
  messagingSenderId: "1046585243904",
  appId: "1:1046585243904:web:85aef0b784358846cc1be5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
