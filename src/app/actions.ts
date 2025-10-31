'use server';

import { initializeFirebaseAdmin } from "@/firebase/server";
import { Timestamp } from 'firebase-admin/firestore';
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Dirección de email inválida."),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres."),
});

export async function saveContactSubmission(data: z.infer<typeof contactSchema>) {
  const validatedFields = contactSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("Invalid data provided.");
  }
  
  try {
    const { firestore } = initializeFirebaseAdmin();
    await firestore.collection('contact-submissions').add({
      ...validatedFields.data,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error saving contact submission to Firebase:", error);
    // Re-throw the error to be caught by the calling function in the component
    throw new Error("Could not save submission.");
  }
}
