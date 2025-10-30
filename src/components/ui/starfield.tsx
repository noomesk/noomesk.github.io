'use client';
import React, { useRef, useEffect, useState } from 'react';
import { MotionValue } from 'framer-motion';

interface StarfieldProps {
  speedFactor?: number;
  starColor?: [number, number, number];
  starCount?: number;
  zoom?: MotionValue<number>;
}

export function Starfield({
  speedFactor = 0.05,
  starColor = [255, 255, 255],
  starCount = 5000,
  zoom,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{
      x: number;
      y: number;
      z: number;
  }[]>([]);
  const [bgColor, setBgColor] = useState('hsl(222.2 84% 4.9%)');
  const [currentZoom, setCurrentZoom] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const hslColor = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
        if (hslColor) {
            const [h, s, l] = hslColor.split(' ').map(parseFloat);
            setBgColor(`hsl(${h}, ${s}%, ${l}%)`);
        }
    }
  }, []);
  
  useEffect(() => {
    if (zoom) {
      return zoom.on("change", (latest) => {
        setCurrentZoom(latest);
      });
    }
  }, [zoom]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setupStars = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      starsRef.current = [];
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * width - width / 2,
          y: Math.random() * height - height / 2,
          z: Math.random() * width,
        });
      }
    };
    
    setupStars();
    const handleResize = () => setupStars();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [starCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawStars = () => {
      const width = canvas.width;
      const height = canvas.height;
      const stars = starsRef.current;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(currentZoom, currentZoom);
      
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.z -= speedFactor;

        if (star.z <= 0) {
          star.z = width;
        }

        const k = 128.0 / star.z;
        const px = star.x * k;
        const py = star.y * k;

        const size = ((1 - star.z / width) * 2);
        const shade = parseInt(((1 - star.z / width) * 255).toString());
        const color = `rgba(${starColor[0]}, ${starColor[1]}, ${starColor[2]}, ${shade / 255})`;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    let animationFrameId: number;

    const animate = () => {
      drawStars();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [speedFactor, starColor, bgColor, currentZoom]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
