import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAowoaYA8HiDgtoYGSrAWNzRVecEq8hilw",
  authDomain: "portafolio-ramon-serrano.firebaseapp.com",
  projectId: "portafolio-ramon-serrano",
  storageBucket: "portafolio-ramon-serrano.firebasestorage.app",
  messagingSenderId: "1046585243904",
  appId: "1:1046585243904:web:85aef0b784358846cc1be5"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
