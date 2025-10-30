"use client";

import { cn } from '@/lib/utils';
import type React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Section({ id, title, description, children, className, ...props }: SectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <section id={id} className={cn('py-20 md:py-28 overflow-hidden', className)} {...props}>
      <div className="container max-w-screen-xl mx-auto">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={variants}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        >
          <h2 className="text-4xl md:text-6xl font-black font-headline text-primary tracking-tight uppercase">{title}</h2>
          {description && <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
