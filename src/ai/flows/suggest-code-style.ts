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
Tu tarea es analizar el código de usuario que te proporcionarán y devolver un objeto JSON con dos claves: "styledCodeSnippet" y "explanation".
- "styledCodeSnippet": El código original, pero refactorizado para seguir las mejores prácticas de ${designSystem}. Mantén toda la funcionalidad del componente original, pero mejora su estructura y estilo.
- "explanation": Una explicación detallada en español de los cambios realizados. Describe cada cambio importante y por qué se hizo.

Ejemplo de la respuesta exacta que debes dar:
{
  "styledCodeSnippet": "function MiComponente() { return <div className='p-4'>Hola</div>; }",
  "explanation": "Se usó la clase 'p-4' de Tailwind para añadir padding. Esta clase aplica un relleno de 1 unidad en todos los lados del elemento, lo que mejora la distribución del contenido."
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

    // Lógica de parseo mejorada
    let parsedResponse;
    try {
      // Intentamos extraer el JSON de la respuesta
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No se encontró un objeto JSON válido en la respuesta");
      }
      
      let jsonString = jsonMatch[0];
      
      // Reemplazamos los saltos de línea dentro de los valores del JSON
      jsonString = jsonString.replace(/"([^"]*)"/g, (match, p1) => {
        return '"' + p1.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
      });
      
      try {
        parsedResponse = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Error al parsear el JSON:", parseError);
        console.error("JSON saneado que falló:", jsonString);
        throw new Error("La IA devolvió una respuesta que no es un JSON válido.");
      }
    } catch (error) {
      console.error("Error general en suggestCodeStyle:", error);
      
      if (error instanceof Error) {
        throw new Error(`Fallo al obtener sugerencias de IA: ${error.message}`);
      }
      
      throw new Error("Ocurrió un error desconocido al procesar tu solicitud.");
    }
    
    // Validamos que el objeto tenga las propiedades esperadas
    if (!parsedResponse || typeof parsedResponse.styledCodeSnippet !== 'string' || typeof parsedResponse.explanation !== 'string') {
      console.error("El JSON no tiene el formato esperado. Objeto recibido:", parsedResponse);
      throw new Error("La respuesta de la IA no contiene los campos esperados.");
    }

    // Devolvemos el objeto validado
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