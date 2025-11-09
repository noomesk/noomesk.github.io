// src/ai/flows/suggest-code-style.ts

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface SuggestCodeStyleInput {
  codeSnippet: string;
  designSystem: string;
}

export interface SuggestCodeStyleOutput {
  styledCodeSnippet: string;
  explanation: string;
}

export async function suggestCodeStyle({ 
  codeSnippet, 
  designSystem 
}: SuggestCodeStyleInput): Promise<SuggestCodeStyleOutput> {
  
  const systemPrompt = `Actúa como un experto en React y el sistema de diseño "${designSystem}".
Tu única tarea es analizar el código de usuario que te proporcionarán y devolver un objeto JSON con dos claves: "styledCodeSnippet" y "explanation".
- "styledCodeSnippet": El código original, pero refactorizado para seguir las mejores prácticas de ${designSystem}.
- "explanation": Una explicación en español de los cambios realizados.

Ejemplo de la respuesta exacta que debes dar:
{
  "styledCodeSnippet": "function MiComponente() { return <div className='p-4'>Hola</div>; }",
  "explanation": "Se usó la clase 'p-4' de Tailwind para añadir padding."
}

No escribas nada más que el objeto JSON. Sin saludos, sin explicaciones, sin bloques de código markdown.`;

  const userPrompt = `Analiza y mejora este código usando ${designSystem}:
\`\`\`tsx
 ${codeSnippet}
\`\`\`

Ahora, responde únicamente con el objeto JSON solicitado.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 4096,
    });

    const rawResponse = completion.choices[0]?.message?.content;
    
    if (!rawResponse) {
      console.error("Error: No se recibió respuesta de la API de Groq.");
      throw new Error("No se recibió respuesta de la API de Groq.");
    }

    console.log("Respuesta cruda de Groq:", rawResponse);

    // --- LÓGICA DE PARSEO CORREGIDA Y SIMPLIFICADA diosss casi ke no---

    let parsedResponse;
    try {
      // Aki se intenta parsear la respuesta directamente.
      // A veces, a pesar de los saltos de línea, el motor JS lo logra, esperemos anshiii.
      parsedResponse = JSON.parse(rawResponse);
    } catch (directParseError) {
      // Si el parseo directo falla, es por los saltos de línea (es lo mas probable).
      // El problema son los saltos de línea DENTRO de los strings del JSON.
      // La solución es reemplazarlos por su representación escapada: \n
      const sanitizedResponse = rawResponse.replace(/\n/g, '\\n');
      
      console.log("Error en parseo directo. Intentando con string saneado.");
      console.log("String saneado:", sanitizedResponse);

      try {
        parsedResponse = JSON.parse(sanitizedResponse);
      } catch (sanitizedParseError) {
        console.error("Error al parsear el JSON incluso después de sanear. Respuesta cruda:", rawResponse);
        console.error("String saneado que falló:", sanitizedResponse);
        throw new Error("La IA devolvió una respuesta que no es un JSON válido.");
      }
    }
    
    // Aqui se valida que el objeto tenga las propiedades esperadas
    if (!parsedResponse || typeof parsedResponse.styledCodeSnippet !== 'string' || typeof parsedResponse.explanation !== 'string') {
      console.error("El JSON no tiene el formato esperado. Objeto recibido:", parsedResponse);
      throw new Error("La respuesta de la IA no contiene los campos esperados.");
    }

    // Se devuelve el objeto validado y chan channnnn ojalá funcioneeeeee xq tengo sueño
    return {
      styledCodeSnippet: parsedResponse.styledCodeSnippet,
      explanation: parsedResponse.explanation
    };

  } catch (error) {
    console.error("Error general en suggestCodeStyle:", error);
    
    if (error instanceof Error) {
      throw new Error(`Fallo al obtener sugerencias de IA: ${error.message}`);
    }
    
    throw new Error("Ocurrió un error desconocido al procesar tu solicitud.");
  }
}