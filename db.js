//Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyASfQQcM4LARaZi4A9wnEmdDxCbADxAtI4",
    authDomain: "overloard-space-invaders.firebaseapp.com",
    databaseURL: "https://overloard-space-invaders-default-rtdb.firebaseio.com",
    projectId: "overloard-space-invaders",
    storageBucket: "overloard-space-invaders.appspot.com",
    messagingSenderId: "909242986807",
    appId: "1:909242986807:web:511ad9ba4c59f8f099aab2",
    measurementId: "G-D8413SC6PK"
};

//Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

//Export the necessary references or functions
export { database, ref, push, set };
