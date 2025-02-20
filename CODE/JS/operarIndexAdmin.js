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

  document
    .getElementById("btnModificarDatosPadre")
    .addEventListener("click", () => {
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

  document.getElementById("btnCalendario").addEventListener("click", () => {
    redirectWithTransition("../html/calendarioAdmin.html"); // Redirigir a la página de calendario
  });

  document
    .getElementById("btnInfoActividades")
    .addEventListener("click", () => {
      redirectWithTransition("../html/infoActividadesAdmin.html"); // Redirigir a la página de actividades
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

//-----------------------------------------------------------------------------------------------------------//
//                                           INICIO DE CONTENIDO DEL HTML SACAR BBDD SE EJECUTTA
//-----------------------------------------------------------------------------------------------------------//

//CONEXION CON EL BBDD
// Conexión con el servidor para obtener datos del padre y sus hijos
fetch("../Server/GestionarIndexAdmin.php", {
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
      console.log(`idAdmin: ${data.id_admin}`);
      document.getElementById("idAdmin").innerHTML = data.info["id_admin"];
      document.getElementById("emailAdmin").innerHTML = data.info["email"];
      console.log(data.info);

      let arrayGrupos = data.grupos;
      gruposDisponibles = data.grupos; //asignamos al variable externo
      console.log(data.grupos);
      document.getElementById("selectGrupo").innerHTML = `
        <select name="selectGrupoS" id="selectGrupoS">
        <option value="0">Selecciona un grupo</option>
            ${arrayGrupos
              .map(
                (grupo) => `
                <option value="${grupo["id_grupo"]}">${grupo["nombre"]}</option>
            `
              )
              .join("")}
        </select>
        `;

      let arrayPlanFecha = data.planFecha;
      planesDisponibles = data.planFecha; //asignamos al variable externo
      document.getElementById("selectPlan").innerHTML = `
        <select name="selectPlanS" id="selectPlanS">
        <option value="0">Selecciona un Plan de fecha</option>
            ${arrayPlanFecha
              .map(
                (plan) => `
                <option value="${plan["id_plan"]}">${plan["fecha_inicio"]} - ${plan["fecha_fin"]}</option>
            `
              )
              .join("")}
        </select>
        `;
    }
  });

//funcion para mostrar el eror
function mostrarError(lugar, mensaje) {
  // Si el mensaje no está vacío, mostrar el error
  if (mensaje) {
    lugar.innerHTML = `
        <img src="../assets/icons/errorIcon.png" alt="error" id="errorIcon">
        ${mensaje}`;
    lugar.style.color = "red"; // Añadir estilo de color rojo para el mensaje de error
    //en caso si no hemos puesto el error
  } else {
    // Limpiar el contenido del lugar si no hay mensaje de error
    lugar.innerHTML = "";
  }
}

//-----------------------------------------------------------------------------------------------------------//
//                                      BOTON CONSSULTA DE ACTIVIDADES EN TABLA
//-----------------------------------------------------------------------------------------------------------//
document.getElementById("btnConsultarTabla").addEventListener("click", () =>{
    btnConsultarEnTabla()
});

function btnConsultarEnTabla(){
  //COMPROBACION SI ESTA TODO BIEN
  let okGrupo = false;
  let okPlan = false;
  //--------------------------------------------------------------------------------------------------------------
  //ESCOGEMOS LOS DATOS DEL GRUPO
  //--------------------------------------------------------------------------------------------------------------
  grupoSeleccionado = document.getElementById("selectGrupoS").value; // Asignar el valor del hijo seleccionado
  console.log("Grupo Seleccionado:" + grupoSeleccionado); // Mostrar en consola el ID del hijo seleccionado
  //comproabar si ha seleccionado o no
  if (grupoSeleccionado == 0) {
    //en caso de no
    mostrarError(
      document.getElementById("errorSelectGrupo"),
      "Por favor, Selecciona un grupo"
    );
    okGrupo = false;
    //en caso si cambia
    document
      .getElementById("selectGrupoS")
      .addEventListener("change", function () {
        grupoSeleccionado = this.value; // Asignar el valor del hijo seleccionado
        console.log("ID del niño seleccionado:" + grupoSeleccionado); // Mostrar en consola el ID del hijo seleccionado
        if (grupoSeleccionado == 0) {
          mostrarError(
            document.getElementById("errorSelectGrupo"),
            "Por favor, Selecciona un grupo"
          );
          okGrupo = false;
        } else {
          mostrarError(document.getElementById("errorSelectGrupo"), "");
          okGrupo = true;
        }
      });
  } else {
    mostrarError(document.getElementById("errorSelectGrupo"), "");
    okGrupo = true;
    //en caso si cambia
    document
      .getElementById("selectGrupoS")
      .addEventListener("change", function () {
        grupoSeleccionado = this.value; // Asignar el valor del hijo seleccionado
        console.log("ID del grupo seleccionado:" + grupoSeleccionado); // Mostrar en consola el ID del hijo seleccionado
        if (grupoSeleccionado == 0) {
          mostrarError(
            document.getElementById("errorSelectGrupo"),
            "Por favor, Selecciona un grupo"
          );
          okGrupo = false;
        } else {
          mostrarError(document.getElementById("errorSelectGrupo"), "");
          okGrupo = true;
        }
      });
  }
  //--------------------------------------------------------------------------------------------------------------
  //ESCOGEMOS DATOS DEL PLAN
  //--------------------------------------------------------------------------------------------------------------
  let id_actividadSeleccionada = 0;
  planSeleccionado = document.getElementById("selectPlanS").value; // Asignar el valor del hijo seleccionado
  console.log("Plan Seleccionado:" + planSeleccionado); // Mostrar en consola el ID del hijo seleccionado
  if (planSeleccionado == 0) {
    mostrarError(
      document.getElementById("errorSelectPlan"),
      "Por favor, Selecciona un Plan"
    );
    okPlan = false;
    //en caso si cambia
    //comprobamos cada vez que se cambia
    document
      .getElementById("selectPlanS")
      .addEventListener("change", function () {
        planSeleccionado = this.value; // Asignar el valor del hijo seleccionado
        console.log("ID del plan seleccionado:" + planSeleccionado); // Mostrar en consola el ID del hijo seleccionado
        if (grupoSeleccionado == 0) {
          mostrarError(
            document.getElementById("errorSelectPlan"),
            "Por favor, Selecciona un plan"
          );
          okGrupo = false;
        } else {
          mostrarError(document.getElementById("errorSelectPlan"), "");
          okGrupo = true;
        }
      });
  } else {
    mostrarError(document.getElementById("errorSelectPlan"), "");
    okPlan = true;
    //en caso si cambia
    document
      .getElementById("selectPlanS")
      .addEventListener("change", function () {
        planSeleccionado = this.value; // Asignar el valor del hijo seleccionado
        console.log("ID del plan seleccionado:" + planSeleccionado); // Mostrar en consola el ID del hijo seleccionado
        if (grupoSeleccionado == 0) {
          mostrarError(
            document.getElementById("errorSelectPlan"),
            "Por favor, Selecciona un plan"
          );
          okGrupo = false;
        } else {
          mostrarError(document.getElementById("errorSelectPlan"), "");
          okGrupo = true;
        }
      });
  }
  //--------------------------------------------------------------------------------------------------------------

  //==============================================================================================================
  // OPERAMOS EN EL FETCH PARA SACAR EL LISTADO DEL LOS ACTIVIDADES
  //==============================================================================================================
  //comprobamos si todo los datos insertado esta bien
  if (okGrupo !== false && okPlan !== false) {
    console.log(
      `Consultar para plan: ${planSeleccionado} y grupo: ${grupoSeleccionado}`
    );

    //haccemos consulta al bbdd
    fetch("../Server/GestionarIndexAdmin.php", {
      method: "POST", // Método de la solicitud
      headers: {
        "Content-type": "application/json", // Tipo de contenido de la solicitud
      },
      body: JSON.stringify({
        //enviamos datos para la consulta
        planSeleccionado: planSeleccionado,
        grupoSeleccionado: grupoSeleccionado,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener datos del servidor (2)."); // Manejo de error si la respuesta no es OK
        }
        return response.json(); // Convertir la respuesta a JSON
      })
      .then((data) => {
        // Comprobar si hay un error en la respuesta
        if (data.error) {
          console.log("2Error: " + data.error); // Mostrar en consola el error
        } else {
          console.log(data.datosTabla);
          //comprobamos si el resultado es 0 o no
          if (data.datosTabla.length == 0) {
            //en caso si es vacio
            document.getElementById("tablaActividad").classList.add("oculto"); // Ocultar el tabla

            document.getElementById("infoTabla").innerText =
              "No tiene ningun actividad";
          } else {
            //en caso si hay respuesta
            document
              .getElementById("tablaActividad")
              .classList.remove("oculto"); // mostramos la tabla
            document.getElementById("infoTabla").innerText = "";

            //imprimimos la lista de actividades
            const tabla = document
              .getElementById("tablaActividad")
              .getElementsByTagName("tbody")[0]; // Obtener el cuerpo de la tabla
            tabla.innerHTML = ""; // Limpiar el contenido anterior de la tabla

            //iteramos la respuesta
            data.datosTabla.forEach((actividad) => {
              const nuevaFila = tabla.insertRow(); // Crear una nueva fila en la tabla

              const celda1 = nuevaFila.insertCell(); // Crear la primera celda
              celda1.innerHTML = `${actividad.titulo}`; // Introducir información en la primera celda

              const celda2 = nuevaFila.insertCell(); // Crear la segunda celda
              celda2.innerHTML = `${actividad.hora} - ${actividad.hora_fin}`; // Introducir información en la segunda celda

              const celda3 = nuevaFila.insertCell(); // Crear la tercera celda
              //creamos un boton donde al hacer el clic envia el descripcion que quiere imprimir en el overlay
              celda3.innerHTML = `<button class="verMasBtn" onclick="mostrarOverlay('${actividad.descripcion}') ">Ver más</button>`; // Introducir información en la tercera celda

              const celda4 = nuevaFila.insertCell(); // Crear la cuarta celda
              celda4.innerHTML = `${actividad.dia}`; // Introducir información en la cuarta celda

              const celda5 = nuevaFila.insertCell(); // Crear la cuarta celda
              celda5.innerHTML = `<button class="verMasBtn" onclick="mostrarOverlayOperar('${actividad.id_actividad}') ">Operar</button>`; // boton para operar
            });
          }
        }
      });
  }
}

//================================================================================================//
//                              FUNCION PARA MOSTRAR OVERLAY DE DEFINICION
//================================================================================================//
// Función para mostrar el overlay con la descripción completa
function mostrarOverlay(descripcionCompleta) {
  //asignamos datos en el overlay
  console.log(descripcionCompleta);
  document.getElementById("descripcionCompleta").innerHTML = `
  <h1>Descripcion: </h1>
  ${descripcionCompleta}
  `;
  //hacemos que el overlay sea visible
  document
    .getElementById("overlayDefinicion")
    .classList.add("activeOverlayDefinicion"); // Añadir clase para mostrar el overlay
}

// Función para cerrar el overlay
document
  .querySelector(".closeBtnDefinicion")
  .addEventListener("click", function () {
    document
      .getElementById("overlayDefinicion")
      .classList.remove("activeOverlayDefinicion"); // Añadir clase para mostrar el overlay
  });
//================================================================================================//
//                               FIN FUNCION PARA MOSTRAR OVERLAY DE DEFINICION
//================================================================================================//

//================================================================================================//
//                              FUNCION PARA MOSTRAR OVERLAY DE OPERAR
//================================================================================================//

let fodoActividad = "../assets/actividad/uploads/defaultActividad.png";

// Función para mostrar el overlay con la OPERAR
function mostrarOverlayOperar(id_actividad) {
  id_actividadSeleccionada = id_actividad;
  //hacemos una consuta a bbdd para sacar todo los informaciones de esa actividad
  //haccemos consulta al bbdd
  fetch("../Server/GestionarIndexAdmin.php", {
    method: "POST", // Método de la solicitud
    headers: {
      "Content-type": "application/json", // Tipo de contenido de la solicitud
    },
    body: JSON.stringify({
      //enviamos datos para la consulta
      id_actividad: id_actividad,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener datos del servidor (2)."); // Manejo de error si la respuesta no es OK
      }
      return response.json(); // Convertir la respuesta a JSON
    })
    .then((data) => {
      // Comprobar si hay un error en la respuesta
      if (data.error) {
        console.log("2Error: " + data.error); // Mostrar en consola el error
      } else {
        //asignamos a un variable que esta fuera la ruta de fotode actividad la ruta de avatar que esta en bbdd
        if (data.infoActividad["imagen_src"]) {
          //comprobamos si existe el avatar en bbdd o no, en caso de que sea nulo, no asignaria y usaria el default
          fodoActividad = data.infoActividad["imagen_src"]; //en caso de que si existiera avatar en bbdd se asignaria en bbdd
        }

        fecha_inicio = data.fechaActiviad["fecha_inicio"];
        fecha_fin = data.fechaActiviad["fecha_fin"];

        console.log("Fechas :" + data.fechaActiviad);
        console.log(data.fechaActiviad);

        //RECIBIENDO RESPUESTA DE BBDD
        console.log(data.infoActividad);

        //imprimir el contenido del bbdd al html
        document.getElementById("id_activiadad").value =
          data.infoActividad["id_actividad"];
        document.getElementById("titulo").value = data.infoActividad["titulo"];
        document.getElementById("hora_inicio").value = data.infoActividad[
          "hora"
        ].slice(0, 5); //hay que transformar en hh:mm
        document.getElementById("hora_fin").value = data.infoActividad[
          "hora_fin"
        ].slice(0, 5);
        document.getElementById("descripcion").value =
          data.infoActividad["descripcion"];
        document.getElementById("fecha").value = data.infoActividad["dia"];

        //VER AVATAR VISTA PREVIA
        //----------------------------------------------------------------------------------------------------------------------------------//
        document.getElementById("vistaPrevia").src = fodoActividad; //modificamos el src de del img vacio en el html, con avatarbbdd podemos sacar la ruta del avatar que esta en bbdd
        document.getElementById("vistaPrevia").style.display = "block"; //mostramos el img para la vista previa que esta en html como un bloqu
        document
          .getElementById("avatar")
          .addEventListener("change", function (event) {
            //escogemos el archivo seleccionado
            const file = event.target.files[0];
            // comprobamos si existe o no el archivo
            if (file) {
              //en caso de existir (adjuntado)
              document.getElementById("vistaPrevia").src =
                URL.createObjectURL(file); //modificamos el src de del img vacio en el html, con URL.createObjectURL(file) podemos sacar la ruta del archivo adjuntado
              document.getElementById("vistaPrevia").style.display = "block"; //mostramos el img para la vista previa que esta en html como un bloqu
            } else {
              //en caso si no existe el archivo (no ha adjuntado)
              document.getElementById("vistaPrevia").src = avatarbbdd; //modificamos el src de del img vacio en el html, con avatarbbdd podemos sacar la ruta del avatar que esta en bbdd
              document.getElementById("vistaPrevia").style.display = "block"; //mostramos el img para la vista previa que esta en html como un bloqu
            }
          });
        //----------------------------------------------------------------------------------------------------------------------------------//
      }
    });

  //hacemos que el overlay sea visible
  document.getElementById("overlayOperar").classList.add("activeOverlayOperar"); // Añadir clase para mostrar el overlay

  // Función para cerrar el overlay
  document
    .querySelector(".closeBtnOperar")
    .addEventListener("click", function () {
      document
        .getElementById("overlayOperar")
        .classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
    });
}

//metodo para cerrar el overlay de operar
function cerrarOverlayOperar() {
  document
    .getElementById("overlayOperar")
    .classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
}

//================================================================================================//
//                               FUNCIONES DE VERTIFICACION DE CAMPO
//================================================================================================//
//comprobar el nombre
function vertificarNombre() {
  if (document.getElementById("titulo").value.trim() == "") {
    mostrarError(
      document.getElementById("errorTitulo"),
      "El Nombre no puede ser Vacio"
    );
  } else {
    mostrarError(document.getElementById("errorTitulo"), "");
  }
}
//comprobar el descripcion
function vertificarDescripcion() {
  if (document.getElementById("descripcion").value.trim() == "") {
    mostrarError(
      document.getElementById("errorDescripcion"),
      "El Descripcion no puede estar vacio"
    );
  } else {
    mostrarError(document.getElementById("errorDescripcion"), "");
  }
}
//comprobar la fecha seleccionada
function verificarFecha() {
  let inputFecha = document.getElementById("fecha").value;
  let errorFecha = document.getElementById("errorFecha");
  if (inputFecha) {
    mostrarError(errorFecha, "");
    // Convertimos las fechas a objetos Date
    let fechaSeleccionada = new Date(inputFecha);
    let fechaInicio = new Date(fecha_inicio);
    let fechaFin = new Date(fecha_fin);
    // Comprobamos si está en el intervalo de tiempo o no
    if (fechaSeleccionada >= fechaInicio && fechaSeleccionada <= fechaFin) {
      mostrarError(errorFecha, "");
    } else {
      mostrarError(errorFecha, `Intervalo de ${fecha_inicio} - ${fecha_fin}`);
    }
  } else {
    mostrarError(errorFecha, "La fecha no puede estar vacía");
  }
}
//comprobar la hora
function vertificarHoraInicio() {
  let horaInicio = document.getElementById("hora_inicio").value;
  let horaFin = document.getElementById("hora_fin").value;
  let errorHora = document.getElementById("errorHoraFin");
  //en caso si no existe la hora
  if (!horaInicio) {
    mostrarError(errorHora, "La hora no está definida");
    return;
  }
  //en caso de si existe
  mostrarError(errorHora, ""); // Limpiar errores previos
  //comparamos el antes y el tras
  if (horaInicio && horaFin) {
    // Convertir las horas a objetos de fecha para comparar correctamente
    let inicio = new Date(`1970-01-01T${horaInicio}:00`); //un dia aleatoria pero tiene que ser iguales
    let fin = new Date(`1970-01-01T${horaFin}:00`);

    if (inicio >= fin) {
      mostrarError(errorHora, "La hora de inicio debe ser menor que la de fin");
    } else {
      mostrarError(errorHora, ""); // Limpiar errores previos
    }
  }
}
function vertificarHoraFin() {
  let horaInicio = document.getElementById("hora_inicio").value;
  let horaFin = document.getElementById("hora_fin").value;
  let errorHoraFin = document.getElementById("errorHoraFin");
  //en caso si no existe la hora fin
  if (!horaFin) {
    mostrarError(errorHoraFin, "La hora no está definida");
    return;
  }
  //en caso de si existe
  mostrarError(errorHoraFin, ""); // Limpiar errores previos
  //comparamos el antes y el tras
  if (horaInicio && horaFin) {
    // Convertir las horas a objetos de fecha para comparar correctamente
    let inicio = new Date(`1970-01-01T${horaInicio}:00`); //un dia aleatoria pero tiene que ser iguales
    let fin = new Date(`1970-01-01T${horaFin}:00`);

    if (inicio >= fin) {
      mostrarError(
        errorHoraFin,
        "La hora de fin debe ser mayor que la de inicio"
      );
    } else {
      mostrarError(errorHoraFin, ""); // Limpiar errores previos
    }
  }
}

//comprobacion del select del grupo
function vertificarSeleccionGrupoOperar() {
  grupoSeleccionadoOperar = document.getElementById("selectGrupoOperar").value; // Asignar el valor del hijo seleccionado
  if (grupoSeleccionadoOperar == 0) {
    mostrarError(
      document.getElementById("errorCambiarGrupo"),
      "Por favor, elige un grupo para cambiar"
    );
  } else {
    mostrarError(document.getElementById("errorCambiarGrupo"), "");
  }
}

//comprobacion del select del plan
function vertificarSeleccionPlanOperar() {
  planSeleccionadoOperar = document.getElementById("selectPlanOperar").value; // Asignar el valor del hijo seleccionado
  if (planSeleccionadoOperar == 0) {
    mostrarError(
      document.getElementById("errorCambiarPlan"),
      "Por favor, elige un plan para cambiar"
    );
  } else {
    mostrarError(document.getElementById("errorCambiarPlan"), "");
  }
}

//comprobacion en live cuando escribimos
document.getElementById("titulo").oninput = vertificarNombre;
document.getElementById("hora_inicio").oninput = vertificarHoraInicio;
document.getElementById("hora_fin").oninput = vertificarHoraFin;
document.getElementById("descripcion").oninput = vertificarDescripcion;
document.getElementById("fecha").oninput = verificarFecha;

//comprobacion cuando perdemos el foco
document.getElementById("titulo").onblur = vertificarNombre;
document.getElementById("hora_inicio").onblur = vertificarHoraInicio;
document.getElementById("hora_fin").onblur = vertificarHoraFin;
document.getElementById("descripcion").onblur = vertificarDescripcion;
document.getElementById("fecha").onblur = verificarFecha;

//================================================================================================//
//                              FIN DE FUNCIONES DE VERTIFICACION DE CAMPO
//================================================================================================//
//================================================================================================//
//                              RADIOBUTTONS
//================================================================================================//
let cambiarPlan = "no";
let cambiarGrupo = "no";
// Escuchar cambios en los radio buttons dinámicamente (event delegation)
document.addEventListener("change", function (event) {
  if (event.target.name === "cambiarPlan") {
    let espacioCambiarPlan = document.getElementById("espacioCambiarPlan");

    if (event.target.value === "si") {
      cambiarPlan = "si"; //asignamos al un variable externo
      // Construir el select con los planes disponibles
      espacioCambiarPlan.innerHTML = `
                <label for="selectPlanOperar">Selecciona un Plan de Fecha:</label>
                <select name="selectPlanOperar" id="selectPlanOperar">
                    <option value="0">Selecciona un Plan de fecha</option>
                    ${planesDisponibles
                      .map(
                        (plan) =>
                          `<option value="${plan.id_plan}">${plan.fecha_inicio} - ${plan.fecha_fin}</option>`
                      )
                      .join("")}
                </select>
            `;
      //comprobamos y validamos
      document.getElementById("selectPlanOperar").onchange =
        vertificarSeleccionPlanOperar;
      document.getElementById("selectPlanOperar").onblur =
        vertificarSeleccionPlanOperar;
    } else {
      cambiarPlan = "no";
      espacioCambiarPlan.innerHTML = ""; // Limpiar el contenido si elige "No"
      //borrar el error
      if (document.getElementById("errorCambiarPlan")) {
        mostrarError(document.getElementById("errorCambiarPlan"), "");
      }
    }
  }
});

// Para cambiar de grupo, usamos el mismo método
document.addEventListener("change", function (event) {
  if (event.target.name === "cambiarGrupo") {
    let espacioCambiarGrupo = document.getElementById("espacioCambiarGrupo");

    if (event.target.value === "si") {
      cambiarGrupo = "si";
      espacioCambiarGrupo.innerHTML = `
                <label for="selectGrupoOperar">Selecciona un grupo:</label>
                <select name="selectGrupoOperar" id="selectGrupoOperar">
                    <option value="0">Selecciona un grupo</option>
                    ${gruposDisponibles
                      .map(
                        (grupo) =>
                          `<option value="${grupo.id_grupo}">${grupo.nombre}</option>`
                      )
                      .join("")}
                </select>
            `;
      //comprobamos y validamos
      document.getElementById("selectGrupoOperar").onchange =
        vertificarSeleccionGrupoOperar;
      document.getElementById("selectGrupoOperar").onblur =
        vertificarSeleccionGrupoOperar;
    } else {
      cambiarGrupo = "no";
      espacioCambiarGrupo.innerHTML = ""; // Limpiar el contenido si elige "No"
      if (document.getElementById("errorCambiarGrupo")) {
        mostrarError(document.getElementById("errorCambiarGrupo"), "");
      }
    }
  }
});

//================================================================================================//
//                             FFIN DE RADIOBUTTONS
//================================================================================================//

//
//================================================================================================//
//                             FUNCION PARA COMPROBAR SI HAY ERROR O NO
//================================================================================================//
// Función para comprobar si los elementos de error están vacíos
function checkError(element) {
  return element && element.textContent.trim() === "";
}
//================================================================================================//
//                             FIN DE FUNCION PARA COMPROBAR SI HAY ERROR O NO
//================================================================================================//

//================================================================================================//
//                             CUANDO HACE EL SUBMT DESDE OVERLAY DE OPERAR
//================================================================================================//
let formularioOperar = document.getElementById("formularioOperarActividad");
formularioOperar.onsubmit = async function (event) {
  // Prevenir el envío del formulario al inicio
  event.preventDefault();

  //comprobamos los variables
  //comprobacion en live cuando escribimos
  vertificarNombre();
  vertificarHoraInicio();
  vertificarHoraFin();
  vertificarDescripcion();
  verificarFecha();
  if (cambiarPlan == "si") {
    vertificarSeleccionPlanOperar();
  }
  if (cambiarGrupo == "si") {
    vertificarSeleccionGrupoOperar();
  }

  //comprobamos si hay error de validacion
  if (
    checkError(document.getElementById("errorTitulo")) &&
    checkError(document.getElementById("errorHora")) &&
    checkError(document.getElementById("errorHoraFin")) &&
    checkError(document.getElementById("errorDescripcion")) &&
    checkError(document.getElementById("errorFecha")) &&
    checkError(document.getElementById("errorFoto"))
  ) {
    //si hemos seleccionado el cambiar plan
    if (cambiarPlan == "si") {
      if (checkError(document.getElementById("errorCambiarPlan"))) {
        //PASO SIGUIENTE

        mostrarError(document.getElementById("errorModificar"), "");
        actualizarActividad();
      } else {
        mostrarError(
          document.getElementById("errorModificar"),
          "El formulario contiene errores"
        );
      }
      //si seleccionamos que no quiero cambiar
    }
    //si hemos seleccionado el cambiar grupo
    if (cambiarGrupo == "si") {
      if (checkError(document.getElementById("errorCambiarGrupo"))) {
        //PASO SIGUIENTE

        mostrarError(document.getElementById("errorModificar"), "");
        actualizarActividad();
      } else {
        mostrarError(
          document.getElementById("errorModificar"),
          "El formulario contiene errores"
        );
      }
      //si seleccionamos que no quiero cambiar
    }

    //en caso si no ha solicitado cambio
    if (cambiarPlan !== "si" && cambiarGrupo !== "si") {
      //PASO SIGUIENTE

      mostrarError(document.getElementById("errorModificar"), "");
      actualizarActividad();
    }
  } else {
    mostrarError(
      document.getElementById("errorModificar"),
      "El formulario contiene errores"
    );
  }
};

//================================================================================================//
//                             FIN DE CUANDO HACE EL SUBMT DESDE OVERLAY DE OPERAR
//================================================================================================//

//================================================================================================//
//                            UPDATE DE BBDD DEL ACTIVIDAD
//================================================================================================//
function actualizarActividad() {
  console.log(`id_actividadSeleccionado = ${id_actividadSeleccionada}`);
  console.log(`titulo: ${document.getElementById("titulo").value}`);
  console.log(`Hora inicio: ${document.getElementById("hora_inicio").value}`);
  console.log(`Hora fin: ${document.getElementById("hora_fin").value}`);
  console.log(`descripcion: ${document.getElementById("descripcion").value}`);
  console.log(`fecha: ${document.getElementById("fecha").value}`);
  console.log(`quiereCambiar Grupo? : ${cambiarGrupo}`);
  if (cambiarGrupo == "si") {
    console.log(`grupo cambiar a id: ${grupoSeleccionadoOperar}`);
  }
  console.log(`quiereCambiar Plan? : ${cambiarPlan}`);
  if (cambiarPlan == "si") {
    console.log(`grupo cambiar a id: ${planSeleccionadoOperar}`);
  }

  //PREPARAMOS LOS DATOS PARA ENVIAR AL SERVIDOR CON FETCH PARA HACER EL UBDATE
  let formData = new FormData();
  formData.append("id_actividadSeleccionado", id_actividadSeleccionada);
  formData.append("titulo", document.getElementById("titulo").value);
  formData.append("hora_inicio", document.getElementById("hora_inicio").value);
  formData.append("hora_fin", document.getElementById("hora_fin").value);
  formData.append("descripcion", document.getElementById("descripcion").value);
  formData.append("fecha", document.getElementById("fecha").value);
  formData.append("cambiarGrupo", cambiarGrupo);
  formData.append("cambiarPlan", cambiarPlan);

  //en caso si queire cambiar el grupo del actividad
  if (cambiarGrupo == "si") {
    formData.append("grupoSeleccionadoOperar", grupoSeleccionadoOperar);
  }

  //en caos si quiere cambiar el plan del actividad
  if (cambiarPlan == "si") {
    formData.append("planSeleccionadoOperar", planSeleccionadoOperar);
  }

  // Solo agregar el avatar si hay uno seleccionado
  let avatarInput = document.getElementById("avatar");
  if (avatarInput.files.length > 0) {
    //en caso si hay contenido en el input
    formData.append("foto", avatarInput.files[0]); //pasamos el file al php
    formData.append("cambiarfoto", true); //pasamos un booleano dicidendo que hay que modificar el perfil
  } else {
    //en caso si no hay nada en el input
    formData.append("fodoActividad", fodoActividad); //pasamos la ruta de avatar que esta en el bbdd
    formData.append("cambiarFoto", false); //pasamos un boleano para decir que no hay que cambiar nada
  }


  //FETCH PARA ENVIAR LOS MODIFICACIONES AL BBDD
  fetch("../Server/GestionarIndexAdmin.php", {
    method: "POST",
    //enviamos los datos
    body: formData,
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
        //en caso de si tener error
        console.log("Error: " + data.error);
      } else {
        if (data.modificado){
            if (data.modificado == "ok"){
                console.log("modificado")
                btnConsultarEnTabla()
                //cerrar el overlay de operar
                document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
            }else{
                console.log('no modificado')
            }
        }
      }
    });
}
//================================================================================================//
//                            FIN DE UPDATE DE BBDD DEL ACTIVIDAD
//================================================================================================//

//================================================================================================//
//                            BORRAR UN ACTIVIDAD EN BBDD
//================================================================================================//
//cuando damos el bton eliminar
document.getElementById('btnEliminarActividad').addEventListener('click', ()=>{
    //hacemos que el overlay de comprobacion sea visible
    document.getElementById("overlaySeguroBorrar").classList.add("activeOverlaySeguroBorrar"); // Añadir clase para mostrar el overlay
})
//cuando damos al x del overlay de borrar
document.querySelector('.closeBtnSeguroBorrar').addEventListener('click', ()=>{
    //hacemos que el overlay de comprobacion sea escondido
    document.getElementById("overlaySeguroBorrar").classList.remove("activeOverlaySeguroBorrar"); // Añadir clase para mostrar el overlay
})
//cuando damos el boton de volver en overlay 
document.getElementById('cancelarBorrar').addEventListener('click', ()=>{
    //hacemos que el overlay de comprobacion sea escondido
    document.getElementById("overlaySeguroBorrar").classList.remove("activeOverlaySeguroBorrar"); // Añadir clase para mostrar el overlay
})

//cuando esta seguro de que queiro borrar
document.getElementById('confirmadoBorrar').addEventListener('click', ()=>{
    //hacemos que el overlay de comprobacion sea escondido
    borrarActividadBBDD();
    document.getElementById("overlaySeguroBorrar").classList.remove("activeOverlaySeguroBorrar"); // Añadir clase para mostrar el overlay
})



function borrarActividadBBDD(){
    console.log(`id_actividadSeleccionado = ${id_actividadSeleccionada}`);
    //haccemos consulta al bbdd
  fetch("../Server/GestionarIndexAdmin.php", {
    method: "POST", // Método de la solicitud
    headers: {
      "Content-type": "application/json", // Tipo de contenido de la solicitud
    },
    body: JSON.stringify({
      //enviamos datos para la consulta
      id_actividadSeleccionadaParaBorrar: id_actividadSeleccionada
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener datos del servidor (2)."); // Manejo de error si la respuesta no es OK
      }
      return response.json(); // Convertir la respuesta a JSON
    })
    .then((data) => {
      // Comprobar si hay un error en la respuesta
      if (data.error) {
        console.log("2Error: " + data.error); // Mostrar en consola el error
      } else {
        if (data.borrado){
            if (data.borrado == 'ok'){
                console.log('borrado')
                btnConsultarEnTabla()
                //cerrar el overlay de operar
                document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
            }else{
                console.log('no borrado')
            }
        }
      }
    });
}