"use client";

import { useEffect } from 'react';

// Este componente inyecta la animación original del CodePen directamente en el DOM
export const OriginalCodePenAnimation = () => {
  useEffect(() => {
    // Verificamos si ya existe para no duplicar en re-renders
    if (document.getElementById('codepen-styles')) {
      return;
    }

    // 1. Inyectamos el CSS esencial directamente en el <head>
    const style = document.createElement('style');
    style.id = 'codepen-styles';
    style.innerHTML = `
      /* --- ESTILOS ESENCIALES DEL CODEPEN (SIMPLIFICADOS) --- */
      .codepen-container {
        position: relative;
        min-height: 100vh;
        width: 100%;
        background-color: hsl(var(--background));
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Geist', sans-serif;
      }

      .codepen-content {
        display: flex;
        width: 100%;
        max-width: 1200px;
        padding: 0 2rem;
      }

      .codepen-content h2 {
        font-size: clamp(3rem, 8vw, 6rem);
        font-weight: 600;
        line-height: 1.1;
        margin: 0;
        color: #444;
        width: 30%;
        text-align: right;
        padding-right: 2rem;
      }

      .codepen-list {
        width: 70%;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        font-weight: 600;
        list-style: none;
        padding: 0;
        margin: 0;
        color: #444;
      }
    `;
    document.head.appendChild(style);

    // 2. Inyectamos el HTML necesario
    const container = document.getElementById('codepen-animation-container');
    if (container) {
      container.innerHTML = `
        <div class="codepen-content">
          <h2><span aria-hidden="true">you can&nbsp;</span><span class="sr-only">you can ship things.</span></h2>
          <ul class="codepen-list" aria-hidden="true">
            <li>design.</li><li>prototype.</li><li>solve.</li><li>build.</li>
            <li>develop.</li><li>debug.</li><li>learn.</li><li>ship.</li>
            <li>prompt.</li><li>collaborate.</li><li>create.</li><li>inspire.</li>
            <li>follow.</li><li>innovate.</li><li>test.</li>
            <li>optimize.</li><li>teach.</li><li>visualize.</li>
            <li>transform.</li><li>scale.</li><li>do it.</li>
          </ul>
        </div>
      `;
    }

    // 3. Implementamos la lógica de animación con GSAP (versión simplificada)
    // Usamos una importación dinámica para evitar problemas de SSR
    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default;
      import('gsap/dist/ScrollTrigger').then((ScrollTriggerModule) => {
        const ScrollTrigger = ScrollTriggerModule.default;
        gsap.registerPlugin(ScrollTrigger);

        const items = gsap.utils.toArray('.codepen-list li');
        const title = gsap.utils.toArray('.codepen-content h2')[0];

        if (!items.length || !title) return;

        // Animación simple de iluminación
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.codepen-container',
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
        });

        tl.to(items, {
          color: '#ffffff',
          stagger: 0.1,
        });
      });
    });

    // Limpieza al desmontar
    return () => {
      const styleElement = document.getElementById('codepen-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // El componente solo renderiza el contenedor vacío
  return <div id="codepen-animation-container"></div>;
};