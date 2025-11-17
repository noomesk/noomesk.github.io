"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Section } from './section';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { Starfield } from '../ui/starfield';

// --- CAMBIO 1: He actualizado la información del primer proyecto para que sea EndModa ---
const projects = [
  {
    id: 'project-1', // Ete es el mismo id, lo dejé asi al final para que la lógica de imagen funcione eeeeej
    title: 'EndModa',
    description: 'Tienda de moda online desarrollada con Next.js y Tailwind CSS. Explora colecciones, visualiza productos dinámicamente y disfruta de una experiencia de compra moderna y fluida.',
    tags: ['Next.js', 'Tailwind CSS', 'React', 'Netlify'],
    // --- CAMBIO 2: He añadido los enlaces específicos para este proyecto :3 netlify y github  ---
    githubUrl: 'https://github.com/noomesk/Endmoda',
    liveUrl: 'https://endmoda.netlify.app',
  },
  {
    id: 'project-4',
    title: 'Portal de Ciberseguridad',
    description: 'Una plataforma educativa para aprender sobre ciberseguridad, con tutoriales interactivos, retos de CTF y análisis de vulnerabilidades.',
    tags: ['Python', 'Django', 'Docker', 'React'],
  },
  {
    id: 'project-5',
    title: 'Análisis Bioinformático',
    description: 'Una aplicación web para el análisis de secuencias genómicas, que ofrece herramientas de alineación, visualización de filogenia y modelado de proteínas.',
    tags: ['Python', 'Biopython', 'Flask', 'D3.js'],
  },
];

// --- CAMBIO 3: He modificado ProjectCard para que use la imagen específica (oublic/images) y los enlaces ---
const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
    // Lógica para la imagen: si es EndModa, usa la nuestra. Si no, usa el placeholder.
    const isEndModa = project.id === 'project-1';
    const imageSrc = isEndModa ? '/images/endmoda-showcase.png' : (PlaceHolderImages.find(img => img.id === project.id)?.imageUrl || '');

    return (
    <Card className="flex flex-col overflow-hidden bg-card h-full w-full">
      <CardHeader className="p-0 relative aspect-video">
        <Image
          src={imageSrc}
          alt={`Vista previa de ${project.title}`}
          fill
          className="object-cover"
        />
      </CardHeader>
        <>
          <CardContent className="flex-grow pt-6">
            <CardTitle className="font-headline text-xl mb-2 uppercase">{project.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <CardDescription>{project.description}</CardDescription>
          </CardContent>
            <CardFooter className="gap-2 mt-auto">
                {/* --- CAMBIO 4: Los enlaces ahora son dinámicos o tienen un fallback --- */}
                <Button asChild className="w-full" variant="outline">
                <Link href={project.githubUrl || "https://github.com/noomesk"} target="_blank">
                    <Github className="mr-2" /> GitHub
                </Link>
                </Button>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href={project.liveUrl || "#"} target="_blank">
                    <ExternalLink className="mr-2" /> Demo en Vivo
                </Link>
                </Button>
            </CardFooter>
        </>
    </Card>
);
};


const ZoomEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 15]);
  
  return (
    <div ref={containerRef} className="h-[200vh] relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ scale }} className="h-full w-full relative">
           <Starfield zoom={scale} />
        </motion.div>
      </div>
    </div>
  );
};


export function ProjectsSection() {
  // Ya no se requiere filtrar las imágenes de placeholder, ya que ahora se manejan en el componente MUAJAJ 
  return (
    <>
      <ZoomEffect />
      <Section
        id="projects"
        title="Proyectos Destacados"
        description="Aquí hay algunos de los proyectos de los que estoy orgullosa. Cada uno fue un desafío único y una gran experiencia de aprendizaje."
        className="relative z-10 bg-background"
      >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className={cn("animated-section-element")}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.2, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
                >
                  <ProjectCard project={project} />
                </motion.div>
            ))}
          </div>
      </Section>
    </>
  );
}