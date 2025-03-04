//-----------------------------------------------------------------------------------------------------------//
//                                               INICIO DE JS DE NAVBAR
//-----------------------------------------------------------------------------------------------------------//
document.addEventListener("DOMContentLoaded", () => {
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
  
    /* ================================================================
         EVENTOS DEL NAVBAR ADAPTADOS PARA USAR LA TRANSICIÓN
      ================================================================= */
    // En lugar de redirigir directamente, se llama a redirectWithTransition(url)
    document.getElementById("btnInicio").addEventListener("click", () => {
        redirectWithTransition("../html/IndexMonitor.html"); // Redirigir a la página Inndex
      });
    
    document
      .getElementById("btnVerActividad")
      .addEventListener("click", () => {
        redirectWithTransition("../html/infoActividadesMonitor.html"); // Redirigir a la página de Actividades
      });
  
    document.getElementById("btnComedor").addEventListener("click", () => {
      redirectWithTransition("../html/infoComedorMonitor.html"); // Redirigir a la página de comedor
    });
  
    document.getElementById("btnContacto").addEventListener("click", () => {
      redirectWithTransition("../html/infoContactoMonitor.html"); // Redirigir a la página de contacto
    });
  
    document.getElementById("btnNotificaciones").addEventListener("click", () => {
      redirectWithTransition("../html/notificacionesMonitor.html"); // Redirigir a la página de Notificaciones
    });
  
    document
      .getElementById("btnModificarDatosMonitor")
      .addEventListener("click", () => {
        redirectWithTransition("../html/ModificarMonitor.html"); // Redirigir a la página de actividades
      });
  
    /* ================================================================
              EVENTOS EXISTENTES (OVERLAY Y CERRAR SESIÓN)
      ================================================================= */
    // Función para abrir el overlay de cerrar sesión
    document.getElementById("btnCerrarSesion").addEventListener("click", () => {
      document.getElementById("overlay").classList.add("activeOverlay"); // Añadir clase para mostrar el overlay
    });
  
    // Cerrar el overlay
    document
      .getElementById("cerrarOverlayCerrarSesion")
      .addEventListener("click", cerrarOverlayCerrarSesion); // Evento para cerrar el overlay
    document
      .getElementById("volverOverlayCerrarSesion")
      .addEventListener("click", cerrarOverlayCerrarSesion); // Evento para volver y cerrar el overlay
  
    function cerrarOverlayCerrarSesion() {
      document.getElementById("overlay").classList.remove("activeOverlay"); // Quitar clase para ocultar el overlay
    }
  
    // Acción para cerrar sesión y redirigir (sin transición)
    document
      .getElementById("cerrarSesionOverlayCerrarSesion")
      .addEventListener("click", cerrarSesionSeguro); // Evento para cerrar sesión
  
    function cerrarSesionSeguro() {
      fetch("../Server/quitarSesion.php", {
        // Conexión con el servidor para quitar la sesión
        method: "POST", // Método de la solicitud
        headers: {
          "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener datos del servidor."); // Manejo de error si la respuesta no es OK
          }
          return response.json(); // Convertir la respuesta a JSON
        })
        .then((data) => {
          if (data.logout) {
            window.location.href = data.logout; // Redirigir a la URL proporcionada para logout
          }
        });
    }
  });
  //-----------------------------------------------------------------------------------------------------------//
  //                                           FIN DE JS DE NAVBAR
  //-----------------------------------------------------------------------------------------------------------//


   // Función para obtener el valor de una cookie por su nombre
   function getCookie(nombre) {
       const cookies = document.cookie.split('; ');
       const cookie = cookies.find(fila => fila.startsWith(nombre + '='));
       return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
   }
   // Asignar el valor de la cookie al elemento HTML
   document.getElementById('biembenidoNombre').innerHTML = getCookie('nombreMonitor');

   //-----------------------------------------------------------------------------------------------------------//
  //PROTECCION DE RUTA Y EXTRAER EL ID
  //-----------------------------------------------------------------------------------------------------------//
  fetch("../Server/comprobacionSesionMonitor.php", {
    method: "POST", // Método de la solicitud
    headers: {
      "Content-type": "application/json", // Tipo de contenido de la solicitud
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener datos del servidor."); // Manejo de error si la respuesta no es OK
      }
      return response.json(); // Convertir la respuesta a JSON
    })
    .then((data) => {
      // Comprobar si hay un error en la respuesta
      if (data.error) {
        alert("Error: " + data.error); // Mostrar alerta en caso de error
      } else if (data.noLogin) {
        // Redirigir si no hay sesión iniciada
        window.location.href = data.noLogin;
        console.log(`Login: ${data.login}`); // Mostrar en consola el estado de login
      } else {
        console.log(`id: ${data.id}`);
        // cookieNombreMonitor(data.id)  //---------------------
      }
    })
    //-----------------------------------------------------------------------------------------------------------//