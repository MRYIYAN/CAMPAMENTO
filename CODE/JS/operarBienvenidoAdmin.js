let planesDisponibles;
let gruposDisponibles;

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
    redirectWithTransition("../html/Bienvenido_admin.html"); // Redirigir a la página Bienvenido_admin
  });

  document.getElementById("btnModificarDatosPadre").addEventListener("click", () => {
    redirectWithTransition("../html/IndexAdmin.html"); // Redirigir a la página de modificación de datos del padre
  });

  document.getElementById("btnNotificaciones").addEventListener("click", () => {
    redirectWithTransition("../html/NotificacionesAdmin.html"); // Redirigir a la página de notificaciones
  });

  document.getElementById("btnMonitor").addEventListener("click", () => {
    redirectWithTransition("../html/infoMonitorAdmin.html"); // Redirigir a la página de información del monitor
  });

  document.getElementById("btnComedor").addEventListener("click", () => {
    redirectWithTransition("../html/comedorAdmin.html"); // Redirigir a la página de comedor
  });

  document.getElementById("btnGestionGrupos").addEventListener("click", () => {
    redirectWithTransition("../html/gestionGruposAdmin.html"); // Redirigir a la página de gestión de grupos
  });

  document.getElementById("btnGestionarNinos").addEventListener("click", () => {
    redirectWithTransition("../html/gestionNinosAdmin.html"); // Redirigir a la página de gestión de niños
  });

  document.getElementById("btnGestionarPlan").addEventListener("click", () => {
    redirectWithTransition("../html/gestionPlanAdmin.html"); // Redirigir a la página de gestión de planes
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


});

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



//-----------------------------------------------------------------------------------------------------------//
//                                           FIN DE JS DE NAVBAR
//-----------------------------------------------------------------------------------------------------------//



//================================================================================================//
//                            FIN DE FUNCION PARA ACTIVIDAD EN BBDD
//================================================================================================//



async function actualizarContraseña(){
  //hace el borado
  await fetch("../Server/GestionarIndexAdmin.php", {
      method: "POST", // Método de la solicitud
      headers: {
          "Content-type": "application/json", // Tipo de contenido de la solicitud
      },
      body: JSON.stringify({
          //enviamos datos para la consulta
          contraseñaParaCambiar2: document.getElementById('contrasenia2').value,
          idAdminCambiarContrasenia :id_adminGlobal
      }),
  })
      .then((response) => {
          if (!response.ok) {
              throw new Error("Error al obtener datos del servidor (2)."); // Manejo de error si la respuesta no es OK
          }
          return response.json(); // Convertir la respuesta a JSON
      })
      .then((data) => {
          let mensajeFeedbackOperar = document.getElementById(
              "mensajeFeedbackComprobarModificarContrasenia"
          ); //sacamos el div del html
          // Comprobar si hay un error en la respuesta
          if (data.error) {
              console.log("2Error: " + data.error); // Mostrar en consola el error
          } else {
              if (data.contraseniaAdminCambiado) {
                  if (data.contraseniaAdminCambiado == "ok") {
                      // Éxito
                      document.getElementById(
                          "errorModificarContraseniaGeneral"
                      ).innerHTML = "";
                      mensajeFeedbackOperar.style.display = "block";
                      mensajeFeedbackOperar.style.color = "green";
                      mensajeFeedbackOperar.innerText =
                          "Contraseña modificado con éxito 🎉";
                      // Deshabilitamos el botón
                      document.getElementById(
                          "cerrarComprobarContraseña"
                      ).disabled = true;
                      document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
                      // cerrar el overlay despues de 2s
                      setTimeout(() => {
                          mensajeFeedbackOperar.style.display =
                              "none";
                          document
                              .getElementById("overlayCambiarContraseña")
                              .classList.remove("activeOverlayCambiarContraseña"); // Quitar clase para ocultar el overlay
                          // habilitamos de nuevo el botón
                          document.getElementById(
                              "cerrarComprobarContraseña"
                          ).disabled = false;

                          cerrarSesionSeguro()  //cerramos el sesion 
                      }, 2000);
                  } else {
                     // fallo
                     document.getElementById(
                      "errorModificarContraseniaGeneral"
                  ).innerHTML = "";
                  mensajeFeedbackOperar.style.display = "block";
                  mensajeFeedbackOperar.style.color = "red";
                  mensajeFeedbackOperar.innerText =
                      "Contraseña no modificado";
                  // Deshabilitamos el botón
                  document.getElementById(
                      "cerrarComprobarContraseña"
                  ).disabled = true;
                  document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
                  // cerrar el overlay despues de 2s
                  setTimeout(() => {
                      mensajeFeedbackOperar.style.display =
                          "none";
                      document
                          .getElementById("overlayCambiarContraseña")
                          .classList.remove("activeOverlayCambiarContraseña"); // Quitar clase para ocultar el overlay
                      // habilitamos de nuevo el botón
                      document.getElementById(
                          "cerrarComprobarContraseña"
                      ).disabled = false;
                  }, 2000);
                  }
              
              }

          }
      })
}

//-----------------------------------------------------------------------------------------------------------//
  //PROTECCION DE RUTA Y EXTRAER EL ID
  //-----------------------------------------------------------------------------------------------------------//
  fetch("../Server/comprobacionSesionAdmin.php", {
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
      }
    })
    //-----------------------------------------------------------------------------------------------------------//
