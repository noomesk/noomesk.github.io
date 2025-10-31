import { cert, getApps, initializeApp, getApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

type AdminInstances = {
  firestore: Firestore;
};

let adminInstances: AdminInstances | null = null;

export function initializeFirebaseAdmin(): AdminInstances {
  if (adminInstances) return adminInstances;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin environment variables');
  }

  // Vercel almacena keys con \n escapadas; las normalizamos
  privateKey = privateKey.replace(/\\n/g, '\n');

  const app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

  const firestore = getFirestore(app);
  adminInstances = { firestore };
  return adminInstances;
}


