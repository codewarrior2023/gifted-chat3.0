import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAtxMfxqm2XDek0yRP7_thCyp-XGYBXzXM",
  authDomain: "chat-app-2d69e.firebaseapp.com",
  projectId: "chat-app-2d69e",
  storageBucket: "chat-app-2d69e.appspot.com",
  messagingSenderId: "495141497454",
  appId: "1:495141497454:web:b61f1053b401d8b8a4147f"
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();