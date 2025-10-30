"use client";

import { useState, useEffect, useRef } from 'react';

type UseScrambleProps = {
  text: string;
  scrambleSpeed?: number;
  revealSpeed?: number;
  revealDelay?: number;
  scrambleCharacters?: string;
  playOnMount?: boolean;
};

export function useScramble({
  text,
  scrambleSpeed = 1,
  revealSpeed = 100,
  revealDelay = 0,
  scrambleCharacters = '*+%/§$#?',
  playOnMount = true,
}: UseScrambleProps) {
  const [scrambledText, setScrambledText] = useState(text);
  const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const revealIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const revealedCharacters = useRef<number[]>([]);

  const play = () => {
    stop();
    revealedCharacters.current = [];
    setScrambledText(
      text
        .split('')
        .map(() => scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)])
        .join('')
    );

    scrambleIntervalRef.current = setInterval(() => {
      setScrambledText((prev) =>
        prev
          .split('')
          .map((char, index) => {
            if (revealedCharacters.current.includes(index)) {
              return text[index];
            }
            return scrambleCharacters[Math.floor(Math.random() * scrambleCharacters.length)];
          })
          .join('')
      );
    }, scrambleSpeed);

    revealIntervalRef.current = setInterval(() => {
      const unrevealed = text
        .split('')
        .map((_, i) => i)
        .filter((i) => !revealedCharacters.current.includes(i));
      
      if (unrevealed.length === 0) {
        stop();
        setScrambledText(text);
        return;
      }
      
      const randomIndex = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      revealedCharacters.current.push(randomIndex);

    }, revealSpeed);
  };

  const stop = () => {
    if (scrambleIntervalRef.current) {
      clearInterval(scrambleIntervalRef.current);
    }
    if (revealIntervalRef.current) {
      clearInterval(revealIntervalRef.current);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (playOnMount) {
        play();
      }
    }, revealDelay);

    return () => {
      clearTimeout(timeoutId);
      stop();
    };
  }, [text]);

  return { scrambledText, play };
}
