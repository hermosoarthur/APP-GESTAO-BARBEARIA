import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDYMq6Sl_l6wxbKDmg5U_iTKbn878FL37w",
  authDomain: "app-gestao-barbearia.firebaseapp.com",
  projectId: "app-gestao-barbearia",
  storageBucket: "app-gestao-barbearia.firebasestorage.app",
  messagingSenderId: "519136973849",
  appId: "1:519136973849:web:a49792466b3456d90e4688",
  databaseURL: "https://app-gestao-barbearia-default-rtdb.firebaseio.com" // ADICIONE ESTA LINHA
};

const app = initializeApp(firebaseConfig);

// Configurar Auth com AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getDatabase(app);
export default app;