import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string; // ISO
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "messages.json");

async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(dataFile).catch(async () => {
      await fs.writeFile(dataFile, JSON.stringify({ messages: [] }, null, 2), "utf8");
    });
  } catch (error) {
    // We let callers handle errors
    throw error;
  }
}

async function readMessages(): Promise<Message[]> {
  await ensureDataFile();
  const content = await fs.readFile(dataFile, "utf8");
  try {
    const parsed = JSON.parse(content) as { messages?: Message[] };
    return Array.isArray(parsed.messages) ? parsed.messages : [];
  } catch {
    // If file is corrupted, reset
    return [];
  }
}

async function writeMessages(messages: Message[]): Promise<void> {
  await ensureDataFile();
  const payload = { messages } as const;
  await fs.writeFile(dataFile, JSON.stringify(payload, null, 2), "utf8");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function notify(message: Message): Promise<void> {
  const shouldSendEmail = !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.NOTIFY_EMAIL_TO
  );

  const shouldSendSms = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM &&
    process.env.NOTIFY_PHONE_TO
  );

  const tasks: Promise<unknown>[] = [];

  if (shouldSendEmail) {
    tasks.push(
      (async () => {
        const nodemailer = (await import("nodemailer")).default;
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER as string,
            pass: process.env.SMTP_PASS as string,
          },
        });
        const subject = `Nuevo mensaje de ${message.name}`;
        const text = `Nombre: ${message.name}\nEmail: ${message.email}\nFecha: ${message.createdAt}\nMensaje:\n${message.message}`;
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.NOTIFY_EMAIL_TO as string,
          subject,
          text,
        });
      })().catch(() => undefined)
    );
  }

  if (shouldSendSms) {
    tasks.push(
      (async () => {
        const twilio = (await import("twilio")).default;
        const client = twilio(
          process.env.TWILIO_ACCOUNT_SID as string,
          process.env.TWILIO_AUTH_TOKEN as string
        );
        const body = `Nuevo mensaje: ${message.name} <${message.email}> - ${message.message}`.slice(0, 1500);
        await client.messages.create({
          from: process.env.TWILIO_FROM as string, // e.g. +1234567890 or whatsapp:+1234567890
          to: process.env.NOTIFY_PHONE_TO as string, // e.g. +1234567890 or whatsapp:+1234567890
          body,
        });
      })().catch(() => undefined)
    );
  }

  if (tasks.length > 0) {
    await Promise.all(tasks);
  }
}

export async function GET() {
  try {
    const messages = await readMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudieron leer los mensajes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name || body.nombre || "").trim();
    const email = String(body.email || "").trim();
    const userMessage = String(body.message || body.mensaje || "").trim();

    if (!name || !email || !userMessage) {
      return NextResponse.json(
        { error: "Campos requeridos: name, email, message" },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      message: userMessage,
      createdAt: new Date().toISOString(),
    };

    const messages = await readMessages();
    messages.push(newMessage);
    await writeMessages(messages);

    // Notificar en background (no bloquea la respuesta)
    notify(newMessage).catch(() => undefined);

    return NextResponse.json({ ok: true, message: newMessage }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo guardar el mensaje" },
      { status: 500 }
    );
  }
}


