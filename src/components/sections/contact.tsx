"use client";

import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Section } from "./section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, Star, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm, ValidationError } from '@formspree/react';

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Dirección de email inválida."),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres."),
});

type FormData = z.infer<typeof contactSchema>;

const MarqueeText = () => {
    const marqueeContent = (
        <>
            <span className="text-4xl font-headline mx-4 uppercase">Hablemos de tu proyecto</span>
            <Star className="inline-block mx-4 h-6 w-6" />
            <span className="text-4xl font-headline mx-4 uppercase">Creemos algo increíble</span>
            <Star className="inline-block mx-4 h-6 w-6" />
            <span className="text-4xl font-headline mx-4 uppercase">Disponible para trabajar</span>
            <Star className="inline-block mx-4 h-6 w-6" />
        </>
    );

    return (
        <div className="relative flex overflow-x-hidden text-primary mb-12 border-y border-primary/20 py-4">
            <div className="flex whitespace-nowrap animate-marquee">
                {marqueeContent}
            </div>
             <div className="flex whitespace-nowrap animate-marquee" aria-hidden="true">
                {marqueeContent}
            </div>
        </div>
    );
};


export function ContactSection() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  // Aki usé el hook de Formspree que SÍ funciona jsjaja 
  const [state, handleSubmit] = useForm("xqagrrgr");

  // Si el envío fue exitoso, c muestra un mensaje de éxito y resetea el formulario
  if (state.succeeded) {
      return (
        <Section
          id="contact"
          title="¡Mensaje Enviado!"
          description="Gracias por contactarme. Te responderé lo antes posible."
        >
          <div className="max-w-xl mx-auto text-center">
             <Button onClick={() => window.location.reload()} className="mt-4">Enviar otro mensaje</Button>
          </div>
        </Section>
      );
  }

  return (
    <Section
      id="contact"
      title="Ponte en Contacto"
      description="¿Tienes un proyecto en mente o simplemente quieres saludar? Me encantaría saber de ti."
    >
        <MarqueeText />
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl uppercase">Contáctame</CardTitle>
            <CardDescription>Completa el formulario a continuación y me pondré en contacto contigo lo antes posible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" placeholder="Tu Nombre" required />
                  <ValidationError 
                    prefix="Nombre" 
                    field="name"
                    errors={state.errors}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea id="message" name="message" placeholder="Tu mensaje..." required rows={5} />
                  <ValidationError 
                    prefix="Mensaje" 
                    field="message"
                    errors={state.errors}
                  />
                </div>
                <Button type="submit" disabled={state.submitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {state.submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Mensaje
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}