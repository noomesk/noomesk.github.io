// ===== TYPEWRITER DEL HEADER (Mantén este tal cual) =====
const phrases = [
    "Automatización con Python",
    "Bioinformática",
    "Desarrollo Web",
    "Ciberseguridad"
];
let currentPhrase = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function typeHeader() {
    const typingElement = document.querySelector('.typing');
    if (!typingElement) return;

    const currentText = phrases[currentPhrase];
    
    if (!isDeleting && charIndex <= currentText.length) {
        typingElement.textContent = currentText.substring(0, charIndex) + '<span class="blink">_</span>';
        charIndex++;
        typingSpeed = 100;
    } else if (isDeleting && charIndex >= 0) {
        typingElement.textContent = currentText.substring(0, charIndex) + '<span class="blink">_</span>';
        charIndex--;
        typingSpeed = 50;
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            currentPhrase = (currentPhrase + 1) % phrases.length;
        }
        typingSpeed = isDeleting ? 1500 : 500;
    }
    setTimeout(typeHeader, typingSpeed);
}

// ===== ANIMACIONES AL SCROLL (Nueva versión mejorada) =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Efecto parallax para el fondo
            if (entry.target.classList.contains('parallax-bg')) {
                const speed = parseFloat(entry.target.getAttribute('data-speed')) || 0.3;
                const yOffset = window.scrollY * speed;
                entry.target.style.transform = `translateY(${yOffset}px)`;
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.hidden').forEach((el) => {
    observer.observe(el);
});

// ===== EFECTO HOVER "HACKER" (Nuevo) =====
document.querySelectorAll('.hacker-hover').forEach((link) => {
    link.addEventListener('mouseenter', () => {
        link.style.textShadow = '0 0 10px #00ff00';
    });
    link.addEventListener('mouseleave', () => {
        link.style.textShadow = 'none';
    });
});

// ===== NAVEGACIÓN PRINCIPAL (Mantén tu versión con scroll suave) =====
document.querySelectorAll('.menu a').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        document.querySelectorAll('section').forEach((section) => {
            section.classList.remove('active-section');
        });
        document.querySelectorAll('.menu a').forEach((item) => {
            item.classList.remove('active-tab');
        });
        
        document.querySelector(targetId).classList.add('active-section');
        link.classList.add('active-tab');

        // Scroll suave (¡esto es tuyo, no lo cambies!)
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ===== PESTAÑAS DE ARCHIVOS (Mantén tu código original) =====
document.querySelectorAll('.tab-bar .tab').forEach((tab) => {
    tab.addEventListener('click', function() {
        const tabBar = this.parentElement;
        tabBar.querySelectorAll('.tab').forEach((t) => {
            t.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// ===== HOVER DE PROJECT CARDS (Mantén tu efecto) =====
document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 20px rgba(0, 255, 0, 0.3)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    typeHeader(); // Inicia tu typewriter del header
    
    // Typewriter adicional para contacto (nuevo)
    const contactTitle = document.getElementById('typewriter-title');
    if (contactTitle) {
        const typeWriter = (element, text, speed = 50) => {
            let i = 0;
            element.textContent = '';
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        };
        typeWriter(contactTitle, "> cat contacto.txt");
    }
    
    // Activa la primera sección por defecto (tu código)
    const defaultSection = document.querySelector('#bioinformatics') || document.querySelector('section');
    if (defaultSection) defaultSection.classList.add('active-section');
});
