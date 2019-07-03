import firebase from 'firebase'
import 'firebase/auth';
import 'firebase/storage';


var config = {
    apiKey: "AIzaSyCFfRYtx89sfLBxh5ZDAQRyoVw4DgM6hKQ",
    authDomain: "contacts11.firebaseapp.com",
    databaseURL: "https://contacts11.firebaseio.com",
    projectId: "contacts11",
    storageBucket: "contacts11.appspot.com",
    messagingSenderId: "456457548730",
    appId: "1:456457548730:web:b5f5786fb901d223"
};


// var fire = firebase.initializeApp(config);

class Fire {
    constructor() {
        firebase.initializeApp(config);

        this.auth = firebase.auth();
        this.db = firebase.database();
        this.storage = firebase.storage();
    }



    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');


    contact = uid => this.db.ref(`contacts/${uid}`);


    contacts = () => this.db.ref('contacts');


    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);


    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        console.log('user has been authenticated')
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            emailVerified: authUser.emailVerified,
                            providerData: authUser.providerData,
                        };

                        next(authUser);
                    });
            } else {
                fallback();
            }
        });




}


export default Fire;