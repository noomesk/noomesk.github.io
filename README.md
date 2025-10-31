# Firebase Studio

This is a Next.js portfolio.

## Desarrollo

```bash
npm install
npm run dev
```

## Formulario de contacto (Firebase)

El formulario guarda en Firestore (colección `contact-submissions`) desde el servidor con Firebase Admin.

1. Crea un proyecto Firebase y habilita Firestore.
2. Crea una Service Account y descarga la JSON key.
3. Variables de entorno requeridas (configúralas en Vercel → Project Settings → Environment Variables):
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (reemplaza saltos de línea por `\\n`).
4. Redeploy.

El server action `saveContactSubmission` usará estas variables para escribir en Firestore.
