"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Section } from './section';
import { Code, Brush, ShieldCheck, Dna } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';
import React from 'react';


const skills = [
  { name: 'Desarrollo Web', icon: Code, description: 'Aplicaciones web robustas' },
  { name: 'Diseño UI/UX', icon: Brush, description: 'Interfaces intuitivas y atractivas' },
  { name: 'Ciberseguridad', icon: ShieldCheck, description: 'Protección de sistemas y datos' },
  { name: 'Bioinformática', icon: Dna, description: 'Análisis de datos biológicos' },
];

export function SkillsSection() {
    const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <Section
      id="skills"
      title="Mis Habilidades"
      description="Me especializo en tecnologías modernas para construir aplicaciones asombrosas en diversas áreas."
    >
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {skills.map((skill, index) => (
          <div
            key={skill.name}
            className={cn(
              "animated-section-element",
              isInView && `animate-fade-in-up delay-${index * 100}`
            )}
            >
            <Card className="text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-transparent hover:border-primary bg-card h-full">
                <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <skill.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-lg font-semibold uppercase">{skill.name}</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground text-sm">{skill.description}</p>
                </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </Section>
  );
}
