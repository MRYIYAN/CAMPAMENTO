document.addEventListener("DOMContentLoaded", function() {
    // Selecciona los bloques de transición
    const blocks = document.querySelectorAll('.block');

    // Función para iniciar la transición
    function startTransition() {
        gsap.to(blocks, {
            duration: 1,
            scaleY: 0,
            stagger: 0.2,
            ease: "power2.inOut",
            onComplete: function() {
                // Aquí puedes agregar cualquier acción que desees realizar después de la transición
                console.log("Transición completada");
            }
        });
    }

    // Inicia la transición al cargar la página
    startTransition();
});