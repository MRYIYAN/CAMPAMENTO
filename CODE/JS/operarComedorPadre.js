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
document.addEventListener("DOMContentLoaded", function() {
    // Hacer la petición fetch para obtener los datos
    fetch('../Server/GestionarComedor.php')
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            const cardsContainer = document.querySelector('.campamento-cards'); // Seleccionar el contenedor de las tarjetas
            if (!cardsContainer) {
                console.error("El contenedor de cards no se encuentra."); // Mostrar error si no se encuentra el contenedor
                return;
            }
            if (data.length > 0) {
                data.forEach(plan => {
                    const card = document.createElement('div'); // Crear un nuevo div para la tarjeta
                    card.classList.add('card-hover'); // Añadir la clase 'card-hover' al div
                    let imagenComida = null;
                    comprobarImagen(plan.imagen_src).then(existe => {  //usamos el metodo para la comprobacion
                        const imagenComida = existe ? plan.imagen_src : '../assets/comida/uploads/defaultPlanComida.png';  //creamos un variable que guarda la ruta, y si el funcion del comprobacion devualve un false, asignamos la ruta predefinida del imagen, al contrario asignamos la ruta que esta en bbdd
                         card.innerHTML = `
                        <div class="card-hover__content">
                            <h3 class="card-hover__title">${plan.nombre_plan}</h3> <!-- Título del plan -->
                            <p class="card-hover__text">${plan.descripcion}</p> <!-- Descripción del plan -->
                            <a href="#" class="card-hover__link">
                                <span>Ver más</span> <!-- Enlace para ver más detalles del plan -->
                            </a>
                        </div>
                        <div class="card-hover__extra">
                            <br><h4>Obtén un <span>${plan.descuento || 40}%</span> de descuento!</h4> <!-- Descuento del plan -->
                            <p>Precio: ${plan.precio}€</p> <!-- Precio del plan -->
                        </div>
                        <img src="${imagenComida}" alt=""> <!-- Imagen del plan -->
                    `;
                    cardsContainer.appendChild(card); // Añadir la tarjeta al contenedor
                    });
                   
                });
            } else {
                cardsContainer.innerHTML = "<p>No hay planes disponibles.</p>"; // Mensaje si no hay planes disponibles
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error); // Manejar errores en la carga de datos y mostrar un mensaje en la consola
        });
        
    // Usamos delegación de eventos en el contenedor para manejar el clic en "Ver más"
    document.querySelector('.campamento-cards').addEventListener('click', function(event) {
        // Buscamos si el clic proviene de un elemento con la clase .card-hover__link (o dentro de él)
        const link = event.target.closest('.card-hover__link');
        if (link) { // Si se encuentra un enlace con la clase .card-hover__link
            event.preventDefault(); // Prevenir la acción por defecto del enlace
            const card = link.closest('.card-hover'); // Encontrar el elemento padre con la clase .card-hover
            if (card) { // Si se encuentra el elemento padre
                card.classList.toggle('active'); // Alternar la clase 'active' en el elemento padre
            }
        }
    });
});

        // Función para obtener el valor de una cookie por su nombre
        function getCookie(nombre) {
            const cookies = document.cookie.split('; ');
            const cookie = cookies.find(fila => fila.startsWith(nombre + '='));
            return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
        }

        // Asignar el valor de la cookie al elemento HTML
        document.getElementById('biembenidoNombre').innerHTML = getCookie('nombrePadre');



        // Función para comprobar si la imagen existe
const comprobarImagen = (url) => {
    return fetch(url, { method: 'HEAD' })   //se deja la ruta en el head para comprobar
        .then(res => res.ok)  //si responde pasamo que es ok
        .catch(() => false);  //si  no lo pasamos es false
};