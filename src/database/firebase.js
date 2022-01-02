import { initializeApp } from 'firebase/app';

const MyFirebase = () => {
    const firebaseConfig = {
      apiKey: "AIzaSyBHedkyTpyJjeS9oZSSjwO7HMXfOA2zRrw",
      authDomain: "yumyap-a2ca0.firebaseapp.com",
      databaseURL: "https://yumyap-a2ca0-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "yumyap-a2ca0",
      storageBucket: "yumyap-a2ca0.appspot.com",
      messagingSenderId: "259846266404",
      appId: "1:259846266404:web:d63a0d628acb774c2fc2b1",
      measurementId: "G-1KP1HLLXYX"
      };
      
    return initializeApp(firebaseConfig);
}

  export default MyFirebase;