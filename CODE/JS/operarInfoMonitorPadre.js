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
      // Evento para el logo de inicio (solo hay uno)
      document.querySelectorAll("#btninicio").forEach(btn => {
        btn.addEventListener("click", () => {
            redirectWithTransition("../html/Bienvenido_tutor.html");
        });
    });
  
      // Seleccionamos TODOS los botones con la misma funcionalidad y les añadimos eventos
      document.querySelectorAll("#btnModificarDatosPadre").forEach(btn => {
          btn.addEventListener("click", () => {
              redirectWithTransition("../html/IndexPadre.html");
          });
      });
  
      document.querySelectorAll("#btnNotificaciones").forEach(btn => {
          btn.addEventListener("click", () => {
              redirectWithTransition("../html/NotificacionesPadre.html");
          });
      });
  
      document.querySelectorAll("#btnMonitor").forEach(btn => {
          btn.addEventListener("click", () => {
              redirectWithTransition("../html/infoMonitorPadre.html");
          });
      });
  
      document.querySelectorAll("#btnContacto").forEach(btn => {
          btn.addEventListener("click", () => {
              redirectWithTransition("../html/infoContactoPadre.html");
          });
      });
  
      document.querySelectorAll("#btnPolitica").forEach(btn => {
          btn.addEventListener("click", () => {
              redirectWithTransition("../html/politicas.html");
          });
      });
  
      document.querySelectorAll("#btnComedor").forEach(btn => {
          btn.addEventListener("click", () => {
              redirectWithTransition("../html/comedor.html");
          });
      });
  
      document.querySelectorAll("#btnCalendario").forEach(btn => {
          btn.addEventListener("click", () => {
              redirectWithTransition("../html/calendarioPadre.html");
          });
      });
  
      document.querySelectorAll("#btnInfoActividades").forEach(btn => {
          btn.addEventListener("click", () => {
              redirectWithTransition("../html/infoActividades.html");
          });
      });
  
      document.getElementById('menuToggle').addEventListener('click', function() {
        document.getElementById('menu').classList.toggle('mostrar-menu');
    });
    
      /* ================================================================
              EVENTOS EXISTENTES (OVERLAY Y CERRAR SESIÓN)
      ================================================================= */
      // Función para abrir el overlay de cerrar sesión
      document.querySelectorAll("#btnCerrarSesion").forEach(btn => {
          btn.addEventListener("click", () => {
              document.getElementById("overlay").classList.add("activeOverlay"); // Añadir clase para mostrar el overlay
          });
      });
    // Cerrar el overlay
    document.getElementById('cerrarOverlayCerrarSesion').addEventListener('click', cerrarOverlayCerrarSesion); // Evento para cerrar el overlay
    document.getElementById('volverOverlayCerrarSesion').addEventListener('click', cerrarOverlayCerrarSesion); // Evento para volver y cerrar el overlay
  
    function cerrarOverlayCerrarSesion() {
        document.getElementById("overlay").classList.remove("activeOverlay"); // Quitar clase para ocultar el overlay
    }
  
    // Acción para cerrar sesión y redirigir (sin transición)
    document.getElementById('cerrarSesionOverlayCerrarSesion').addEventListener('click', cerrarSesionSeguro); // Evento para cerrar sesión
  
    function cerrarSesionSeguro() {
        fetch("../Server/quitarSesion.php", { // Conexión con el servidor para quitar la sesión
            method: 'POST', // Método de la solicitud
            headers: {
                'Content-type': 'application/json', // Tipo de contenido de la solicitud
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos del servidor.'); // Manejo de error si la respuesta no es OK
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(data => {
            if (data.logout) {
                window.location.href = data.logout; // Redirigir a la URL proporcionada para logout
            }
        });
    }
});
//-----------------------------------------------------------------------------------------------------------//
//                                           FIN DE JS DE NAVBAR
//-----------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------//
//                                               INICIO DE JS DE INFO MONITOR
//-----------------------------------------------------------------------------------------------------------//

const buttons = document.querySelectorAll(".buttons button");

const tables = document.querySelectorAll(".tables table");

const tablesInner = document.querySelector(".tables-inner");

const selectList = (element, index = 0) => {
  tablesInner.style.translate = `${index === 0 ? 0 : 0 - index * 500}px 0`;

 // Remover la clase 'active' de todas las tablas
 tables.forEach((table) => table.classList.remove("active"));
  
 // Agregar la clase 'active' a la tabla seleccionada
 tables[index].classList.add("active");

 // Resaltar el botón seleccionado
 if (element) {
   buttons.forEach((button) => button.classList.remove("active"));
   element.classList.add("active");
 }
};
selectList();

//------------------------------------------------------------------------------------------------// 
//                             GESTION DE BD PARA INFORMACIÓN DEL MONITOR
//------------------------------------------------------------------------------------------------//
// Función para actualizar los datos de los monitores
function actualizarMonitores() {
    fetch('../Server/GestionarMonitorPadre.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error de red');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);  // Verifica la estructura de los datos en la consola

            if (data.length < 4) {
                console.warn('Faltan algunos usuarios, solo se reciben', data.length, 'usuarios');
            }

            // Itera sobre la cantidad de datos que se recibieron
            for (let i = 0; i < data.length; i++) {
                const monitor = data[i];
                const userDiv = document.querySelector(`#usuario${i + 1}`);
                
                if (userDiv) {
                    const h3 = userDiv.querySelector('h3');
                    const h4 = userDiv.querySelector('h4');
                    if (h3) h3.innerHTML = monitor ? monitor.nombre : 'Usuario no encontrado';
                    if (h4) h4.innerHTML = monitor ? monitor.descripcion : 'Descripción no disponible';
                } else {
                    console.warn(`No se encontró el contenedor para el usuario ${i + 1}`);
                }
            }
        })
        .catch(error => console.error('Error en la carga de monitores:', error));
}

// Llamar a la función para actualizar los datos de los monitores
actualizarMonitores();
//-----------------------------------------------------------------------------------------------------------//

        // Función para obtener el valor de una cookie por su nombre
        function getCookie(nombre) {
            const cookies = document.cookie.split('; ');
            const cookie = cookies.find(fila => fila.startsWith(nombre + '='));
            return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
        }

        // Asignar el valor de la cookie al elemento HTML
        document.getElementById('biembenidoNombre').innerHTML = getCookie('nombrePadre');