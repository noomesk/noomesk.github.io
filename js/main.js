// ===== NAVEGACIÓN (Menú de secciones - Adaptado a tu HTML) =====
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href'); // Ej: "#automation"
        
        // Oculta todas las secciones (si decides implementar lógica de pestañas)
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Muestra la sección clickeada (requiere CSS: section { display:none; } section.active { display:block; })
        document.querySelector(targetId).classList.add('active');

        // Smooth scrolling (alternativa si prefieres desplazamiento)
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ===== EFECTO TYPEWRITER (Para tu <p class="typing">) =====
const phrases = [
    "Automatización con Python",
    "Bioinformática",
    "Desarrollo Web"
];
let i = 0;
function typeWriter() {
    const typingElement = document.querySelector('.typing');
    if (typingElement) {
        typingElement.textContent = phrases[i] + ' '; // Añade espacio para el cursor
        i = (i + 1) % phrases.length;
        setTimeout(typeWriter, 2000); // Cambia cada 2 segundos
    }
}
typeWriter(); // Inicia el efecto

// ===== EFECTO BLINK (Cursor parpadeante - Ya lo tienes en HTML) =====
// (Opcional: Puedes controlarlo desde JS si quieres más dinamismo)
