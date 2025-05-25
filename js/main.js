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

// Efectos adicionales (hover en proyectos, typing...)
// Simula comandos reales (opcional)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // Lógica para procesar "comandos" (ej: "help", "clear")
    }
});
