'use client';

import { useState } from 'react';

// ESTA LÍNEA ES PARA QUE SEPAMOS QUE ESTE ES EL COMPONENTE CORRECTO
console.log("✅ El componente ContactSection se está cargando con el estilo correcto!");

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Algo salió mal');
      }

      setStatus({ type: 'success', message: '¡Mensaje enviado con éxito!' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Error al enviar el mensaje.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="font-headline uppercase text-4xl md:text-5xl font-black text-center mb-4">
          CONTÁCTAME
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Completa el formulario a continuación y me pondré en contacto contigo lo antes posible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu Nombre"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-gray-700 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-gray-700 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tu mensaje..."
              rows={5}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-gray-700 text-white placeholder-gray-500 resize-none"
            />
          </div>

          {status && (
            <p className={`text-center ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-bold py-3 px-6 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </section>
  );
}