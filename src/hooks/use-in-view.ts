"use client";

import { useState, useEffect, useRef, RefObject } from 'react';

type IntersectionObserverOptions = {
  threshold?: number | number[];
  triggerOnce?: boolean;
};

export function useInView(options?: IntersectionObserverOptions): [RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options?.triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else {
           if (!options?.triggerOnce) {
             setIsInView(false);
           }
        }
      },
      {
        threshold: options?.threshold || 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isInView];
}
