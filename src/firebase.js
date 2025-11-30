import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
	// PASTE YOUR CONFIG FROM STEP 1 HERE
	apiKey: 'AIzaSyB1bJ8_ZqezVsmkew42G-ug63ccZ0GB9NM',
	authDomain: 'depin-9c8d7.firebaseapp.com',
	projectId: 'depin-9c8d7',
	storageBucket: 'depin-9c8d7.firebasestorage.app',
	messagingSenderId: '124563033362',
	appId: '1:124563033362:web:3ff63103194cad099677cb',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const login = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
