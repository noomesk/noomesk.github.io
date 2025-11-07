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

  // Modo desarrollo: permitir ejecución sin Firebase configurado
  if (!projectId || !clientEmail || !privateKey) {
    console.warn('⚠️ Firebase Admin no configurado. El formulario de contacto no funcionará.');
    console.warn('Para habilitar Firebase, configura las variables de entorno:');
    console.warn('  - FIREBASE_PROJECT_ID');
    console.warn('  - FIREBASE_CLIENT_EMAIL');
    console.warn('  - FIREBASE_PRIVATE_KEY');
    throw new Error('Firebase Admin no configurado. Revisa las variables de entorno.');
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


