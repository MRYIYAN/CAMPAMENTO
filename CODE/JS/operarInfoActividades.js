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
//                               FETCH PARA SCAR TODO LOS DATOS DE LA TABLA ACTIVIDAD
//-----------------------------------------------------------------------------------------------------------//
//CONEXION BBDD
//este fetch se ejecuta SIEMPRE
fetch("../Server/GestionarInfoActividades.php", {
  method: "POST",
  headers: {
    "Content-type": "application/json",
  },
  // body: JSON.stringify({ inscribirse: "ok"})
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al obtener datos del servidor.");
    }
    return response.json();
  })
  .then((data) => {
    //comprobar si es un error o no
    if (data.error) {
      //en caso de si
      console.log("Error: " + data.error);
    } else if (data.noLogin) {
      //COMPROBACION DE LOGIN
      window.location.href = data.noLogin; // Redirige a la URL proporcionada en el JSON
    } else {
      //RESPUESTAS
      console.log(`Login: ${data.login}`);
      console.log(`Id Padre: ${data.id_Padre}`);
      document.getElementById('biembenidoNombre').innerHTML = data.infoPadre['nombre']
      console.log("Actividades bbdd: ");
      console.log(data.actividades); //comprobacion de actividades

      //================================================================================================//
      //                               Inicio de tarjetas de Actividades
      //================================================================================================//
     // Crear un array de promesas para comprobar las imágenes
const tarjetasPromesas = data.actividades.map((actividad) => {
  return comprobarImagen(actividad.imagen_src).then((existe) => {
    // Asignar la imagen correcta o la predeterminada
    const imagen_src = existe
      ? actividad.imagen_src
      : "../assets/actividad/uploads/defaultActividad.png";

    // Texto truncado para la descripción
    const descripcionTruncada =
      actividad.descripcion.length >= 100
        ? actividad.descripcion.substring(0, 100) + "..."
        : actividad.descripcion;

    // Retornar el HTML de la tarjeta como una promesa
    return `
      <div class="card">
        <!-- Cara delantera -->
        <div class="face front">
            <img src="${imagen_src}" alt="">
            <h3>${actividad.titulo}</h3>
        </div>
        <!-- Cara trasera -->
        <div class="face back">
            <h3>${actividad.titulo}</h3>
            <p>${descripcionTruncada}</p>
            <button class="verMasBtn" onclick="mostrarOverlay('${actividad.descripcion}')">Ver más</button>
        </div>
      </div>`;
  });
});

// Esperar a que todas las promesas se resuelvan y luego insertar el HTML
Promise.all(tarjetasPromesas).then((tarjetas) => {
  document.getElementById("tarjetasActividades").innerHTML = tarjetas.join("");
});


      // Función para cerrar el overlay
      document
        .querySelector(".closeBtnDefinicion")
        .addEventListener("click", function () {
          document
            .getElementById("overlayDefinicion")
            .classList.remove("activeOverlayDefinicion"); // Añadir clase para mostrar el overlay
        });

      //================================================================================================//
      //                               Fin de tarjetas de Actividades
      //================================================================================================//
    }
  });

//================================================================================================//
//                              funcion para el overlay
//================================================================================================//
// Función para mostrar el overlay con la descripción completa
function mostrarOverlay(descripcionCompleta) {
  //asignamos datos en el overlay
  console.log(descripcionCompleta);
  document.getElementById("descripcionCompleta").innerHTML = `
  <h1>Descripcion: </h1>
  ${descripcionCompleta}
  `
    ;
  //hacemos que el overlay sea visible
  document
    .getElementById("overlayDefinicion")
    .classList.add("activeOverlayDefinicion"); // Añadir clase para mostrar el overlay
}
//================================================================================================//
//                              fin funcion para el overlay
//================================================================================================//
// Función para comprobar si la imagen existe
const comprobarImagen = (url) => {
  return fetch(url, { method: 'HEAD' })   //se deja la ruta en el head para comprobar
    .then(res => res.ok)  //si responde pasamo que es ok
    .catch(() => false);  //si  no lo pasamos es false
};