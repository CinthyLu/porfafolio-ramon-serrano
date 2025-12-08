import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';



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

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => app),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())

    
  ]
};
