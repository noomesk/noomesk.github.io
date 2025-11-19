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
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const projects = [
  {
    id: 'project-1',
    title: 'EndModa',
    description: 'Tienda de moda online desarrollada con Next.js y Tailwind CSS. Explora colecciones, visualiza productos dinámicamente y disfruta de una experiencia de compra moderna y fluida.',
    tags: ['Next.js', 'Tailwind CSS', 'React', 'Netlify'],
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

const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;

        if (!card) return;

        gsap.set(card, { transformOrigin: "center center" });

        const hoverAnimation = gsap.to(card, {
            scale: 1.05,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            duration: 0.3,
            ease: "power2.out",
            paused: true
        });

        const handleMouseEnter = () => hoverAnimation.play();
        const handleMouseLeave = () => hoverAnimation.reverse();

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const isEndModa = project.id === 'project-1';
    const imageSrc = isEndModa ? '/images/endmoda-showcase.png' : (PlaceHolderImages.find(img => img.id === project.id)?.imageUrl || '');

    return (
    <Card
        ref={cardRef}
        className="flex flex-col overflow-hidden bg-card h-full w-full cursor-pointer"
    >
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

// --- COMPONENTE DE ANIMACIÓN (COPIADO Y ADAPTADO DEL CODEPEN) ---
const CodePenScrollAnimation = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 1. Inyectamos el CSS del CodePen directamente
        const styleId = 'codepen-scroll-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                :root { --start: 0; --end: 360; --lightness: 65%; --base-chroma: 0.3; }
                ul { --step: calc((var(--end) - var(--start)) / (var(--count) - 1)); }
                li:not(:last-of-type) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * var(--i)))); }
                @supports (animation-timeline: scroll()) and (animation-range: 0% 100%) {
                    li { opacity: 0.2; animation-name: brighten; animation-fill-mode: both; animation-timing-function: linear; animation-range: cover calc(50% - 1lh) calc(50% + 1lh); animation-timeline: view(); }
                    @keyframes brighten { 0% { opacity: var(--start-opacity, 0.2); } 50% { opacity: 1; filter: brightness(var(--brightness, 1.2)); } 100% { opacity: var(--end-opacity, 0.2); } }
                }
            `;
            document.head.appendChild(style);
        }

        // 2. Aplicamos la lógica JS del CodePen (fallback de GSAP)
        const supportsScrollTimeline = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');

        if (!supportsScrollTimeline) {
            import('gsap').then((gsapModule) => {
                const gsap = gsapModule.default;
                import('gsap/dist/ScrollTrigger').then((ScrollTriggerModule) => {
                    const ScrollTrigger = ScrollTriggerModule.default;
                    gsap.registerPlugin(ScrollTrigger);

                    const items = gsap.utils.toArray('.codepen-list li');
                    gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });

                    const dimmer = gsap.timeline().to(items.slice(1), { opacity: 1, stagger: 0.5 }).to(items.slice(0, items.length - 1), { opacity: 0.2, stagger: 0.5 }, 0);
                    ScrollTrigger.create({ trigger: items[0], endTrigger: items[items.length - 1], start: 'center center', end: 'center center', animation: dimmer, scrub: 0.2 });
                });
            });
        }

        // Limpieza
        return () => {
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, []);

    return (
        <section ref={containerRef} style={{ minHeight: '100vh', backgroundColor: 'hsl(var(--background))' }}>
            <div style={{ display: 'flex', lineHeight: '1.25', width: '100%', paddingLeft: '5rem' }}>
                <h2 style={{ fontFamily: 'Geist, sans-serif', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '600', margin: '0', background: 'linear-gradient(to right, oklch(var(--lightness) var(--base-chroma) var(--start)), oklch(var(--lightness) var(--base-chroma) var(--end)))', backgroundClip: 'text', color: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    <span aria-hidden="true">you can&nbsp;</span>
                    <span className="sr-only">you can ship things.</span>
                </h2>
                <ul className="codepen-list" aria-hidden="true" style={{ listStyle: 'none', padding: '0', margin: '0', fontFamily: 'Geist, sans-serif', fontWeight: '600', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'oklch(var(--lightness) var(--base-chroma) var(--start))' }} >
                    <li style={{ '--i': 0 }}>design.</li>
                    <li style={{ '--i': 1 }}>prototype.</li>
                    <li style={{ '--i': 2 }}>solve.</li>
                    <li style={{ '--i': 3 }}>build.</li>
                    <li style={{ '--i': 4 }}>develop.</li>
                    <li style={{ '--i': 5 }}>debug.</li>
                    <li style={{ '--i': 6 }}>learn.</li>
                    <li style={{ '--i': 7 }}>ship.</li>
                    <li style={{ '--i': 8 }}>prompt.</li>
                    <li style={{ '--i': 9 }}>collaborate.</li>
                    <li style={{ '--i': 10 }}>create.</li>
                    <li style={{ '--i': 11 }}>inspire.</li>
                    <li style={{ '--i': 12 }}>follow.</li>
                    <li style={{ '--i': 13 }}>innovate.</li>
                    <li style={{ '--i': 14 }}>test.</li>
                    <li style={{ '--i': 15 }}>optimize.</li>
                    <li style={{ '--i': 16 }}>teach.</li>
                    <li style={{ '--i': 17 }}>visualize.</li>
                    <li style={{ '--i': 18 }}>transform.</li>
                    <li style={{ '--i': 19 }}>scale.</li>
                    <li style={{ '--i': 20 }}>do it.</li>
                </ul>
            </div>
        </section>
    );
};


export function ProjectsSection() {
  return (
    <>
      {/* <-- AQUÍ PONES EL COMPONENTE DE ANIMACIÓN */}
      <CodePenScrollAnimation />
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