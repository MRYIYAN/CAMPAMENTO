document.addEventListener("DOMContentLoaded", function() {
    const blocks = document.querySelectorAll(".block");

    // Ejemplo de animación con GSAP
    gsap.fromTo(blocks, { scaleY: 0 }, { scaleY: 1, duration: 1, stagger: 0.2 });
});