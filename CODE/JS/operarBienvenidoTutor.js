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



document.getElementById('menuToggle').addEventListener('click', function() {
    document.getElementById('menu').classList.toggle('mostrar-menu');
});

//-----------------------------------------------------------------------------------------------------------//
//                                               FIN DE JS DE NAVBAR
//-----------------------------------------------------------------------------------------------------------//

//-----------------------------------------------------------------------------------------------------------//
//                                               INICIO DE JS DE INDEXPADRE
//-----------------------------------------------------------------------------------------------------------//

let currentIndex = 0;

function moveCarrusel(direction) {
    const carruselInner = document.querySelector('.carrusel-inner');
    const items = document.querySelectorAll('.carrusel-item');
    const totalItems = items.length;
    const visibleItems = 3; // Número de elementos visibles a la vez

    currentIndex += direction;

    // Asegurarse de que el índice esté dentro de los límites
    if (currentIndex < 0) {
        currentIndex = totalItems - visibleItems;
    } else if (currentIndex > totalItems - visibleItems) {
        currentIndex = 0;
    }

    const offset = -currentIndex * (100 / visibleItems);
    carruselInner.style.transform = `translateX(${offset}%)`;
}



// Conexión con el servidor para obtener datos del padre y sus hijos
fetch("../Server/GestionarIndexPadre.php", {
    method: 'POST', // Método de la solicitud
    headers: {
        'Content-type': 'application/json', // Tipo de contenido de la solicitud
    },
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error al obtener datos del servidor.'); // Manejo de error si la respuesta no es OK
    }
    return response.json(); // Convertir la respuesta a JSON
})
.then(data => {
    // Comprobar si hay un error en la respuesta
    if (data.error) {
        alert('Error: ' + data.error); // Mostrar alerta en caso de error
    } else if (data.noLogin) {
        // Redirigir si no hay sesión iniciada
        window.location.href = data.noLogin;
        console.log(`Login: ${data.login}`); // Mostrar en consola el estado de login
    } else {
        // Mostrar datos del padre
        console.log(`Login: ${data.login}`); // Mostrar en consola el estado de login
        // Asignar una cookie con el nombre "nombrePadre" y el valor desde data.infoPadre['nombre']
        document.cookie = `nombrePadre=${data.infoPadre['nombre']}; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;
            // Función para obtener el valor de una cookie por su nombre
            function getCookie(nombre) {
                const cookies = document.cookie.split('; ');
                const cookie = cookies.find(fila => fila.startsWith(nombre + '='));
                return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
            }
    
            // Asignar el valor de la cookie al elemento HTML
            document.getElementById('biembenidoNombre').innerHTML = getCookie('nombrePadre');
    }
});