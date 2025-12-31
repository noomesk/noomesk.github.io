"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Section } from './section';
import { Badge } from '@/components/ui/badge';
// No necesitas PlaceHolderImages si defines la imagen en cada proyecto
// import { PlaceHolderImages } from '@/lib/placeholder-images'; 
import { Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const projects = [
    {
        id: 'project-1',
        title: 'EndModa',
        description: 'Frontend de tienda de moda online desarrollada con Next.js y Tailwind CSS. Explora colecciones, visualiza productos dinámicamente y disfruta de una experiencia de compra moderna y fluida.',
        tags: ['Next.js', 'Tailwind CSS', 'React', 'Netlify'],
        image: '/images/endmoda-showcase.png',
        githubUrl: 'https://github.com/noomesk/Endmoda',
        liveUrl: 'https://endmoda.netlify.app',
    },
    {
        id: 'project-4',
        title: 'Linux Hardening Toolkit',
        description: 'Una suite de automatización de ciberseguridad diseñada para analizar y fortalecer sistemas Linux. Ejuta escaneos de puertos, verifica permisos peligrosos, gestiona servicios y genera reportes de seguridad completos.',
        tags: ['Next.js & React', 'Node.js & Express', 'Python', 'Render & Vercel'],
        image: '/images/linux-hardening-toolkit.png',
        githubUrl: 'https://github.com/noomesk/linux-hardening-toolkit',
        liveUrl: 'https://linux-hardening-toolkit.vercel.app',
    },
    {
        id: 'project-5',
        title: 'Genome Cleaner',
        description: 'Herramienta profesional de bioinformática para validar, limpiar y analizar secuencias genómicas (DNA). Procesa archivos FASTA/FASTQ con detección automática de formato, sanitización de bases inválidas, análisis de contenido GC y generación de reportes completos.',
        tags: ['Python', 'Streamlit', 'Pandas', 'Biopython'],
        image: '/images/genome-cleaner.png',
        githubUrl: 'https://github.com/noomesk/genome-cleaner',
        liveUrl: 'https://genomecleaner.streamlit.app',
        // videoUrl: '/videos/genome-cleaner-demo.mp4', // Descomentar cuando se suba el video
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

    // Usa la imagen del proyecto o una por defecto si no existe.
    const imageSrc = project.image || '/images/placeholder-default.png';

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

// --- COMPONENTE DE ANIMACIÓN ---
const CodePenScrollAnimation = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const h2Ref = useRef<HTMLHeadingElement>(null);
    const ulRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        // 1. Inyectamos el CSS del CodePen directamente
        const styleId = 'codepen-scroll-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                /* <-- CAMBIO CLAVE: Aseguramos posición para el cálculo de scroll */
                html, body {
                    position: relative;
                }

                @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                :root { 
                    --start: 0; 
                    --end: 360; 
                    --lightness: 65%; 
                    --base-chroma: 0.3; 
                }
                
                .scroll-container {
                    position: relative;
                    width: 100%;
                    height: 200vh; /* Reducido drásticamente */
                    z-index: 1; /* Reducido para evitar conflictos */
                }
                
                .sticky-text {
                    position: sticky;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 1;
                    width: 50%; /* Ocupa la mitad izquierda */
                    padding-left: 5rem;
                    padding-right: 5rem; /* Añadimos padding derecho */
                    display: flex;
                    align-items: center;
                    justify-content: flex-end; /* Alineación a la derecha */
                }
                
                .gradient-text {
                    background: linear-gradient(to right, 
                        oklch(var(--lightness) var(--base-chroma) var(--start)), 
                        oklch(var(--lightness) var(--base-chroma) var(--end)));
                    background-clip: text;
                    color: transparent;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .scrolling-list {
                    position: absolute;
                    top: 0;
                    left: 50%; /* Empieza en la mitad */
                    width: 50%; /* Ocupa la mitad derecha */
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    padding-left: 0; /* Quitamos el padding derecho */
                    z-index: 2;
                }
                
                .scrolling-list li {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start; /* Alineación a la izquierda */
                    font-family: 'Geist', sans-serif;
                    font-weight: 600;
                    font-size: clamp(3rem, 8vw, 6rem); /* Tamaño de letra igual al 'you can' */
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    opacity: 0.2;
                }
                
                /* Colores del arcoíris para cada elemento */
                .scrolling-list li:nth-child(1) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 0))); }
                .scrolling-list li:nth-child(2) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 1))); }
                .scrolling-list li:nth-child(3) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 2))); }
                .scrolling-list li:nth-child(4) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 3))); }
                .scrolling-list li:nth-child(5) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 4))); }
                .scrolling-list li:nth-child(6) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 5))); }
                .scrolling-list li:nth-child(7) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 6))); }
                .scrolling-list li:nth-child(8) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 7))); }
                .scrolling-list li:nth-child(9) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 8))); }
                .scrolling-list li:nth-child(10) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 9))); }
                .scrolling-list li:nth-child(11) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 10))); }
                .scrolling-list li:nth-child(12) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 11))); }
                .scrolling-list li:nth-child(13) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 12))); }
                .scrolling-list li:nth-child(14) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 13))); }
                .scrolling-list li:nth-child(15) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 14))); }
                .scrolling-list li:nth-child(16) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 15))); }
                .scrolling-list li:nth-child(17) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 16))); }
                .scrolling-list li:nth-child(18) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 17))); }
                .scrolling-list li:nth-child(19) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 18))); }
                .scrolling-list li:nth-child(20) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 19))); }
                .scrolling-list li:nth-child(21) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 20))); }
                .scrolling-list li:nth-child(22) { color: oklch(var(--lightness) var(--base-chroma) calc(var(--start) + (var(--step) * 21))); }
            `;
            document.head.appendChild(style);
        }

        // 2. Aplicamos la lógica JS del CodePen (fallback de GSAP)
        const supportsScrollTimeline = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');

        if (supportsScrollTimeline) {
            // Para navegadores modernos, usamos CSS puro
            const style = document.createElement('style');
            style.innerHTML = `
                @supports (animation-timeline: scroll()) and (animation-range: 0% 100%) {
                    .scrolling-list li {
                        animation: brighten 1s ease-in-out;
                        animation-timeline: view();
                        animation-range: cover 45% cover 55%;
                    }
                    
                    @keyframes brighten {
                        0%, 100% { 
                            opacity: 0.2; 
                            filter: brightness(1); 
                            transform: scale(1); 
                        }
                        50% { 
                            opacity: 1; 
                            filter: brightness(1.5); 
                            transform: scale(1.1); 
                        }
                    }
                }
            `;
            document.head.appendChild(style);
        } else {
            // Fallback para navegadores antiguos
            import('gsap').then((gsapModule) => {
                const gsap = gsapModule.default;
                import('gsap/dist/ScrollTrigger').then((ScrollTriggerModule) => {
                    const ScrollTrigger = ScrollTriggerModule.default;
                    gsap.registerPlugin(ScrollTrigger);

                    const items = gsap.utils.toArray('.scrolling-list li');

                    // Configuración inicial: todos opacos
                    gsap.set(items, { opacity: 0.2, filter: "brightness(1)" });

                    // Trigger simple para cada palabra
                    items.forEach((item: any) => {
                        ScrollTrigger.create({
                            trigger: item,
                            start: "top 50%",
                            end: "bottom 50%",
                            onEnter: () => {
                                gsap.to(item, {
                                    opacity: 1,
                                    filter: "brightness(1.5)",
                                    scale: 1.1,
                                    duration: 0.3,
                                    ease: "power2.out"
                                });
                            },
                            onLeave: () => {
                                gsap.to(item, {
                                    opacity: 0.2,
                                    filter: "brightness(1)",
                                    scale: 1,
                                    duration: 0.3,
                                    ease: "power2.out"
                                });
                            },
                            onEnterBack: () => {
                                gsap.to(item, {
                                    opacity: 1,
                                    filter: "brightness(1.5)",
                                    scale: 1.1,
                                    duration: 0.3,
                                    ease: "power2.out"
                                });
                            },
                            onLeaveBack: () => {
                                gsap.to(item, {
                                    opacity: 0.2,
                                    filter: "brightness(1)",
                                    scale: 1,
                                    duration: 0.3,
                                    ease: "power2.out"
                                });
                            }
                        });
                    });
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
        <section ref={containerRef} className="scroll-container" style={{ backgroundColor: 'hsl(var(--background))' }}>
            <div className="sticky-text">
                <h2 ref={h2Ref} className="gradient-text" style={{
                    fontFamily: 'Geist, sans-serif',
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    fontWeight: '600',
                    margin: '0',
                    display: 'inline-block'
                }}>
                    <span aria-hidden="true">you can&nbsp;</span>
                    <span className="sr-only">you can ship things.</span>
                </h2>
            </div>
            <ul ref={ulRef} className="scrolling-list" aria-hidden="true" style={{ '--step': 'calc((360 - 0) / (22 - 1))' } as React.CSSProperties}>
                <li style={{ '--i': 0 } as React.CSSProperties}>design.</li>
                <li style={{ '--i': 1 } as React.CSSProperties}>prototype.</li>
                <li style={{ '--i': 2 } as React.CSSProperties}>solve.</li>
                <li style={{ '--i': 3 } as React.CSSProperties}>build.</li>
                <li style={{ '--i': 4 } as React.CSSProperties}>develop.</li>
                <li style={{ '--i': 5 } as React.CSSProperties}>debug.</li>
                <li style={{ '--i': 6 } as React.CSSProperties}>learn.</li>
                <li style={{ '--i': 7 } as React.CSSProperties}>cook.</li>
                <li style={{ '--i': 8 } as React.CSSProperties}>ship.</li>
                <li style={{ '--i': 9 } as React.CSSProperties}>prompt.</li>
                <li style={{ '--i': 10 } as React.CSSProperties}>collaborate.</li>
                <li style={{ '--i': 11 } as React.CSSProperties}>create.</li>
                <li style={{ '--i': 12 } as React.CSSProperties}>inspire.</li>
                <li style={{ '--i': 13 } as React.CSSProperties}>follow.</li>
                <li style={{ '--i': 14 } as React.CSSProperties}>innovate.</li>
                <li style={{ '--i': 15 } as React.CSSProperties}>test.</li>
                <li style={{ '--i': 16 } as React.CSSProperties}>optimize.</li>
                <li style={{ '--i': 17 } as React.CSSProperties}>teach.</li>
                <li style={{ '--i': 18 } as React.CSSProperties}>visualize.</li>
                <li style={{ '--i': 19 } as React.CSSProperties}>transform.</li>
                <li style={{ '--i': 20 } as React.CSSProperties}>scale.</li>
                <li style={{ '--i': 21 } as React.CSSProperties}>do it.</li>
            </ul>
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