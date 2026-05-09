import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyAzHbzF7okGZfDPfUGHWnlNr6UUborXkrY',
    authDomain: 'lemnos-79d4b.firebaseapp.com',
    projectId: 'lemnos-79d4b',
    storageBucket: 'lemnos-79d4b.firebasestorage.app',
    messagingSenderId: '1059469857481',
    appId: '1:1059469857481:web:acd19976a63c1939e37318',
    measurementId: 'G-LQP4JLB1KD',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();

export { auth, firestore, storage, analytics, googleProvider };
