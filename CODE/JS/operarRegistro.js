//-----------------------------------------------------------------------------------//
// Script para operar el registro de usuarios
//-----------------------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', function() {
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

    //-----------------------------------------------------------------------------------//
    // Añadir listener para el submit del formulario de registro 
    //-----------------------------------------------------------------------------------//

    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envio del formulario
        

        //----------------------------------------------------------------------------------//
        // Obtener los valores de email y password del formulario de registro
        //----------------------------------------------------------------------------------//

        let email = document.getElementById('reg_email').value;
        let pswd = document.getElementById('reg_pswd').value;

        //----------------------------------------------------------------------------------//
        // Enviar los datos al servidor mediante fetch
        //----------------------------------------------------------------------------------//
        fetch("../Server/GestionarRegistro.php", {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `email=${encodeURIComponent(email)}&pswd=${encodeURIComponent(pswd)}`
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data => {
        //----------------------------------------------------------------------------------//
        // Procesar la respuesta JSON
        //----------------------------------------------------------------------------------//
        if (data.error) { 
            alert(data.error);
        } else if (data.redirect) {
            redirectWithTransition(data.redirect); // Redirigir a la página de modificación de datos del padre

        } else {
            alert("Registro exitoso!");
        }
     })
    .catch(error => {
        console.error('Error:', error);
    });
    });
});