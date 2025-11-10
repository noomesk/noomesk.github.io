// src/ai/flows/suggest-code-style.ts

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
  
  try {
    const response = await fetch('/api/suggest-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codeSnippet, designSystem }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la petición');
    }

    const data: SuggestCodeStyleOutput = await response.json();
    
    return data;

  } catch (error) {
    console.error("Error en suggestCodeStyle:", error);
    if (error instanceof Error) {
      throw new Error(`Fallo al obtener sugerencias de IA: ${error.message}`);
    }
    throw new Error("Ocurrió un error desconocido.");
  }
}