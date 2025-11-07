import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type Message = {
  name: string;
  email: string;
  message: string;
};

async function sendEmail(message: Message): Promise<void> {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP no configurado, omitiendo envío de correo.");
    return;
  }

  try {
    // @ts-ignore
    const nodemailer = require("nodemailer");
    const transport = (nodemailer.default || nodemailer).createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transport.sendMail({
      from: process.env.SMTP_FROM || `"Portafolio" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO || process.env.SMTP_USER,
      subject: `Nuevo mensaje de ${message.name}`,
      text: `Nombre: ${message.name}\nEmail: ${message.email}\n\n${message.message}`,
      html: `<p><strong>Nombre:</strong> ${message.name}</p><p><strong>Email:</strong> ${message.email}</p><p>${message.message}</p>`,
    });
  } catch (err) {
    console.error("Error enviando email:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body as Message;

    console.log("API /api/contact received:", { name, email, message });

    // Guardar registro local para depuración (messages.log en la raíz del proyecto)
    try {
      const logPath = path.join(process.cwd(), "messages.log");
      const entry =
        JSON.stringify({ receivedAt: new Date().toISOString(), name, email, message }) +
        "\n";
      await fs.appendFile(logPath, entry, "utf8");
    } catch (fsErr) {
      console.warn("No se pudo escribir messages.log:", fsErr);
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Envío de correo (no obligatorio para pruebas locales)
    await sendEmail({ name, email, message });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("API /api/contact error:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

