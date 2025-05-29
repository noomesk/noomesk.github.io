// ===== NAVEGACIÓN (Menú de secciones) =====
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1); // Ej: "proyectos"
        
        // Oculta todas las secciones
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Muestra la sección clickeada
        document.getElementById(targetId).classList.add('active');
    });
});

// ===== EFECTO TYPEWRITER (Rotación de frases) =====
const phrases = [
    "Automatizo procesos con Python.",
    "Analizo datos genómicos.",
    "Construyo aplicaciones web."
];
let i = 0;
function typeWriter() {
    const typingElement = document.querySelector('.typing');
    if (typingElement) { // Verifica si el elemento existe para evitar errores
        typingElement.textContent = phrases[i];
        i = (i + 1) % phrases.length;
        setTimeout(typeWriter, 3000);
    }
}
typeWriter(); // Inicia el efecto

// ===== SMOOTH SCROLLING (Para enlaces internos) =====
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ===== EFECTOS ADICIONALES (Teclado, etc.) =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // Lógica para procesar "comandos" (ej: "help", "clear")
    }
});
