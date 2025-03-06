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
    redirectWithTransition("../html/IndexAdmin.html"); // Redirigir a la página Inndex
  });

  document
    .getElementById("btnModificarDatosPadre")
    .addEventListener("click", () => {
      redirectWithTransition("../html/IndexAdmin.html"); // Redirigir a la página de modificación de datos del padre
    });



  document.getElementById("btnMonitor").addEventListener("click", () => {
    redirectWithTransition("../html/infoMonitorAdmin.html"); // Redirigir a la página de información del monitor
  });


  document.getElementById("btnComedor").addEventListener("click", () => {
    redirectWithTransition("../html/comedorAdmin.html"); // Redirigir a la página de comedor
  });

  document.getElementById("btnGestionGrupos").addEventListener("click", () => {
    redirectWithTransition("../html/gestionGruposAdmin.html"); // Redirigir a la página de calendario
  });

  document.getElementById("btnGestionarNinos").addEventListener("click", () => {
    redirectWithTransition("../html/gestionNinosAdmin.html"); // Redirigir a la página de calendario
  });

  document
    .getElementById("btnGestionarPlan")
    .addEventListener("click", () => {
      redirectWithTransition("../html/gestionPlanAdmin.html"); // Redirigir a la página de actividades
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

//-----------------------------------------------------------------------------------------------------------//
//                                           INICIO DE CONTENIDO DEL HTML SACAR BBDD SE EJECUTTA
//-----------------------------------------------------------------------------------------------------------//

//CONEXION CON EL BBDD
let id_adminGlobal = null
repintarListaSelect();
function repintarListaSelect() {
  // Conexión con el servidor para obtener datos del admin
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
        id_adminGlobal = data.id_admin; //asignamos al variable global
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
                <option value="${plan["id_plan"]}">${plan.nombre}(${plan["fecha_inicio"]} - ${plan["fecha_fin"]})</option>
            `
            )
            .join("")}
        </select>
        `;
      }
    });
}


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
document.getElementById("btnConsultarTabla").addEventListener("click", () => {
  btnConsultarEnTabla()
});

let planSeleccionado;
function btnConsultarEnTabla() {
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
            document.getElementById('contenedorBotonAgregaractividad').innerHTML = `<button type="button" id="botonAgregaractividad" onclick = "agregarActividad()">Agregar Actividad</button>`;
            document.getElementById("infoTabla").innerText =
              "No tiene ningun actividad";
          } else {
            //en caso si hay respuesta
            document
              .getElementById("tablaActividad")
              .classList.remove("oculto"); // mostramos la tabla
            document.getElementById("infoTabla").innerText = "";
            document.getElementById('contenedorBotonAgregaractividad').innerHTML = `<button type="button" id="botonAgregaractividad" onclick = "agregarActividad()">Agregar Actividad</button>`;

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
              celda5.innerHTML = `<button class="verMasBtn" onclick="mostrarOverlayOperar('${actividad.id_actividad}') ">Modificar</button>`; // boton para operar
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

//sacamos los fecjas 
let fechaInicioBBDD;
let fechaFinBBDD;
let fodoActividad = "../assets/actividad/uploads/defaultActividad.png";

// Función para mostrar el overlay con la OPERAR
function mostrarOverlayOperar(id_actividad) {
  limpiarFormularioOperar()
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

        //sacamos los fecjas 
        fechaInicioBBDD = data.fechaActiviad['fecha_inicio']
        fechaFinBBDD = data.fechaActiviad['fecha_fin'];
        console.log(`Fecha Inicio = ${data.fechaActiviad['fecha_inicio']}`)
        console.log(`Fecha Fin = ${data.fechaActiviad['fecha_fin']}`)
        //asignamos a un variable que esta fuera la ruta de fotode actividad la ruta de avatar que esta en bbdd
        if (data.infoActividad["imagen_src"]) {
          //comprobamos si existe el avatar en bbdd o no, en caso de que sea nulo, no asignaria y usaria el default
          fodoActividad = data.infoActividad["imagen_src"]; //en caso de que si existiera avatar en bbdd se asignaria en bbdd
        }

        //receteamos el formulario
        vaciarCamposFormulario();
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
  document.getElementById('mensajeFeedbackAgregarActividad').style.display = "none"
  document.body.classList.add("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento
  document.getElementById('btnEliminarActividad').classList.remove("oculto")
  document.getElementById('btnModificarActividad').classList.remove("oculto") //mostramos el boton de modificar
  document.getElementById('btnInsertarActividad').classList.add("oculto") //quitamos el boton de modificar
  document.querySelector('.contenedorBotones').classList.remove("oculto")


  // Función para cerrar el overlay
  document
    .querySelector(".closeBtnOperar")
    .addEventListener("click", function () {
      document
        .getElementById("overlayOperar")
        .classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
      document.body.classList.remove("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento

    });
}

//metodo para cerrar el overlay de operar
function cerrarOverlayOperar() {
  document
    .getElementById("overlayOperar")
    .classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
  document.body.classList.remove("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento

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
    let fechaInicio = new Date(fechaInicioBBDD);
    let fechaFin = new Date(fechaFinBBDD);
    // Comprobamos si está en el intervalo de tiempo o no
    if (fechaSeleccionada >= fechaInicio && fechaSeleccionada <= fechaFin) {
      mostrarError(errorFecha, "");
    } else {
      mostrarError(errorFecha, `Intervalo de ${fechaInicioBBDD} - ${fechaFinBBDD}`);
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
  if (document.getElementById("selectGrupoOperar")) {
    grupoSeleccionadoOperar = document.getElementById("selectGrupoOperar").value; // Asignar el valor del hijo seleccionado
    if (grupoSeleccionadoOperar == 0) {
      mostrarError(
        document.getElementById("errorCambiarGrupo"),
        "Por favor, elige un grupo para cambiar"
      );
    } else {
      mostrarError(document.getElementById("errorCambiarGrupo"), "");
    }
  } else {
    mostrarError(document.getElementById("errorCambiarGrupo"), "");
  }

}

//comprobacion del select del plan
function vertificarSeleccionPlanOperar() {
  if (document.getElementById("selectPlanOperar")) {
    planSeleccionadoOperar = document.getElementById("selectPlanOperar").value; // Asignar el valor del hijo seleccionado
    if (planSeleccionadoOperar == 0) {
      mostrarError(
        document.getElementById("errorCambiarPlan"),
        "Por favor, elige un plan para cambiar"
      );
    } else {
      mostrarError(document.getElementById("errorCambiarPlan"), "");
    }
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
              `<option value="${plan.id_plan}">${plan.nombre} = ${plan.fecha_inicio} - ${plan.fecha_fin}</option>`
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
  console.log(`id_actividadSeleccionado PARA ACTUALIZAR ES  = ${id_actividadSeleccionada}`);
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
        if (data.modificado) {
          if (data.modificado == "ok") {


            document.getElementById('mensajeFeedbackAgregarActividad').style.display = "block";
            document.getElementById('mensajeFeedbackAgregarActividad').style.color = "green";
            document.getElementById('mensajeFeedbackAgregarActividad').innerText =
              "Actividad Modificado con éxito 🎉";
            console.log("modificado")
            btnConsultarEnTabla()


            setTimeout(() => {
              mensajeFeedbackPlan.style.display = "none";
              //cerrar el overlay de operar
              document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
              document.body.classList.remove("body-fondo-bloqueado"); // bloquea el fondo y el desplazamie
            }, 2000);

          } else {

            document.getElementById('mensajeFeedbackAgregarActividad').style.display = "block";
            document.getElementById('mensajeFeedbackAgregarActividad').style.color = "red";
            document.getElementById('mensajeFeedbackAgregarActividad').innerText =
              "actividad no modificado";
            console.log("insertado")
            btnConsultarEnTabla()


            setTimeout(() => {
              mensajeFeedbackPlan.style.display = "none";
              //cerrar el overlay de operar
              document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
              document.body.classList.remove("body-fondo-bloqueado"); // bloquea el fondo y el desplazamie
            }, 2000);
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
document.getElementById('btnEliminarActividad').addEventListener('click', () => {
  //hacemos que el overlay de comprobacion sea visible
  document.getElementById("overlaySeguroBorrar").classList.add("activeOverlaySeguroBorrar"); // Añadir clase para mostrar el overlay
})
//cuando damos al x del overlay de borrar
document.querySelector('.closeBtnSeguroBorrar').addEventListener('click', () => {
  //hacemos que el overlay de comprobacion sea escondido
  document.getElementById("overlaySeguroBorrar").classList.remove("activeOverlaySeguroBorrar"); // Añadir clase para mostrar el overlay
})
//cuando damos el boton de volver en overlay 
document.getElementById('cancelarBorrar').addEventListener('click', () => {
  //hacemos que el overlay de comprobacion sea escondido
  document.getElementById("overlaySeguroBorrar").classList.remove("activeOverlaySeguroBorrar"); // Añadir clase para mostrar el overlay
})

//cuando esta seguro de que queiro borrar
document.getElementById('confirmadoBorrar').addEventListener('click', () => {
  //hacemos que el overlay de comprobacion sea escondido
  borrarActividadBBDD();
  document.getElementById("overlaySeguroBorrar").classList.remove("activeOverlaySeguroBorrar"); // Añadir clase para mostrar el overlay
})



function borrarActividadBBDD() {
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
        if (data.borrado) {
          if (data.borrado == 'ok') {

            document.getElementById('mensajeFeedbackAgregarActividad').style.display = "block";
            document.getElementById('mensajeFeedbackAgregarActividad').style.color = "green";
            document.getElementById('mensajeFeedbackAgregarActividad').innerText =
              "Actividad Eliminado con éxito 🎉";
            console.log("eliminado")
            btnConsultarEnTabla()


            setTimeout(() => {
              mensajeFeedbackPlan.style.display = "none";
              //cerrar el overlay de operar
              document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
              document.body.classList.remove("body-fondo-bloqueado"); // bloquea el fondo y el desplazamie
            }, 2000);
          } else {
            console.log('no borrado')
            document.getElementById('mensajeFeedbackAgregarActividad').style.display = "block";
            document.getElementById('mensajeFeedbackAgregarActividad').style.color = "red";
            document.getElementById('mensajeFeedbackAgregarActividad').innerText =
              "no eliminado";
            console.log("eliminado")
            btnConsultarEnTabla()


            setTimeout(() => {
              mensajeFeedbackPlan.style.display = "none";
              //cerrar el overlay de operar
              document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
              document.body.classList.remove("body-fondo-bloqueado"); // bloquea el fondo y el desplazamie
            }, 2000);
          }
        }
      }
    });
}
//================================================================================================//
//                            FIN DE BORRAR UN ACTIVIDAD EN BBDD
//================================================================================================//

//================================================================================================//
//                            FUNCION PARA AGREGAR ACTIVIDAD EN BBDD mostrar overlay
//================================================================================================//
function agregarActividad() {
  sacarFechas();
  //abrir el overlay de operar
  document.getElementById("overlayOperar").classList.add("activeOverlayOperar"); // Añadir clase para mostrar el overlay
  document.getElementById('btnInsertarActividad').classList.remove("oculto") //aparecemos el boton de borrar
  document.getElementById('btnEliminarActividad').classList.add("oculto") //quitamos el boton de borrar
  document.getElementById('btnModificarActividad').classList.add("oculto") //quitamos el boton de modificar
  document.querySelector('.contenedorBotones').classList.add("oculto")
  //RESEAMOS TODO LOS CONTENIDO QUE HAY EN EL OVERLAY 
  vaciarCamposFormulario();

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
    })



  //COMPROBAMOS LOS CAMPOS 

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
}

function insertBBDDActividad() {

  //hacemos la comprobacion 
  vertificarNombre();
  vertificarHoraInicio();
  vertificarHoraFin();
  vertificarDescripcion();
  verificarFecha();

  if (
    checkError(document.getElementById("errorTitulo")) &&
    checkError(document.getElementById("errorHora")) &&
    checkError(document.getElementById("errorHoraFin")) &&
    checkError(document.getElementById("errorDescripcion")) &&
    checkError(document.getElementById("errorFecha")) &&
    checkError(document.getElementById("errorFoto"))
  ) {
    //hacemos el envio 
    //creamos un formada
    let formDataInsert = new FormData();
    //cogemos los inputs
    let inputTitulo = document.getElementById('titulo').value;
    let inputHoraInicio = document.getElementById('hora_inicio').value;
    let inputHoraFin = document.getElementById('hora_fin').value;
    let inputDescripcion = document.getElementById('descripcion').value;
    let inputFecha = document.getElementById('fecha').value;

    //asignamos en el variable en formdata
    formDataInsert.append("titulo", inputTitulo);
    formDataInsert.append("hora_inicio", inputHoraInicio);
    formDataInsert.append("hora_fin", inputHoraFin);
    formDataInsert.append("descripcion", inputDescripcion);
    formDataInsert.append("fecha", inputFecha);
    formDataInsert.append("planSeleccionado", planSeleccionado);
    formDataInsert.append("grupoSeleccionado", grupoSeleccionado);

    // Solo agregar el avatar si hay uno seleccionado
    let avatarInput = document.getElementById("avatar");
    if (avatarInput.files.length > 0) {
      //en caso si hay contenido en el input
      formDataInsert.append("foto", avatarInput.files[0]); //pasamos el file al php
      formDataInsert.append("cambiarfoto", true); //pasamos un booleano dicidendo que hay que modificar el perfil
    } else {
      //en caso si no hay nada en el input
      formDataInsert.append("fodoActividad", fodoActividad); //pasamos la ruta de avatar que esta en el bbdd
      formDataInsert.append("cambiarFoto", false); //pasamos un boleano para decir que no hay que cambiar nada
    }


    //FETCH PARA ENVIAR LOS MODIFICACIONES AL BBDD
    fetch("../Server/GestionarIndexAdmin.php", {
      method: "POST",
      //enviamos los datos
      body: formDataInsert,
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
          if (data.insertado) {

            if (data.insertado == "ok") {

              document.getElementById('mensajeFeedbackAgregarActividad').style.display = "block";
              document.getElementById('mensajeFeedbackAgregarActividad').style.color = "green";
              document.getElementById('mensajeFeedbackAgregarActividad').innerText =
                "Actividad Agregado con éxito 🎉";
              console.log("insertado")
              btnConsultarEnTabla()


              setTimeout(() => {
                mensajeFeedbackPlan.style.display = "none";
                //cerrar el overlay de operar
                document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
                document.body.classList.remove("body-fondo-bloqueado"); // bloquea el fondo y el desplazamie
              }, 2000);


            } else {
              document.getElementById('mensajeFeedbackAgregarActividad').style.display = "block";
              document.getElementById('mensajeFeedbackAgregarActividad').style.color = "red";
              document.getElementById('mensajeFeedbackAgregarActividad').innerText =
                "Actividad no agregado";
            }
          }
        }
      });
  } else {
    mostrarError(
      document.getElementById("errorModificar"),
      "El formulario contiene errores"
    );
  }


}

//================================================================================================//
//                            FIN DE FUNCION PARA ACTIVIDAD EN BBDD
//================================================================================================//

//================================================================================================//
//                            FUNCION PARA RECETEAR EL FORM
//================================================================================================//
function vaciarCamposFormulario() {
  document.getElementById("id_activiadad").value = "";
  document.getElementById("titulo").value = "";
  document.getElementById("hora_inicio").value = "";
  document.getElementById("hora_fin").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("avatar").value = ""; // Borra el archivo seleccionado


  // Resetear radios a su valor por defecto
  document.getElementById("cambiarGrupoNo").checked = true;
  document.getElementById("cambiarGrupoSi").checked = false;
  document.getElementById("cambiarPlanNo").checked = true;
  document.getElementById("cambiarPlanSi").checked = false;

  // Limpiar errores
  let errores = ["errorTitulo", "errorHora", "errorHoraFin", "errorDescripcion", "errorFecha", "errorFoto", "errorCambiarGrupo", "errorCambiarPlan", "errorModificar"];
  errores.forEach(id => {
    document.getElementById(id).innerHTML = "";
  });

  console.log("Formulario limpiado correctamente.");
}

//================================================================================================//
//                            FIN DE FUNCION PARA RECETEAR EL FORM
//================================================================================================//


//================================================================================================//
//                    CONSULTA DE FECHA INICIO Y FECHA FIN CON EL ID DEL PLAN PARA INSERTS DE ACTIVIDAD
//================================================================================================//
function sacarFechas() {
  console.log(`id_plan seleccionado ${planSeleccionado}`)
  fetch("../Server/GestionarIndexAdmin.php", {
    method: "POST", // Método de la solicitud
    headers: {
      "Content-type": "application/json", // Tipo de contenido de la solicitud
    },
    body: JSON.stringify({
      //enviamos datos para la consulta
      planSeleccionadoParaInsert: planSeleccionado
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
        //asignamos las fechas al variables globales
        fechaInicioBBDD = data.fechaPlanInserts['fecha_inicio']
        fechaFinBBDD = data.fechaPlanInserts['fecha_fin']
        console.log(`Fecha inicio: ${fechaInicioBBDD} Fecha fin: ${fechaFinBBDD}`)
      }
    });
}


//================================================================================================//
//                    FIN CONSULTA DE FECHA INICIO Y FECHA FIN CON EL ID DEL PLAN PARA INSERTS DE ACTIVIDAD
//================================================================================================//


//--------------------------------------------------------------------------------------------------------------------------------------------//


//================================================================================================//
//                    OVERLAY DE AÑADIR GRUPO
//================================================================================================//
//cuando hacemos click el boton de añadir grupo
document.getElementById('btnCrearGrupo').addEventListener('click', () => {
  limpiarFormularioAñadirGrupo()  //limpiamos el formulario 
  //mostramos el overlay
  document.getElementById("overlayAñadirGrupo").classList.add("activeOverlayAñadirGrupo"); // Quitar clase para ocultar el overlay
  document.body.classList.add('body-fondo-bloqueado');  // bloqua el fondo y el desplazamiento

});
//cuando hacemos click el boton de cerrar de añadir grupo
document.querySelector('.closeBtnAñadirGrupo').addEventListener('click', () => {
  //mostramos el overlay
  document.getElementById("overlayAñadirGrupo").classList.remove("activeOverlayAñadirGrupo"); // Quitar clase para ocultar el overlay
  document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento

});
//cuando hacemos click el boton de volver de añadir grupo
document.getElementById('btnVolverAñadirGrupo').addEventListener('click', () => {
  //mostramos el overlay
  document.getElementById("overlayAñadirGrupo").classList.remove("activeOverlayAñadirGrupo"); // Quitar clase para ocultar el overlay
  document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento

});

//CONEXION AL BBDD
//conectar con el bbd para sacar los monitores que existen 
fetch("../Server/GestionarIndexAdmin.php", {
  method: "POST", // Método de la solicitud
  headers: {
    "Content-type": "application/json", // Tipo de contenido de la solicitud
  },
  body: JSON.stringify({
    //enviamos datos para la consulta
    consultarMonitorDisponible: "monitor"
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
      if (data.monitoresDisponible) {
        document.getElementById('monitorAsignado').innerHTML = `
        <option value="0" id="monitorSeleccionadoGrupo">Selecciona un monitor</option>
        ${data.monitoresDisponible.map((monitor) => `
          <option value="${monitor['id_monitor']}" id="monitorSeleccionadoGrupo">${monitor['nombre']}</option>
        `).join('')}
      `;
      }
    }
  });
//FIN DE CONEXION AL BBDD

//creamos los funciones para comprobar los variables si es valido o no
//validar el nombre
function validarNombreGrupo() {
  //comprobar si es vacio o no 
  if (document.getElementById('nombreGrupo').value.trim() == "") {
    mostrarError(document.getElementById('errorNombreGrupo'), "El no puede estar vacio")
  } else {
    mostrarError(document.getElementById('errorNombreGrupo'), "") //quitamos el error
  }
}
//validar el select del monitor
function validarSelectMonitorGrupo() {
  console.log(document.getElementById("monitorAsignado").value)
  //comprobar si es 0 o no
  if (document.getElementById("monitorAsignado").value == 0) {
    mostrarError(document.getElementById('errorMonitorAsignado'), "Por favor, elige un monitor")
  } else {
    mostrarError(document.getElementById('errorMonitorAsignado'), "") //quitamos el error
  }
}

//comprobacion de cuando se pierde el foco
document.getElementById('nombreGrupo').onblur = validarNombreGrupo;
document.getElementById('monitorAsignado').onblur = validarSelectMonitorGrupo;

//comprobbacion en live
document.getElementById('nombreGrupo').oninput = validarNombreGrupo;
document.getElementById('monitorAsignado').oninput = validarSelectMonitorGrupo;

//funcion para limpiar el formulario 
function limpiarFormularioAñadirGrupo() {
  document.getElementById("nombreGrupo").value = ""; // Limpiar input de texto
  document.getElementById("monitorAsignado").value = "0"; // Reiniciar el select al valor por defecto

  // Limpiar mensajes de error
  document.getElementById("errorNombreGrupo").innerHTML = "";
  document.getElementById("errorMonitorAsignado").innerHTML = "";
  document.getElementById("errorCrearGrupo").innerHTML = "";
}


//cuando hace el envio del formulario
formularioCrearGrupo = document.getElementById('formAñadirGrupo');
formularioCrearGrupo.onsubmit = async function (event) {
  // Prevenir el envío del formulario al inicio
  event.preventDefault();

  //validamos por si acaso 
  validarNombreGrupo();
  validarSelectMonitorGrupo();

  //comprobamos si hay error
  if (checkError(document.getElementById('errorNombreGrupo')) && checkError(document.getElementById('errorMonitorAsignado'))) {
    //borramos el eror por si acaso 
    mostrarError(document.getElementById('errorCrearGrupo'), "")
    //SIGUIENTE PASO 
    //hacemos el insert y pasamos el nombre y el id del monitor que esta en el input
    console.log(`nombre para insertar : ${document.getElementById('nombreGrupo').value}`)
    console.log(`idmonitor para insertar : ${document.getElementById('monitorAsignado')}.value`)
    crearGrupo(document.getElementById('nombreGrupo').value, document.getElementById("monitorAsignado").value)
  } else {
    mostrarError(document.getElementById('errorCrearGrupo'), "Error de formulario")
  }

}


//CONEXION CON EL BBDD PARA HACER EL INSERT 
function crearGrupo(nombre, id_monitor) {
  fetch("../Server/GestionarIndexAdmin.php", {
    method: "POST", // Método de la solicitud
    headers: {
      "Content-type": "application/json", // Tipo de contenido de la solicitud
    },
    body: JSON.stringify({
      //enviamos datos para la consulta
      nombreGrupoCrearGrupo: nombre,
      idMonitoGrupoCrearGrupo: id_monitor
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener datos del servidor (2)."); // Manejo de error si la respuesta no es OK
      }
      return response.json(); // Convertir la respuesta a JSON
    })
    .then((data) => {
      let mensajeFeedback = document.getElementById("mensajeFeedback"); //sacamos el div del html 
      // Comprobar si hay un error en la respuesta
      if (data.error) {
        console.log("2Error: " + data.error); // Mostrar en consola el error
      } else {
        if (data.crearGrupo) {
          if (data.crearGrupo == 'ok') {
            // Éxito
            document.getElementById('errorCrearGrupo').innerHTML = "";
            mensajeFeedback.style.display = "block";
            mensajeFeedback.style.color = "green";
            mensajeFeedback.innerText = "Grupo creado con éxito 🎉";
            repintarListaSelect();
            document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
            // Deshabilitamos el botón
            document.getElementById('btnCrearGrupoConfirmar').disabled = true;
            // cerrar el overlay despues de 2s
            setTimeout(() => {
              mensajeFeedback.style.display = "none";
              document.getElementById("overlayAñadirGrupo").classList.remove("activeOverlayAñadirGrupo"); // Quitar clase para ocultar el overlay
              // habilitamos de nuevo el botón
              document.getElementById('btnCrearGrupoConfirmar').disabled = false;
            }, 2000);
          } else {
            // FALLO
            document.getElementById('errorCrearGrupo').innerHTML = "";
            mensajeFeedback.style.display = "block";
            mensajeFeedback.style.color = "red";
            mensajeFeedback.innerText = "Grupo no creado";
            // Deshabilitamos el botón
            document.getElementById('btnCrearGrupoConfirmar').disabled = true;

            // cerrar el overlay despues de 3s
            setTimeout(() => {
              mensajeFeedback.style.display = "none";
              document.getElementById("overlayAñadirGrupo").classList.remove("activeOverlayAñadirGrupo"); // Quitar clase para ocultar el overlay
              // habilitamos de nuevo el botón
              document.getElementById('btnCrearGrupoConfirmar').disabled = false;
            }, 3000);
          }
        }

      }
    });
}


//================================================================================================//
//                    FIN DE OVERLAY DE AÑADIR GRUPO
//================================================================================================//

//----------------------------------------------------------------------------------------------------------


//================================================================================================//
//                    OVERLAY DE AÑADIR PLAN
//================================================================================================//
//cuando hacemos click el boton de añadir plan
document.getElementById('btnCrearPlan').addEventListener('click', () => {
  limpiarFormularioAñadirPlan()  //limpiamos el formulario 
  //mostramos el overlay
  document.getElementById("overlayAñadirPlan").classList.add("activeOverlayAñadirPlan"); // Quitar clase para ocultar el overlay
  document.body.classList.add('body-fondo-bloqueado');  // Bloquea interacciones con el fondo y el desplazamiento
});
//cuando hacemos click el boton de cerrar de añadir plan
document.querySelector('.closeBtnAñadirPlan').addEventListener('click', () => {
  //mostramos el overlay
  document.getElementById("overlayAñadirPlan").classList.remove("activeOverlayAñadirPlan"); // Quitar clase para ocultar el overlay
  document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento

});
//cuando hacemos click el boton de volver de añadir plan
document.getElementById('btnVolverAñadirPlan').addEventListener('click', () => {
  //mostramos el overlay
  document.getElementById("overlayAñadirPlan").classList.remove("activeOverlayAñadirPlan"); // Quitar clase para ocultar el overlay
  document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento

});

//VALIDACION DE CAMPO
//validacion de fecha inicio
function validaNombrePlan() {
  if (document.getElementById('nombrePlan').value.trim() == "") {
    mostrarError(document.getElementById('errorNombrePlan'), "El nombre no puede estar vacio")
  } else {
    mostrarError(document.getElementById('errorNombrePlan'), "")
  }
}
function validarFechaInicio() {
  //comprobar si existe o no 
  if (document.getElementById('fechaInicioCrearPlan').value) {
    mostrarError(document.getElementById('errorFechaInicioCrearPlan'), "")
    // Obtener la fecha ingresada
    const fechaInput = new Date(document.getElementById('fechaInicioCrearPlan').value);
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Establecer las horas, minutos y segundos de la fecha actual a 00:00:00 para hacer la comparación sin horas
    fechaActual.setHours(0, 0, 0, 0);

    // Comparar las fechas
    if (fechaInput < fechaActual) {
      mostrarError(document.getElementById('errorFechaInicioCrearPlan'), "La fecha no puede ser pasado")
    } else if (fechaInput > fechaActual) {
      //en caso de ser futuro
      mostrarError(document.getElementById('errorFechaInicioCrearPlan'), "")
    } else {
      //en caso si es hoy
      mostrarError(document.getElementById('errorFechaInicioCrearPlan'), "")
    }
  } else {
    mostrarError(document.getElementById('errorFechaInicioCrearPlan'), "La fecha no puede ser vacia")
  }

}


//validacion de fecha fin
function validarFechaFin() {
  if (document.getElementById('fechaFinCrearPlan').value) {
    mostrarError(document.getElementById('errorFechaCrearPlan'), "")
    // Obtener la fecha ingresada
    const fechaInput = new Date(document.getElementById('fechaFinCrearPlan').value);
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Establecer las horas, minutos y segundos de la fecha actual a 00:00:00 para hacer la comparación sin horas
    fechaActual.setHours(0, 0, 0, 0);

    // Comparar las fechas
    if (fechaInput < fechaActual) {
      mostrarError(document.getElementById('errorFechaCrearPlan'), "La fecha no puede ser pasado")
    } else if (fechaInput > fechaActual) {
      //en caso de ser futuro
      mostrarError(document.getElementById('errorFechaCrearPlan'), "")
      comprobarDuracionFechas();
    } else {
      //en caso si es hoy
      mostrarError(document.getElementById('errorFechaCrearPlan'), "")
      comprobarDuracionFechas();
    }
  } else {
    mostrarError(document.getElementById('errorFechaCrearPlan'), "La fecha no puede ser vacia")
  }

  //funcion que comprueba si es los dos fechas tiene sentido o no 
  function comprobarDuracionFechas() {
    const fechaInicioInput = new Date(document.getElementById('fechaInicioCrearPlan').value);
    const fechaFinInput = new Date(document.getElementById('fechaFinCrearPlan').value);

    //comparamos los fechas
    if (fechaInicioInput > fechaFinInput) {
      mostrarError(document.getElementById('errorFechaCrearPlan'), "La fecha puede finalizarse antes de iniciarse")
    } else {
      mostrarError(document.getElementById('errorFechaCrearPlan'), "")
    }
  }
}

//validar la fecha maxima de inscripcion 
function validarFechaMaximaInscripcion() {
  if (document.getElementById('fechaMaximaIncribcionCrearPlan').value) {
    mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlan'), "")

    // Obtener la fecha ingresada
    const fechaInput = new Date(document.getElementById('fechaMaximaIncribcionCrearPlan').value);
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Establecer las horas, minutos y segundos de la fecha actual a 00:00:00 para hacer la comparación sin horas
    fechaActual.setHours(0, 0, 0, 0);
    fechaInput.setHours(0, 0, 0, 0)

    console.log("Fecha input:", fechaInput);
    console.log("Fecha actual:", fechaActual);


    // Comparar las fechas
    if (fechaInput < fechaActual) {
      mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlan'), "La fecha maxima de inscripcion no puede ser pasado")


    } else if (fechaInput > fechaActual) {
      //en caso de ser futuro
      mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlan'), "")
      comprobarSiIniciaONo();

    } else {
      //en caso si es hoy
      mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlan'), "")
      comprobarSiIniciaONo();
    }
  } else {
    mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlan'), "La fecha maxima de inscripcion no puede ser vacio")
  }


  //funcion que se comprueba si se asignado el fecha de inicio tiene que ser menor que fecha de inicio
  function comprobarSiIniciaONo() {
    if (document.getElementById('fechaInicioCrearPlan')) {
      const fechaInicioInput = new Date(document.getElementById('fechaInicioCrearPlan').value);
      const fechaMaximaInput = new Date(document.getElementById('fechaMaximaIncribcionCrearPlan').value);
      fechaInicioInput.setHours(0, 0, 0, 0);
      fechaMaximaInput.setHours(0, 0, 0, 0)

      if (fechaInicioInput <= fechaMaximaInput) {
        mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlan'), "La fecha maxima de inscripcion no puede ser despues del inicio")
      } else {
        mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlan'), "")
      }
    }
  }
}

//validar la hora maxima 
function validarHoraMaximaInscripcion() {
  const horaMaximaInput = document.getElementById('horaMaximaInscribcionCrearPlan').value;
  const fechaMaximaInput = document.getElementById('fechaMaximaIncribcionCrearPlan').value;

  if (horaMaximaInput) {
    mostrarError(document.getElementById('errorHoraMaximaInscribcionCrearPlan'), "");

    if (fechaMaximaInput) {
      const fechaInput = new Date(fechaMaximaInput); // Obtenemos la fecha de la fecha máxima
      const fechaActual = new Date(); // Obtenemos la fecha actual

      // Comparar si las fechas son el mismo día
      if (fechaInput.toDateString() === fechaActual.toDateString()) {
        // Si la fecha es hoy, compara hora y minutos
        const horaInput = parseInt(horaMaximaInput.split(':')[0], 10); // Hora de la fecha máxima
        const minutoInput = parseInt(horaMaximaInput.split(':')[1], 10); // Minuto de la fecha máxima
        const horaActual = fechaActual.getHours(); // Hora actual
        const minutoActual = fechaActual.getMinutes(); // Minuto actual

        // Compara si la hora máxima es menor que la hora actual
        if (horaInput < horaActual || (horaInput === horaActual && minutoInput <= minutoActual)) {
          mostrarError(document.getElementById('errorHoraMaximaInscribcionCrearPlan'), "La hora máxima de inscripción no puede ser anterior a la hora actual.");
        } else {
          mostrarError(document.getElementById('errorHoraMaximaInscribcionCrearPlan'), ""); // No hay error
        }
      }
    }
  } else {
    mostrarError(document.getElementById('errorHoraMaximaInscribcionCrearPlan'), "La hora no puede estar vacía.");
  }

}

//validacion de precio
function validarPrecio() {
  const precio = document.getElementById('precioCrearPlan').value.trim();

  if (precio === "") {
    mostrarError(document.getElementById('errorPrecioCrearPlan'), "El precio no puede ser nulo");
  } else {
    const precioNumero = parseInt(precio, 10); // Convierte el valor a número entero
    if (isNaN(precioNumero) || precioNumero <= 0 || precio !== String(precioNumero)) {
      mostrarError(document.getElementById('errorPrecioCrearPlan'), "El precio debe ser un número entero positivo sin decimales");
    } else {
      mostrarError(document.getElementById('errorPrecioCrearPlan'), "");
    }
  }
}

//validar Descripcion 
function validarDescripcion() {
  if (document.getElementById('descripcionCrearPlan').value.trim() == "") {
    mostrarError(document.getElementById('errorDescripcionCrearPlan'), "El definicion no puede estar vacio")
  } else {
    mostrarError(document.getElementById('errorDescripcionCrearPlan'), "")
  }
}


//UTILIZAR LOS VALIDACIONES
document.getElementById('nombrePlan').onblur = validaNombrePlan;
document.getElementById('fechaInicioCrearPlan').onblur = validarFechaInicio;
document.getElementById('fechaInicioCrearPlan').onblur = recombrebacionFechaMaximaInscripcion;
function recombrebacionFechaMaximaInscripcion() {
  if (document.getElementById('fechaMaximaIncribcionCrearPlan').value) {
    validarFechaMaximaInscripcion();
  }
}

document.getElementById('fechaFinCrearPlan').onblur = validarFechaFin;
document.getElementById('fechaMaximaIncribcionCrearPlan').onblur = validarFechaMaximaInscripcion;
document.getElementById('horaMaximaInscribcionCrearPlan').onblur = validarHoraMaximaInscripcion;
document.getElementById('precioCrearPlan').onblur = validarPrecio;
document.getElementById('descripcionCrearPlan').onblur = validarDescripcion;

document.getElementById('nombrePlan').oninput = validaNombrePlan;
document.getElementById('fechaInicioCrearPlan').oninput = validarFechaInicio;
document.getElementById('fechaFinCrearPlan').oninput = validarFechaFin;
document.getElementById('fechaMaximaIncribcionCrearPlan').oninput = validarFechaMaximaInscripcion;
document.getElementById('horaMaximaInscribcionCrearPlan').oninput = validarHoraMaximaInscripcion;
document.getElementById('precioCrearPlan').oninput = validarPrecio;
document.getElementById('descripcionCrearPlan').oninput = validarDescripcion;

//funcion para limpiar los el formulario
function limpiarFormularioAñadirPlan() {
  // Limpiar todos los campos del formulario
  document.getElementById('formAñadirPlan').reset();

  // Limpiar los mensajes de error
  const errores = document.querySelectorAll('[id^="error"]');
  errores.forEach(error => {
    error.innerHTML = ''; // Limpiar el contenido de cada mensaje de error
  });

  // Limpiar el mensaje de feedback
  document.getElementById('mensajeFeedback').style.display = "none";

}


//CUADO DAMOS EL BOTON DE CREAR
formularioCrearPlan = document.getElementById('formAñadirPlan');
formularioCrearPlan.onsubmit = async function (event) {
  // Prevenir el envío del formulario al inicio
  event.preventDefault();

  //validamos otra vez por si acaso 
  validaNombrePlan();
  validarFechaInicio();
  validarFechaFin();
  validarFechaMaximaInscripcion();
  validarHoraMaximaInscripcion();
  validarPrecio();
  validarDescripcion();

  //comprobamos si hay error o no 
  if (
    checkError(document.getElementById('errorNombrePlan')) &&
    checkError(document.getElementById('errorFechaInicioCrearPlan')) &&
    checkError(document.getElementById('errorFechaCrearPlan')) &&
    checkError(document.getElementById('errorFechaMaximaIncribcionCrearPlan')) &&
    checkError(document.getElementById('errorHoraMaximaInscribcionCrearPlan')) &&
    checkError(document.getElementById('errorPrecioCrearPlan')) &&
    checkError(document.getElementById('errorDescripcionCrearPlan'))) {
    // Si no hay errores en ninguno de los campos, continuar con el proceso
    // Aquí puedes agregar la lógica para enviar el formulario o mostrar un mensaje de éxito
    mostrarError(document.getElementById('errorCrearPlan'), "")
    //SIGUENTE PASO 
    crearPlan(
      document.getElementById('nombrePlan').value,
      document.getElementById('fechaInicioCrearPlan').value,
      document.getElementById('fechaFinCrearPlan').value,
      document.getElementById('fechaMaximaIncribcionCrearPlan').value,
      document.getElementById('horaMaximaInscribcionCrearPlan').value,
      document.getElementById('precioCrearPlan').value,
      document.getElementById('descripcionCrearPlan').value,
    )
  } else {
    // Si hay algún error, evitar el envío y mostrar el mensaje de error
    mostrarError(document.getElementById('errorCrearPlan'), "Hay campos del formulario no completado")
  }

  function crearPlan(nombre, fechaInicio, fechaFin, fechaMaxima, horaMaxima, precio, descripcion) {
    fetch("../Server/GestionarIndexAdmin.php", {
      method: "POST", // Método de la solicitud
      headers: {
        "Content-type": "application/json", // Tipo de contenido de la solicitud
      },
      body: JSON.stringify({
        //enviamos datos para la consulta
        nombreAgregatPlan: nombre,
        fechaInicioCrearPlan: fechaInicio,
        fechaFinCrearPlan: fechaFin,
        fechaMaximaCrearPlan: fechaMaxima,
        horaMaximaCrearPlan: horaMaxima,
        precioCrearPlan: precio,
        descripcionCrearPlan: descripcion
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener datos del servidor."); // Manejo de error si la respuesta no es OK
        }
        return response.json(); // Convertir la respuesta a JSON
      })
      .then((data) => {
        let mensajeFeedbackPlan = document.getElementById("mensajeFeedbackPlan"); //sacamos el div del html 
        // Comprobar si hay un error en la respuesta
        if (data.error) {
          console.log("2Error: " + data.error); // Mostrar en consola el error
        } else {
          if (data.crearPlan) {
            if (data.crearPlan == 'ok') {
              // Éxito
              document.getElementById('errorCrearPlan').innerHTML = "";
              mensajeFeedbackPlan.style.display = "block";
              mensajeFeedbackPlan.style.color = "green";
              mensajeFeedbackPlan.innerText = "Plan creado con éxito 🎉";
              repintarListaSelect();
              document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento

              // Deshabilitamos el botón
              document.getElementById('btnCrearPlanConfirmar').disabled = true;
              // cerrar el overlay despues de 2s
              setTimeout(() => {
                mensajeFeedbackPlan.style.display = "none";
                document.getElementById("overlayAñadirPlan").classList.remove("activeOverlayAñadirPlan"); // Quitar clase para ocultar el overlay
                document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                // habilitamos el botón
                document.getElementById('btnCrearPlanConfirmar').disabled = false;
              }, 2000);
            } else {
              // FALLO
              document.getElementById('errorCrearPlan').innerHTML = "";
              mensajeFeedbackPlan.style.display = "block";
              mensajeFeedbackPlan.style.color = "red";
              mensajeFeedbackPlan.innerText = "Plan no creado";
              // Deshabilitamos el botón
              document.getElementById('btnCrearPlanConfirmar').disabled = true;
              // cerrar el overlay despues de 3s
              setTimeout(() => {
                mensajeFeedbackPlan.style.display = "none";
                document.getElementById("overlayAñadirPlan").classList.remove("activeOverlayAñadirPlan"); // Quitar clase para ocultar el overlay
                document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                // habilitamos el botón
                document.getElementById('btnCrearPlanConfirmar').disabled = false;
              }, 3000);
            }
          }

        }
      });
  }


}

//================================================================================================//
//                    FIN DE OVERLAY DE AÑADIR PLAN
//================================================================================================//


//================================================================================================//
//                    OVERLAY DE MODIFICAR DATOS DEL ADMIN
//================================================================================================//
//cerrar overlay de modificar datos
document.getElementById('btnVolverModificarContrasenia').addEventListener('click', () => {
  document.getElementById('overlayCambiarContraseña').classList.remove('activeOverlayCambiarContraseña')
  document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})
document.querySelector('.closeBtnEliminarContrasenia').addEventListener('click', () => {
  document.getElementById('overlayCambiarContraseña').classList.remove('activeOverlayCambiarContraseña')
  document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})
//activar overlay de modificar datos del admin
document.getElementById('modificarPadre').addEventListener('click', () => {
  limpiarFormularioCambiarContrasenia()
  document.getElementById('overlayCambiarContraseña').classList.add('activeOverlayCambiarContraseña')
  document.body.classList.add("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})



//validanos los campos 
function validarContrasenia1() {
  //comprobamos si es vacio o no
  if (document.getElementById('contrasenia1').value.trim() == "") {
    mostrarError(document.getElementById('errorContrasenia1'), "La Contraseña no puede ser vacia")
  } else {
    mostrarError(document.getElementById('errorContrasenia1'), "");
    //comprobar con el expresion regular
    if (/^\d{6}$/.test(document.getElementById('contrasenia1').value) == true) {
      mostrarError(document.getElementById('errorContrasenia1'), "");
    } else {
      mostrarError(document.getElementById('errorContrasenia1'), "El pin debe tener 6 digitos");
    }
  }
  //comprobamos si ha asignado el segundo contraseña o no, en principio no
  if (document.getElementById('contrasenia2').value) {
    if (document.getElementById('contrasenia1').value !== document.getElementById('contrasenia2').value) {
      mostrarError(document.getElementById('errorContrasenia2'), "No coinciden la contraseña")
    } else {
      mostrarError(document.getElementById('errorContrasenia2'), "")
      //comprobar con el expresion regular
      if (/^\d{6}$/.test(document.getElementById('contrasenia2').value) == true) {
        mostrarError(document.getElementById('errorContrasenia2'), "");
      } else {
        mostrarError(document.getElementById('errorContrasenia2'), "El pin debe tener 6 digitos");
      }
    }
  }
}
function validarContrasenia2() {
  //comprobamos si es vacio o no
  if (document.getElementById('contrasenia2').value.trim() == "") {
    mostrarError(document.getElementById('errorContrasenia2'), "La Contraseña no puede ser vacia")
  } else {
    mostrarError(document.getElementById('errorContrasenia2'), "");
    //comprobar con el expresion regular
    if (/^\d{6}$/.test(document.getElementById('contrasenia2').value) == true) {
      mostrarError(document.getElementById('errorContrasenia2'), "");
    } else {
      mostrarError(document.getElementById('errorContrasenia2'), "El pin debe tener 6 digitos");
    }
  }
  //comprobamos si ha asignado el primer contraseña o no, en principio si
  if (document.getElementById('contrasenia1').value) {
    if (document.getElementById('contrasenia2').value !== document.getElementById('contrasenia1').value) {
      mostrarError(document.getElementById('errorContrasenia2'), "No coinciden la contraseña")
    } else {
      mostrarError(document.getElementById('errorContrasenia2'), "")
      //comprobar con el expresion regular
      if (/^\d{6}$/.test(document.getElementById('contrasenia2').value) == true) {
        mostrarError(document.getElementById('errorContrasenia2'), "");
      } else {
        mostrarError(document.getElementById('errorContrasenia2'), "El pin debe tener 6 digitos");
      }
    }
  }
}

//validacion de contraseña antigua
async function validarContraseniaAntigua() {
  //compruba si la contraseña esta vacia o no
  if (document.getElementById('contraseniaAntigua').value.trim() == "") {
    //en caso de estar vacio
    mostrarError(document.getElementById('errorContraseniaAntigua'), "La contraseña no puede estar vacio")
  } else {
    //en caso si no esta vacia
    mostrarError(document.getElementById('errorContraseniaAntigua'), "")
    //comprueba en bbdd si la contraseña es corecta o no
    // Comprobar en BBDD si la contraseña es correcta
    const esCorrecta = await comprobarContraseniaBBDD(document.getElementById('contraseniaAntigua').value);
    if (esCorrecta) {
      mostrarError(document.getElementById('errorContraseniaAntigua'), "");
    } else {
      mostrarError(document.getElementById('errorContraseniaAntigua'), "¡La contraseña es errónea!");
    }
  }
}

//funcion para comprobar la contraseña si esta corecta o no en bbdd
// Función para comprobar la contraseña en la base de datos
async function comprobarContraseniaBBDD(contraseniaTXT) {
  try {
    const response = await fetch("../Server/GestionarIndexAdmin.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idAdminParaComprobarContraseña: id_adminGlobal,
        contraseniaTXTParaComprobar: contraseniaTXT,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del servidor.");
    }

    const data = await response.json();

    if (data.error) {
      console.error("Error:", data.error);
      return false;
    }

    return data.comprobacionContraseña === "ok";
  } catch (error) {
    console.error("Error en la verificación:", error);
    return false;
  }
}

//inicializaos los comprobacion 
document.getElementById('contrasenia1').onblur = validarContrasenia1;
document.getElementById('contrasenia2').onblur = validarContrasenia2;
document.getElementById('contraseniaAntigua').oninput = function () {  //eliminar error cuando escribe contraseña antigua
  document.getElementById('errorContraseniaAntigua').innerHTML = "";
};
//comprobacion live
document.getElementById('contrasenia1').oninput = validarContrasenia1;
document.getElementById('contrasenia2').oninput = validarContrasenia2;

//cuando recibe un submit
let formularioCambiarContra = document.getElementById("formularioCambiarContraseña");
formularioCambiarContra.onsubmit = async function (event) {
  // Prevenir el envío del formulario al inicio
  event.preventDefault();

  //validamos por si acaso
  validarContrasenia1();
  validarContrasenia2();
  await validarContraseniaAntigua();

  //comprobamos si hay error de validacion
  if (
    checkError(document.getElementById("errorContrasenia1")) &&
    checkError(document.getElementById("errorContrasenia2")) &&
    checkError(document.getElementById("errorContraseniaAntigua"))
  ) {
    mostrarError(document.getElementById('errorModificarContraseniaGeneral'), "")
    //SIGUIENTE PASO
    //abrimos el overlay de comprobacion de modificar 
    document.getElementById('overlayComprobarContraseña').classList.add('activeOverlayComprobarContraseña')
    document.body.classList.add("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento

  } else {
    mostrarError(document.getElementById('errorModificarContraseniaGeneral'), "El formulario contiene error")
  }
}

//funcion que limpia el formulario
function limpiarFormularioCambiarContrasenia() {
  document.getElementById("formularioCambiarContraseña").reset(); // Resetea todos los campos del formulario

  // Opcional: También limpia los mensajes de error si existen
  document.getElementById("errorContrasenia1").textContent = "";
  document.getElementById("errorContrasenia2").textContent = "";
  document.getElementById("errorContraseniaAntigua").textContent = "";
  document.getElementById("errorModificarContraseniaGeneral").textContent = "";
}


//Comprobar el cambio de contraseña 
document.getElementById('volverOverlayComprobarContraseña').addEventListener('click', () => {
  document.getElementById('overlayComprobarContraseña').classList.remove('activeOverlayComprobarContraseña')
  document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})
document.querySelector('#cerrarOverlayComprobarContraseña').addEventListener('click', () => {
  document.getElementById('overlayComprobarContraseña').classList.remove('activeOverlayComprobarContraseña')
  document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})

document.getElementById('cerrarComprobarContraseña').addEventListener('click', async () => {
  await actualizarContraseña()  //actualizamos la contraseña

})


async function actualizarContraseña() {
  //hace el borado
  await fetch("../Server/GestionarIndexAdmin.php", {
    method: "POST", // Método de la solicitud
    headers: {
      "Content-type": "application/json", // Tipo de contenido de la solicitud
    },
    body: JSON.stringify({
      //enviamos datos para la consulta
      contraseñaParaCambiar2: document.getElementById('contrasenia2').value,
      idAdminCambiarContrasenia: id_adminGlobal
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



function limpiarFormularioOperar() {
  const formulario = document.getElementById('formularioOperarActividad');
  formulario.reset();

  // Limpiar la vista previa de la imagen
  const vistaPrevia = document.getElementById('vistaPrevia');
  vistaPrevia.src = '';
  vistaPrevia.style.display = 'none';

  // Limpiar los campos de error
  document.getElementById('errorTitulo').textContent = '';
  document.getElementById('errorHora').textContent = '';
  document.getElementById('errorHoraFin').textContent = '';
  document.getElementById('errorDescripcion').textContent = '';
  document.getElementById('errorFecha').textContent = '';
  document.getElementById('errorFoto').textContent = '';
  document.getElementById('errorCambiarGrupo').textContent = '';
  document.getElementById('errorCambiarPlan').textContent = '';
  document.getElementById('errorModificar').textContent = '';
  document.getElementById('mensajeFeedbackAgregarActividad').style.display = 'none';

  // Restablecer los radios
  document.getElementById('cambiarGrupoNo').checked = true;
  document.getElementById('cambiarPlanNo').checked = true;

  // Limpiar los contenedores dinámicos
  document.getElementById('espacioCambiarGrupo').innerHTML = '';
  document.getElementById('espacioCambiarPlan').innerHTML = '';
}
