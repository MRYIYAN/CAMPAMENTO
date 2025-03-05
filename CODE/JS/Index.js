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



    const ease = "power4.inOut"; // Definir la animación de easing para GSAP

    // ================================================================//
    //                    TRANSICIÓN CON GSAP
    // ================================================================= //
    // Función para ocultar la transición al cargar la página
    function revealTransition() {
      return new Promise((resolve) => {
        gsap.set(".block", { scaleY: 1 }); // Establecer la escala Y de los elementos con clase "block" a 1
        gsap.to(".block", {
          scaleY: 0, // Animar la escala Y a 0
          duration: 1, // Duración de la animación
          stagger: {
            each: 0.1, // Intervalo entre cada animación
            from: "start", // Comenzar la animación desde el inicio
            grid: "auto", // Disposición automática en una cuadrícula
            axis: "y", // Animar en el eje Y
          },
          ease: ease, // Aplicar la animación de easing definida
          onComplete: resolve, // Resolver la promesa al completar la animación
        });
      });
    }
  
    // Función para animar la transición al cambiar de página
    function animateTransition() {
      return new Promise((resolve) => {
        gsap.set(".block", { visibility: "visible", scaleY: 0 }); // Establecer la visibilidad y escala Y de los elementos con clase "block"
        gsap.to(".block", {
          scaleY: 1, // Animar la escala Y a 1
          duration: 1, // Duración de la animación
          stagger: {
            each: 0.1, // Intervalo entre cada animación
            from: "start", // Comenzar la animación desde el inicio
            grid: [2, 4], // Disposición en una cuadrícula de 2 filas y 4 columnas
            axis: "x", // Animar en el eje X
          },
          ease: ease, // Aplicar la animación de easing definida
          onComplete: resolve, // Resolver la promesa al completar la animación
        });
      });
    }
  
    // Al cargar la página se ejecuta la transición de revelado
    revealTransition().then(() => {
      gsap.set(".block", { visibility: "hidden" }); // Ocultar los elementos con clase "block" después de la transición
    });
  
    // Función que ejecuta la animación y luego redirige
    function redirectWithTransition(url) {
      animateTransition().then(() => {
        window.location.href = url; // Redirigir a la URL especificada después de la animación
      });
    }
    // Redieccionamiento con animacion
    document.getElementById('btnIniciarSesion').addEventListener('click', ()=>{
        redirectWithTransition("../html/login.html"); // Redirigir a la página de modificación de datos del padre
    })
});

jQuery(document).ready(function(){   
    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() > 600) {
            jQuery('#myBtn').css('opacity', '1');
        } else {
            jQuery('#myBtn').css('opacity', '0');
        }
    });

    jQuery('#myBtn').click(function () {
        jQuery('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
});

