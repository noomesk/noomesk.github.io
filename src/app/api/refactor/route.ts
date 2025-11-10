import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code, style } = await req.json();

    if (!code || !style) {
      return NextResponse.json({ error: 'Faltan el código o el estilo.' }, { status: 400 });
    }

    const systemPrompt = `Eres un experto desarrollador frontend. Tu tarea es refactorizar el siguiente código para que use las mejores prácticas y el sistema de diseño "${style}". Responde ÚNICAMENTE con el código refactorizado, sin explicaciones adicionales. No incluyas marcadores de código como ```javascript o ```tsx al inicio o al final.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: code },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al contactar la API de Groq');
    }

    const data = await response.json();
    const refactoredCode = data.choices[0].message.content;

    return NextResponse.json({ refactoredCode });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error del servidor al refactorizar.' }, { status: 500 });
  }
}