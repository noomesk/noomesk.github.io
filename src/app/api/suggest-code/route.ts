// src/app/api/suggest-code/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Función para sanitizar una respuesta de la IA que puede contener JSON malformado.
 * Convierte template literals (backticks) en cadenas JSON válidas.
 */
function sanitizeJsonResponse(rawResponse: string): string {
    // 1. Extraer el objeto JSON de la respuesta, por si viene en un bloque markdown.
    const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    let jsonString = jsonMatch ? jsonMatch[1] : rawResponse;

    // 2. Reemplazar los valores de cadena que usan backticks por cadenas JSON válidas.
    // Busca claves específicas seguidas de un valor entre backticks.
    // La expresión regular es: "clave": `contenido`
    const regex = /"(styledCodeSnippet|explanation)":\s*`([\s\S]*?)`/g;
    
    jsonString = jsonString.replace(regex, (match, key, content) => {
        // JSON.stringify se encarga de escapar correctamente el contenido (saltos de línea, comillas, etc.)
        const escapedContent = JSON.stringify(content);
        return `"${key}": ${escapedContent}`;
    });

    return jsonString;
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

    // --- 1. Prompt Ultra-Estricto ---
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

    // --- 2. Lógica de Parseo a Prueba de Balas ---
    let parsedResponse;
    try {
        // Usamos nuestra función de sanitización para limpiar la respuesta
        const sanitizedJsonString = sanitizeJsonResponse(rawResponse);
        console.log("JSON sanitizado para parsear:", sanitizedJsonString); // Log para depuración
        
        // Ahora intentamos parsear el JSON limpio
        parsedResponse = JSON.parse(sanitizedJsonString);

    } catch (error) {
        console.error("Error al parsear el JSON de la IA:", error);
        console.error("Respuesta cruda recibida de la IA:", rawResponse);
        return new Response(JSON.stringify({ 
            error: "La IA devolvió una respuesta que no es un JSON válido.",
            details: error.message,
            rawResponse: rawResponse 
        }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // --- 3. Validación de la Respuesta ---
    if (!parsedResponse || typeof parsedResponse.styledCodeSnippet !== 'string' || typeof parsedResponse.explanation !== 'string') {
        console.error("El JSON no tiene el formato esperado. Objeto recibido:", parsedResponse);
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