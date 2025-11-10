// src/app/api/suggest-code/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Función para extraer datos de la respuesta de la IA de forma flexible y robusta.
 * En lugar de parsear el JSON, busca las claves y extrae su contenido directamente.
 */
function extractAndRebuildJson(rawResponse: string): { styledCodeSnippet: string; explanation: string } {
    // Función auxiliar para extraer el valor de una clave específica
    const extractValue = (key: string): string => {
        // Busca "clave": `contenido` o "clave": "contenido"
        // El regex captura todo el contenido, incluyendo saltos de línea, hasta la comilla de cierre.
        const regex = new RegExp(`"${key}"\\s*:\\s*(\`|")([\\s\\S]*?)\\1`, 'i');
        const match = rawResponse.match(regex);
        
        if (match && match[2]) {
            // Devuelve el contenido capturado, limpiando espacios en blanco al inicio y al final.
            return match[2].trim();
        }
        
        // Si no se encuentra, lanzamos un error para que se maneje más arriba.
        throw new Error(`No se pudo encontrar la clave "${key}" en la respuesta de la IA.`);
    };

    const styledCodeSnippet = extractValue('styledCodeSnippet');
    const explanation = extractValue('explanation');

    // Devolvemos un objeto JavaScript limpio y seguro.
    return {
        styledCodeSnippet,
        explanation,
    };
}

export async function POST(request: NextRequest) {
  try {
    const { codeSnippet, designSystem } = await request.json();

    if (!codeSnippet || !designSystem) {
      return NextResponse.json(
        { error: 'Faltan el fragmento de código o el sistema de diseño.' },
        { status: 400 }
      );
    }

    // El prompt es bueno, lo mantenemos.
    const systemPrompt = `Eres un experto en React y sistemas de diseño. Tu tarea es analizar un fragmento de código React y reescribirlo para que siga las mejores prácticas de un sistema de diseño específico.

Contexto de los Sistemas de Diseño:
- Tailwind CSS: Utiliza clases de utilidad como 'p-4', 'bg-blue-500', 'flex', 'text-white'. Evita estilos en línea.
- Material-UI (MUI): Utiliza componentes de la librería @mui/material como <Box>, <Container>, <Typography>, <Button>. Usa la prop 'sx' para estilos personalizados.
- Bootstrap: Utiliza clases de Bootstrap como 'container', 'row', 'col', 'btn', 'btn-primary', 'card'.
- Shadcn/UI: Utiliza componentes pre-construidos que combinan Radix UI y Tailwind CSS. Ejemplos: <Button>, <Card>, <Input>.

Reglas de Respuesta:
1.  Analiza el código de entrada y el sistema de diseño seleccionado.
2.  Reescribe el código para que sea funcional y siga las convenciones del sistema de diseño elegido.
3.  Devuelve ÚNICAMENTE un objeto JSON con dos claves: "styledCodeSnippet" y "explanation".
4.  **CRÍTICO:** Los valores para "styledCodeSnippet" y "explanation" deben ser cadenas de texto JSON válidas. Si contienen saltos de línea, deben ser representados con el carácter de escape \\n. **NO USES COMILLAS INVERTIDAS (\`) PARA ENVOLVER EL CÓDIGO.** Envuélvelos en comillas dobles y escapa los caracteres necesarios.
5.  NO USE BLOQUES DE CÓDIGO MARKDOWN (como \`\`\`json). Devuelve el objeto JSON como texto plano.`;

    const userPrompt = `Sistema de diseño: ${designSystem}\n\nCódigo a mejorar:\n\`\`\`tsx\n${codeSnippet}\n\`\`\``;

    const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        max_tokens: 4096,
    });

    const rawResponse = completion.choices[0]?.message?.content;

    if (!rawResponse) {
        throw new Error("No se recibió respuesta de la API de Groq.");
    }

    // --- NUEVA LÓGICA DE PARSEO A PRUEBA DE BALAS ---
    let parsedResponse;
    try {
        // Usamos nuestra nueva función para extraer y reconstruir el objeto.
        // Esto ignora por completo si la IA devolvió JSON válido o no.
        parsedResponse = extractAndRebuildJson(rawResponse);
        console.log("Objeto extraído y reconstruido:", parsedResponse);

    } catch (error) {
        console.error("Error al extraer datos de la respuesta de la IA:", error);
        console.error("Respuesta cruda recibida de la IA:", rawResponse);
        return new Response(JSON.stringify({ 
            error: "La IA devolvió una respuesta con un formato inesperado.",
            details: error instanceof Error ? error.message : String(error),
            rawResponse: rawResponse 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // --- Validación de la Respuesta (La lógica original era buena) ---
    if (!parsedResponse || typeof parsedResponse.styledCodeSnippet !== 'string' || typeof parsedResponse.explanation !== 'string') {
        console.error("El objeto reconstruido no tiene el formato esperado.");
        return new Response(JSON.stringify({ 
            error: "La respuesta de la IA no contiene los campos esperados ('styledCodeSnippet', 'explanation').",
            receivedObject: parsedResponse
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("Error general en suggestCodeStyle:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    return new Response(JSON.stringify({ 
        error: "Fallo al procesar la solicitud.",
        details: errorMessage
    }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}