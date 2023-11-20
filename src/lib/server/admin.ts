import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } from '$env/static/private';
import pkg, { firestore } from 'firebase-admin';

try {
  pkg.initializeApp({
    credential: pkg.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY,
    }),
  });
} catch (err: any) {
  if (!/already exists/u.test(err.message)) {
    console.error('Firebase admin initialization error', err.stack)
  }
}

export const adminDB = firestore();
export const adminAuth = getAuth();
