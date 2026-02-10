import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { provideAuth } from '@angular/fire/auth';

import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { firebaseApp } from './firebase';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideFirebaseApp(() => firebaseApp),
    provideFirestore(() => getFirestore(firebaseApp)),
    provideAuth(() => getAuth(firebaseApp)),
  ]
};
