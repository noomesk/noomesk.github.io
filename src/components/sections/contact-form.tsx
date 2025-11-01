"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"

type FormState = "idle" | "sending" | "success" | "error"

export default function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [state, setState] = useState<FormState>("idle")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Por favor completa todos los campos.")
      return
    }

    setState("sending")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data && data.error) || "Error al enviar")
      }

      setState("success")
      setName("")
      setEmail("")
      setMessage("")
    } catch (err: any) {
      setError(err?.message ?? "Error desconocido")
      setState("error")
    } finally {
      setTimeout(() => {
        setState("idle")
        setError(null)
      }, 3500)
    }
  }

  return (
    <section className="w-full max-w-3xl mx-auto bg-card/80 backdrop-blur-md border border-border rounded-2xl p-8 shadow-lg">
      <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-2 text-foreground">
        Ponte en contacto
      </h2>
      <p className="text-muted-foreground mb-6">
        ¿Tienes un proyecto o solo quieres saludar? Envíame un mensaje.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Nombre</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border border-border rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="Tu nombre"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border border-border rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder="tu@correo.com"
              required
            />
          </label>
        </div>

        <label className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1">Mensaje</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[130px] resize-vertical bg-background border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="Escribe tu mensaje..."
            required
          />
        </label>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {state === "sending" ? "Enviando..." : "Enviar mensaje"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="font-medium"
              onClick={() => {
                setName("")
                setEmail("")
                setMessage("")
                setError(null)
                setState("idle")
              }}
            >
              Limpiar
            </Button>
          </div>

          <div className="text-right">
            {state === "success" && (
              <p className="text-sm text-green-400">Mensaje enviado. Gracias.</p>
            )}
            {state === "error" && (
              <p className="text-sm text-red-400">Error: {error}</p>
            )}
            {error && state === "idle" && (
              <p className="text-sm text-yellow-300">{error}</p>
            )}
          </div>
        </div>
      </form>
    </section>
  )
}