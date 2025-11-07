"use client";

import { useForm, ValidationError } from '@formspree/react';
import { Section } from "./section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Send, Star, Loader2 } from "lucide-react";

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
  const [state, handleSubmit] = useForm("xqagrrgr");

  if (state.succeeded) {
      return <p>¡Gracias por contactarme!</p>;
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
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" name="email" />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                  />
                </div>
                <div className="space-y-2">
                  <textarea id="message" name="message" className="w-full border rounded p-2" rows={5}></textarea>
                  <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                  />
                </div>
                <Button type="submit" disabled={state.submitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {state.submitting ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}