import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyAdNnvXaZa0HwngeVDeteie1AdZ2Z_kWj0",
    authDomain: "nextbean-b48cc.firebaseapp.com",
    projectId: "nextbean-b48cc",
    storageBucket: "nextbean-b48cc.appspot.com",
    messagingSenderId: "67582145601",
    appId: "1:67582145601:web:fc869af3c340626a3fc2c0",
    measurementId: "G-WCCPVJ257K"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);