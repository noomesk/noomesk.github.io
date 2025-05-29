// ===== ESTOY DOCUENTANDO TODO INLINE XQ EL OTRO DIA VINE A VER QUÉ CARAJOS HABÍA HECHO Y MEPERDÍ =====
// ===== NAVEGACIÓN PRINCIPAL (Menú de secciones) =====
document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href'); // Ej: "#bioinformatics"
        
        // 1. Removí clase 'active' de todas las secciones y pestañas del menúsito
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active-section');
        });
        document.querySelectorAll('.menu a').forEach(item => {
            item.classList.remove('active-tab');
        });
        
        // 2. Muestra sección clickeada y marcar pestaña como activa
        document.querySelector(targetId).classList.add('active-section');
        link.classList.add('active-tab');

        // 3. Desplazamiento suave (animación) ejj
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ===== PESTAÑAS DE ARCHIVOS (Para actualizar las terminales de bioinformática/web-dev/cybersecurity) =====
document.querySelectorAll('.tab-bar .tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabBar = this.parentElement;
        
        // 1. Removí 'active' de todas las pestañas del mismo grupo
        tabBar.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
        });
        
        // 2. Marqué pestaña clickeada como activa
        this.classList.add('active');
        
        // 3. (Opcional) Aquí se puede cambiar el contenido del archivo visible
        // Z.B Si tengo múltiples .file-content en un terminal
    });
});

// ===== EFECTO TYPEWRITER (Texto animaditooop en el header) =====
const phrases = [
    "Automatización con Python",
    "Bioinformática",
    "Desarrollo Web",
    "Ciberseguridad"  // Nueva frase añadida xq no estaba aah
];
let currentPhrase = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function typeWriter() {
    const typingElement = document.querySelector('.typing');
    if (!typingElement) return;

    const currentText = phrases[currentPhrase];
    
    // Escribir o borrar
    if (!isDeleting && charIndex <= currentText.length) {
        typingElement.textContent = currentText.substring(0, charIndex) + '<span class="blink">_</span>';
        charIndex++;
        typingSpeed = 100; // Velocidad escritura
    } else if (isDeleting && charIndex >= 0) {
        typingElement.textContent = currentText.substring(0, charIndex) + '<span class="blink">_</span>';
        charIndex--;
        typingSpeed = 50; // Velocidad borrado (más rápida)
    } else {
        // Cambia entre modos
        isDeleting = !isDeleting;
        if (!isDeleting) {
            currentPhrase = (currentPhrase + 1) % phrases.length;
        }
        typingSpeed = isDeleting ? 1500 : 500; // Pausa entre frases
    }

    setTimeout(typeWriter, typingSpeed);
}

// Inicia el efecto al cargar la página juasss
document.addEventListener('DOMContentLoaded', () => {
    typeWriter();
    
    // Debug (puede sser opcional, pero soy la diosa del debugging)
    console.log("Scripts cargados correctamente");
    
    // Activa la primera sección por defecto
    const defaultSection = document.querySelector('#bioinformatics') || document.querySelector('section');
    if (defaultSection) defaultSection.classList.add('active-section');
});

// ===== EFECTO HOVER PARA TARJETAS DE PROYECTOS, MUY NICEE =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 20px rgba(0, 255, 0, 0.3)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});
