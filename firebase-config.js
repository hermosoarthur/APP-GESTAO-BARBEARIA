import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDYMq6Sl_l6wxbKDmg5U_iTKbn878FL37w",
  authDomain: "app-gestao-barbearia.firebaseapp.com",
  projectId: "app-gestao-barbearia",
  storageBucket: "app-gestao-barbearia.firebasestorage.app",
  messagingSenderId: "519136973849",
  appId: "1:519136973849:web:a49792466b3456d90e4688"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export default app;