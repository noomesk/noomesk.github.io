"use client";

import { useState } from 'react';
import { suggestCodeStyle, SuggestCodeStyleOutput } from '@/ai/flows/suggest-code-style';
import { Section } from './section';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2, Lightbulb } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function AiAdvisorSection() {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [designSystem, setDesignSystem] = useState('Tailwind CSS');
  const [result, setResult] = useState<SuggestCodeStyleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!codeSnippet.trim()) {
      setError('Por favor, ingresa un fragmento de código.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);
    try {
      const output = await suggestCodeStyle({ codeSnippet, designSystem });
      setResult(output);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al obtener sugerencias. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative z-10">
      <motion.div style={{opacity, scale}}>
        <Section
          id="ai-advisor"
          title="Asesor de Estilo de Código IA"
          description="Pega un fragmento de código y obtén sugerencias impulsadas por IA para alinearlo con sistemas de diseño populares."
          className="bg-background"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Textarea
                      placeholder="Pega el código de tu componente de React aquí..."
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      className="md:col-span-3 h-48 font-code"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <Select value={designSystem} onValueChange={setDesignSystem}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Selecciona un Sistema de Diseño" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tailwind CSS">Tailwind CSS</SelectItem>
                        <SelectItem value="Material UI">Material UI</SelectItem>
                        <SelectItem value="Bootstrap">Bootstrap</SelectItem>
                        <SelectItem value="Shadcn/UI">Shadcn/UI</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analizando...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Obtener Sugerencias
                        </>
                      )}
                    </Button>
                  </div>
                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                </form>

                {isLoading && (
                  <div className="mt-8 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-muted-foreground">La IA está pensando...</p>
                  </div>
                )}

                {result && (
                  <div className="mt-8 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline uppercase">
                          <Wand2 className="text-primary" />
                          Fragmento de Código Estilizado
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                          <code className="font-code text-sm">{result.styledCodeSnippet}</code>
                        </pre>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline uppercase">
                          <Lightbulb className="text-yellow-400" />
                          Explicación
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Section>
      </motion.div>
    </div>
  );
}
