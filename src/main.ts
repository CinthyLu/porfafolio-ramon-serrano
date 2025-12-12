import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAowoaYA8HiDgtoYGSrAWNzRVecEq8hilw",
  authDomain: "portafolio-ramon-serrano.firebaseapp.com",
  projectId: "portafolio-ramon-serrano",
  storageBucket: "portafolio-ramon-serrano.firebasestorage.app",
  messagingSenderId: "1046585243904",
  appId: "1:1046585243904:web:85aef0b784358846cc1be5"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);

// 🔥 ESTE FALTABA 🔥
export const auth = getAuth(app);

// Firestore / Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Bootstrap Angular
bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));
