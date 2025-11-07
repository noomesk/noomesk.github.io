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
// ¡ANTES USABA LA LIBRERÍA DE FORMSPREE, SHA NO MI CIELA xq me estaba dando dolor de cabeza, espero q este funcione!

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<z.ZodFormattedError<FormData> | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const validatedFields = contactSchema.safeParse(data);

    if (!validatedFields.success) {
      setErrors(validatedFields.error.format());
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Error de Validación",
        description: "Por favor, corrige los errores en el formulario.",
      });
      return;
    }

    try {
        // AQUI Hago llamada manualmente a Formspree JIJIJDISJ diosito q funcione AAAAAAAAAH
        const response = await fetch("https://formspree.io/f/xqagrrgr", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Si la respuesta es "ok" (código 200), ¡éxito!
            toast({
              title: "¡Mensaje Enviado!",
              description: "Gracias por contactarme. Te responderé pronto.",
            });
            formRef.current?.reset();
            setErrors(null);
        } else {
            // Si Formspree devuelve un error (400, 500...)
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al enviar el formulario.");
        }

    } catch (error: any) {
        console.error("Error al enviar el formulario:", error);
        toast({
          variant: "destructive",
          title: "Error al Enviar",
          description: error.message || "No se pudo enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.",
        });
    } finally {
        setLoading(false);
    }
  };


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
                  {errors?.name && <p className="text-sm font-medium text-destructive">{errors.name._errors[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                  {errors?.email && <p className="text-sm font-medium text-destructive">{errors.email._errors[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea id="message" name="message" placeholder="Tu mensaje..." required rows={5} />
                  {errors?.message && <p className="text-sm font-medium text-destructive">{errors.message._errors[0]}</p>}
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {loading ? (
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