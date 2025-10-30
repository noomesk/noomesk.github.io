"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { useScramble } from '@/hooks/use-scramble';

export function HeroSection() {
  const text = 'Angie Plazas';
  const { scrambledText, play } = useScramble({
    text,
    scrambleSpeed: 0.7,
    revealSpeed: 80,
    revealDelay: 500,
    scrambleCharacters: '!<>-_\\/[]{}—=+*^?#________',
  });
  
  return (
    <section 
      className="relative w-full h-[calc(100vh-3.5rem)] flex items-center justify-center text-center bg-card overflow-hidden"
      onMouseEnter={play}
    >
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto px-4">
        <h1 className="font-headline uppercase text-6xl md:text-8xl font-black tracking-tighter mb-4 text-foreground">
          {scrambledText}
        </h1>
        <p className="font-headline uppercase text-2xl md:text-3xl font-semibold mb-6 text-primary inline-block">
          Desarrolladora de Software
        </p>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in-up delay-200 opacity-0">
          Creando experiencias web cautivadoras, responsivas y centradas en el usuario. Transformando problemas complejos en soluciones digitales elegantes en desarrollo web, ciberseguridad y bioinformática.
        </p>
        <div className="flex justify-center gap-4 animate-fade-in-up delay-300 opacity-0">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30 transition-transform transform hover:scale-105">
            <Link href="#projects">Ver Mis Proyectos</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-semibold shadow-lg transition-transform transform hover:scale-105 hover:bg-primary/10 hover:text-primary">
            <Link href="#contact">
              Ponte en Contacto <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
