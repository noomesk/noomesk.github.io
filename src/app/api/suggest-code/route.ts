// src/app/api/suggest-code/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

// 🔒 SEGURO: Usamos la variable de entorno del SERVIDOR (sin NEXT_PUBLIC_)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { codeSnippet, designSystem } = await request.json();

    if (!codeSnippet || !designSystem) {
      return NextResponse.json(
        { error: 'Faltan el fragmento de código o el sistema de diseño.' },
        { status: 400 }
      );
    }

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

    const userPrompt = `Analiza y mejora este código usando ${designSystem}: \`\`\`tsx\n ${codeSnippet}\n\`\`\``;

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
        throw new Error("No se recibió respuesta de la API de Groq.");
    }

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
        
        parsedResponse = JSON.parse(jsonString);
    } catch (error) {
        console.error("Error al parsear el JSON:", error);
        console.error("Respuesta cruda:", rawResponse);
        throw new Error("La IA devolvió una respuesta que no es un JSON válido.");
    }
    
    // Validamos que el objeto tenga las propiedades esperadas
    if (!parsedResponse || typeof parsedResponse.styledCodeSnippet !== 'string' || typeof parsedResponse.explanation !== 'string') {
        console.error("El JSON no tiene el formato esperado. Objeto recibido:", parsedResponse);
        throw new Error("La respuesta de la IA no contiene los campos esperados.");
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("Error general en suggestCodeStyle:", error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Fallo al obtener sugerencias de IA: ${errorMessage}` },
      { status: 500 }
    );
  }
}