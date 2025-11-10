// src/app/api/suggest-code/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Función para extraer datos de la respuesta de la IA de forma flexible y robusta.
 * En lugar de parsear el JSON, busca las claves y extrae su contenido buscando el final del objeto o la siguiente clave.
 */
function extractAndRebuildJson(rawResponse: string): { styledCodeSnippet: string; explanation: string } {
    // 1. Primero, quitamos el bloque de código markdown si existe.
    const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    let textToAnalyze = jsonMatch ? jsonMatch[1] : rawResponse;

    // 2. Función auxiliar para extraer el valor de una clave específica.
    const extractValue = (key: string): string => {
        // Busca el inicio de la clave, ej: "styledCodeSnippet":
        const keyPattern = new RegExp(`"${key}"\\s*:\\s*`);
        const keyMatch = textToAnalyze.match(keyPattern);

        if (!keyMatch) {
            throw new Error(`No se pudo encontrar la clave "${key}" en la respuesta de la IA.`);
        }

        // El valor empieza justo después de la clave y su delimitador (que puede ser " o `)
        let valueStart = keyMatch.index + keyMatch[0].length;
        let valueEnd = textToAnalyze.length;

        // Busca el inicio de la SIGUIENTE clave para saber dónde termina esta.
        const nextKeyPattern = /",\s*"(?:styledCodeSnippet|explanation)"\s*:/;
        const nextKeyMatch = textToAnalyze.substring(valueStart).search(nextKeyPattern);

        if (nextKeyMatch !== -1) {
            // Si encuentra la siguiente clave, el valor termina justo antes.
            valueEnd = valueStart + nextKeyMatch;
        } else {
            // Si no, busca la llave de cierre del objeto JSON.
            const lastBraceIndex = textToAnalyze.lastIndexOf('}');
            if (lastBraceIndex > valueStart) {
                valueEnd = lastBraceIndex;
            }
        }

        let rawValue = textToAnalyze.substring(valueStart, valueEnd).trim();

        // El valor extraído estará envuelto en comillas o backticks. Los quitamos.
        if ((rawValue.startsWith('"') && rawValue.endsWith('"')) || (rawValue.startsWith('`') && rawValue.endsWith('`'))) {
            rawValue = rawValue.slice(1, -1);
        }

        // --- ¡LA SOLUCIÓN DEFINITIVA! ---
        // La IA envía los saltos de línea como "\n". Los convertimos a saltos de línea reales.
        // También nos aseguramos de que las comillas escapadas (\" ) se conviertan en comillas normales.
        const cleanedValue = rawValue.replace(/\\n/g, '\n').replace(/\\"/g, '"');

        return cleanedValue;
    };

    const styledCodeSnippet = extractValue('styledCodeSnippet');
    const explanation = extractValue('explanation');

    return { styledCodeSnippet, explanation };
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

    // --- LÓGICA DE PARSEO A PRUEBA DE BALAS ---
    let parsedResponse;
    try {
        // Usamos nuestra nueva función para extraer y reconstruir el objeto.
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
    
    // --- Validación de la Respuesta ---
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