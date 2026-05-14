import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6UIB_SPRvHuPkmZ8jB2tG1l86Za879zA",
  authDomain: "portfolio-cms-8eda3.firebaseapp.com",
  projectId: "portfolio-cms-8eda3",
  storageBucket: "portfolio-cms-8eda3.firebasestorage.app",
  messagingSenderId: "619396671845",
  appId: "1:619396671845:web:8e0f04e38129dbd83d998c",
  measurementId: "G-L4FG2RC974"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export { signInWithPopup, signOut };