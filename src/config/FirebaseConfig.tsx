import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'rezerve-develop.firebaseapp.com',
  databaseURL: 'https://rezerve-develop.firebaseio.com/',
  projectId: 'rezerve-develop',
  storageBucket: 'rezerve-develop.appspot.com',
  messagingSenderId: '425070059413',
  appId: '1:425070059413:web:d88eb9ea40cdd7d595a09c',
  measurementId: 'G-CRN3J3ZPFW',
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
