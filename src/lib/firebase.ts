import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable, readable, derived, type Readable } from "svelte/store";

// This is client side firebase sdk

const firebaseConfig = {
    apiKey: "AIzaSyD1SX4oup7LywLZ1Ibeul1kQ6xMhlimum4",
    authDomain: "agentsfirebase.firebaseapp.com",
    projectId: "agentsfirebase",
    storageBucket: "agentsfirebase.appspot.com",
    messagingSenderId: "991688537119",
    appId: "1:991688537119:web:f80fd5976704a86057112a",
    measurementId: "G-WQCPL2GEFX"
};
  
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

function userStore() {
    let unsubscribe: () => void;

    // the following section is for when the firestore client sdk is not available: aka server 
    // side render
    if (!auth || !globalThis.window) {
        console.warn('Auth is not initialized or not in browser');
        const { subscribe } = writable<User | null>(null);
        return {
            subscribe,
        }
    }

    const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            set(user);
        });

        return () => unsubscribe();
    });

    return {
        subscribe,
    };
}

export const user = userStore();
//returns the user's user's uid, but this method is not good for more complexity
//instead, let's build a reusable store
// export const userData = writable<any>(null);
// user.subscribe((user) => {
//     if (user) {
//         const docRef = doc(db, `users/${user.uid}`);
//         onSnapshot(docRef, (snapshot) => {
//             userData.set(snapshot.data());
//         });
//     }
// });


//Realtime store for any document given a path
export function docStore<T>(
    path: string, 
    // This function takes a string parameter called "path" which represents the path to a document in the Firestore database.
) {
    let unsubscribe: () => void;
    // Declare a variable called "unsubscribe" which is a function that will be used to unsubscribe from the Firestore snapshot listener.
    const docRef = doc(db, path);
    // Create a Firestore document reference using the "db" instance and the provided "path".

    const { subscribe } = writable<T | null>(null, (set) => {
        // Create a Svelte writable store with a generic type parameter "T" and an initial value of null.
        unsubscribe = onSnapshot(docRef, (snapshot) => { 
            // Attach a snapshot listener to the Firestore document reference. This listener will be triggered whenever the document changes.
            set((snapshot.data() as T) ?? null); 
            // Update the value of the writable store with the data from the snapshot. If the data is null, set the value to null.
        });

        return () => unsubscribe(); // Return a cleanup function that will be called when the writable store is unsubscribed. This function will unsubscribe from the Firestore snapshot listener.
    });

    return {
        subscribe, // Return the "subscribe" function of the writable store, allowing components to subscribe to changes in the document data.
        ref: docRef, // Return the Firestore document reference, allowing components to access the reference directly if needed.
        id: docRef.id, // Return the ID of the Firestore document, allowing components to access the ID directly if needed.
    };
}


//interfaces give us a better developer experience
interface UserData {
    username: string;
    bio: string;
    photoURL: string;
    characters: any[]
}

interface Character {
    character_name: string;
    character_class: string;
    character_stats: object;
    character_image_URL: string;
}

//stores can be combined together using a "derived store", 
//in this case, we can make our realtime derived store by combining our auth state and firebase data
export const userData: Readable<UserData | null> = derived(user, ($user, set) => {
    if ($user) {
        return docStore(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null);
    }
})