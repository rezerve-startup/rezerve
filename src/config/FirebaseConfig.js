import app from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCWPWJ59aphpRf_EkMZfT9JGEWXm69rexg",
    authDomain: "rezerve-develop.firebaseapp.com",
    databaseURL: "https://rezerve-develop.firebaseio.com/",
    projectId: "rezerve-develop",
    storageBucket: "rezerve-develop.appspot.com",
    messagingSenderId: "425070059413",
    appId: "1:425070059413:web:d88eb9ea40cdd7d595a09c",
    measurementId: "G-CRN3J3ZPFW"
};

app.initializeApp(firebaseConfig);

export const firestore = app.firestore();