
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
  
  // Función para comprobar si la imagen existe
const comprobarImagen = (url) => {
    return fetch(url, { method: 'HEAD' })   //se deja la ruta en el head para comprobar
      .then(res => res.ok)  //si responde pasamo que es ok
      .catch(() => false);  //si  no lo pasamos es false
  };

  // Función para comprobar si los elementos de error están vacíos
function checkError(element) {
    return element && element.textContent.trim() === "";
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
  //                                           INICIO DE CONTENIDO DEL HTML SACAR BBDD SE EJECUTTA
  //-----------------------------------------------------------------------------------------------------------//
  
  //CONEXION CON EL BBDD
  // Conexión con el servidor para obtener datos del admin
  fetch("../Server/GestionarInfoMonitorAdmin.php", {
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
      }
    })




    //pintar la tabla
pintarTabla();
//funcion para pintar la tabla
function pintarTabla() {
    //CONEXION CON EL BBDD
    // Conexión con el servidor para obtener datos del admin
    fetch("../Server/GestionarInfoMonitorAdmin.php", {
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
            } else {
                console.log(`idAdmin: ${data.id_admin}`);
                console.log(data.monitoresDisponible)
                if (data.monitoresDisponible.length == 0) {
                    document.getElementById("tablaMonitores").classList.add("oculto"); // Ocultar el tabla
                    document.getElementById("infoTablaMonitor").innerText =
                        "No tienes ningun Monitor";
                } else {
                    //en caso si hay respuesta
                    document.getElementById("tablaMonitores").classList.remove("oculto"); // mostramos la tabladocument.getElementById("infoTabla").innerText = "";
                    //imprimimos la lista de actividades
                    const tabla = document
                        .getElementById("tablaMonitores")
                        .getElementsByTagName("tbody")[0]; // Obtener el cuerpo de la tabla
                    tabla.innerHTML = ""; // Limpiar el contenido anterior de la tabla

                    //iteramos la respuesta
                    data.monitoresDisponible.forEach((monitor) => {
                        const nuevaFila = tabla.insertRow(); // Crear una nueva fila en la tabla

                        const celda = nuevaFila.insertCell(); // Crear celda
                        // Comprobar si la imagen del niño existe, si no usar la imagen predeterminada
                        comprobarImagen(monitor.avatar_src).then(existe => {  //usamos el metodo para la comprobacion
                            const imagen = existe ? monitor.avatar_src : '../assets/img/avatar.png';  //creamos un variable que guarda la ruta, y si el funcion del comprobacion devualve un false, asignamos la ruta predefinida del imagen, al contrario asignamos la ruta que esta en bbdd
                            celda.innerHTML = `<img src="${imagen}" alt="${monitor.nombre}">`;
                        });
                        const celda1 = nuevaFila.insertCell(); // Crear celda
                        celda1.innerHTML = `${monitor.nombre}`; // Introducir información en la celda
                        const celda2 = nuevaFila.insertCell(); // Crear celda
                        celda2.innerHTML = `${monitor.email}`; // Introducir información en la celda
                        const celda3 = nuevaFila.insertCell(); // Crear celda
                        let definicionCorta = monitor.descripcion.slice(0, 50); // Obtener solo los primeros 50 caracteres
                        
                        // Verificar si la longitud de la definición es mayor a 50
                        if (monitor.descripcion.length > 50) {
                            definicionCorta += '...'; // Añadir tres puntos al final
                        }
                        // Colocar el texto en la celda
                        celda3.textContent = definicionCorta;

                        const celda4 = nuevaFila.insertCell(); // Crear la cuarta celda
                        celda4.innerHTML = `
                        <button class="verMasBtn" onclick="mostrarOverlayOperarMonitor('${monitor.id_monitor}')" id="btnOperar">Modific.</button>
                        <button class="verMasBtnEliminar" onclick="mostrarOverlayEliminarMonitor('${monitor.id_monitor}')" id="btnEliminarMonitor">Eliminar</button>
                        <button class="verMasBtn" onclick="mostrarOverlayCambiarContraseña('${monitor.id_monitor}')" id="btnCambiarContraseña">Cambiar Contraseña</button>
                        `; // boton para operar
                    });
                }
            }
        });
}


//OVERLAY DE BORRAR
document.getElementById('btnVolverComprobarEliminarPersona').addEventListener('click', ()=>{
    document.getElementById('overlayComprobarEliminarPersona').classList.remove('activeOverlayComprobarEliminarPersona')
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})
document.querySelector('.closeBtnComprobarEliminarPersona').addEventListener('click', () =>{
    document.getElementById('overlayComprobarEliminarPersona').classList.remove('activeOverlayComprobarEliminarPersona')
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})
let idMonitorSeleccionados = null
function mostrarOverlayEliminarMonitor(idMonitorSeleccionado){
    idMonitorSeleccionados = idMonitorSeleccionado;
    console.log(`El id de monitor seleccionado para eliminar es: ${idMonitorSeleccionados}`)
    document.getElementById('overlayComprobarEliminarPersona').classList.add('activeOverlayComprobarEliminarPersona')
    document.body.classList.add("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
}
//cuando damos al boton de borrar
document.getElementById('btnEliminarComprobarEliminarPersona').addEventListener('click', ()=>{
    //hace el borado
    fetch("../Server/GestionarinfoMonitorAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            idNinoSeleccionaParaEliminar: idMonitorSeleccionados
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
                "mensajeFeedbackComprobarEliminarPersona"
            ); //sacamos el div del html
            // Comprobar si hay un error en la respuesta
            if (data.error) {
                console.log("2Error: " + data.error); // Mostrar en consola el error
            } else {
                if (data.eliminadoMonitor) {
                    if (data.eliminadoMonitor == "ok") {
                        // Éxito
                        document.getElementById(
                            "errorComprobarEliminarPersona"
                        ).innerHTML = "";
                        mensajeFeedbackOperar.style.display = "block";
                        mensajeFeedbackOperar.style.color = "green";
                        mensajeFeedbackOperar.innerText =
                            "El Niño eliminado con éxito 🎉";
                            pintarTabla(); //repintar la lista
                        // Deshabilitamos el botón
                        document.getElementById(
                            "btnEliminarComprobarEliminarPersona"
                        ).disabled = true;
                        document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
                        // cerrar el overlay despues de 2s
                        setTimeout(() => {
                            mensajeFeedbackOperar.style.display =
                                "none";
                            document
                                .getElementById("overlayComprobarEliminarPersona")
                                .classList.remove("activeOverlayComprobarEliminarPersona"); // Quitar clase para ocultar el overlay
                            // habilitamos de nuevo el botón
                            document.getElementById(
                                "btnEliminarComprobarEliminarPersona"
                            ).disabled = false;
                        }, 2000);
                    } else {
                        // FALLO
                        document.getElementById(
                            "errorComprobarEliminarPersona"
                        ).innerHTML = "";
                        mensajeFeedbackOperar.style.display = "block";
                        mensajeFeedbackOperar.style.color = "red";
                        mensajeFeedbackOperar.innerText =
                            data.mensaje;
                        // Deshabilitamos el botón
                        document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
                        document.getElementById(
                            "btnEliminarComprobarEliminarPersona"
                        ).disabled = true;

                        // cerrar el overlay despues de 3s
                        setTimeout(() => {
                            mensajeFeedbackOperar.style.display =
                                "none";
                            document
                                .getElementById("overlayComprobarEliminarPersona")
                                .classList.remove("activeOverlayComprobarEliminarPersona"); // Quitar clase para ocultar el overlay
                            // habilitamos de nuevo el botón
                            document.getElementById(
                                "btnEliminarComprobarEliminarPersona"
                            ).disabled = false;
                            document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
                        }, 3000);
                    }
                
                }
            }
        });
})


//cuando presionamos que queremos cambiar la contraseña
document.getElementById('btnVolverModificarContrasenia').addEventListener('click', ()=>{
    document.getElementById('overlayCambiarContraseña').classList.remove('activeOverlayCambiarContraseña')
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})
document.querySelector('.closeBtnEliminarContrasenia').addEventListener('click', () =>{
    document.getElementById('overlayCambiarContraseña').classList.remove('activeOverlayCambiarContraseña')
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})
function mostrarOverlayCambiarContraseña(idMonitorSeleccionado){
    limpiarFormularioCambiarContrasenia()
    idMonitorSeleccionados = idMonitorSeleccionado
    console.log(`Id del admin seleccionado para modificar Contraseña es: ${idMonitorSeleccionados}`)
    document.getElementById('overlayCambiarContraseña').classList.add('activeOverlayCambiarContraseña')
    // document.body.classList.add("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
}
function limpiarFormularioCambiarContrasenia() {
    // Limpiar los campos de contraseña
    document.getElementById('contrasenia1').value = '';
    document.getElementById('contrasenia2').value = '';
    
    // Limpiar los mensajes de error
    document.getElementById('errorContrasenia1').innerHTML = '';
    document.getElementById('errorContrasenia2').innerHTML = '';
    document.getElementById('errorModificarContraseniaGeneral').innerHTML = '';
    
    // Limpiar mensaje de feedback
    document.getElementById('mensajeFeedbackComprobarModificarContrasenia').style.display = 'none';
}

// Llamar a la función para limpiar el formulario cuando sea necesario
document.getElementById('btnVolverModificarContrasenia').addEventListener('click', limpiarFormularioCambiarContrasenia);


//validanos los campos 
function validarContrasenia1 (){
    //comprobamos si es vacio o no
    if(document.getElementById('contrasenia1').value.trim() == ""){
        mostrarError(document.getElementById('errorContrasenia1'), "La Contraseña no puede ser vacia")
    }else{
        mostrarError(document.getElementById('errorContrasenia1'), "");
        //comprobar con el expresion regular
        if (/^\d{6}$/.test(document.getElementById('contrasenia1').value) == true){
            mostrarError(document.getElementById('errorContrasenia1'), "");
        }else{
            mostrarError(document.getElementById('errorContrasenia1'), "El pin debe tener 6 digitos");
        }
    }
    //comprobamos si ha asignado el segundo contraseña o no, en principio no
    if(document.getElementById('contrasenia2').value){
        if (document.getElementById('contrasenia1').value !== document.getElementById('contrasenia2').value){
            mostrarError(document.getElementById('errorContrasenia2'), "No coinciden la contraseña")
        }else{
            mostrarError(document.getElementById('errorContrasenia2'), "")
             //comprobar con el expresion regular
        if (/^\d{6}$/.test(document.getElementById('contrasenia2').value) == true){
            mostrarError(document.getElementById('errorContrasenia2'), "");
        }else{
            mostrarError(document.getElementById('errorContrasenia2'), "El pin debe tener 6 digitos");
        }
        }
    }
    limpiezaCambiarContraseñaMonitor();
}
function validarContrasenia2 (){
    //comprobamos si es vacio o no
    if(document.getElementById('contrasenia2').value.trim() == ""){
        mostrarError(document.getElementById('errorContrasenia2'), "La Contraseña no puede ser vacia")
    }else{
        mostrarError(document.getElementById('errorContrasenia2'), "");
    }
    //comprobamos si ha asignado el primer contraseña o no, en principio si
    if(document.getElementById('contrasenia1').value){
        if (document.getElementById('contrasenia2').value !== document.getElementById('contrasenia1').value){
            mostrarError(document.getElementById('errorContrasenia2'), "No coinciden la contraseña")
        }else{
            mostrarError(document.getElementById('errorContrasenia2'), "")
        }
    }
    limpiezaCambiarContraseñaMonitor();
}

//funcion para quitar el error general (limpieza)
//FUNCION PARA LIMPIAR EL ERROR GENERAL SI NO HAY ERROR EN EL FORMULARIO 
//comprobamos si existe el error general o no, si hay error general se comprueba otra vez si hay errores en el formulario o no, 
//si no hay error tras la compribacion del formulario se borraria el error general y si hay algun fallo se mantiene el error
//**este funcion siempre se ejecuta despues de comprobacion de validacion de los campos (deben estar dentro del funcion de validacion de cada input) */
function limpiezaCambiarContraseñaMonitor(){
    console.log(checkError(document.getElementById('errorModificarContraseniaGeneral')))
    if (checkError(document.getElementById('errorModificarContraseniaGeneral')) == false){
        if (
            checkError(document.getElementById("errorContrasenia1")) &&
            checkError(document.getElementById("errorContrasenia2"))
          ) {
            mostrarError(document.getElementById('errorModificarContraseniaGeneral'), "")
          }else{
            mostrarError(document.getElementById('errorModificarContraseniaGeneral'), "El formulario contiene error")
          }
    }
}

//activamos los validacion 
document.getElementById('contrasenia1').onblur = validarContrasenia1;
document.getElementById('contrasenia2').onblur = validarContrasenia2;

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

    //comprobamos si hay error de validacion
  if (
    checkError(document.getElementById("errorContrasenia1")) &&
    checkError(document.getElementById("errorContrasenia2")) 
  ) {
    mostrarError(document.getElementById('errorModificarContraseniaGeneral'), "")
    //SIGUIENTE PASO
    actualizarContraseña()

  }else{
    mostrarError(document.getElementById('errorModificarContraseniaGeneral'), "El formulario contiene error")
  }
}

function actualizarContraseña(){
    //hace el borado
    fetch("../Server/GestionarinfoMonitorAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            contraseñaParaCambiar2: document.getElementById('contrasenia2').value,
            idMonitorCambiarContrasenia :idMonitorSeleccionados
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
                if (data.contraseniaMonitorCambiado) {
                    if (data.contraseniaMonitorCambiado == "ok") {
                        // Éxito
                        document.getElementById(
                            "errorModificarContraseniaGeneral"
                        ).innerHTML = "";
                        mensajeFeedbackOperar.style.display = "block";
                        mensajeFeedbackOperar.style.color = "green";
                        mensajeFeedbackOperar.innerText =
                            "Contraseña modificado con éxito 🎉";
                            pintarTabla(); //repintar la lista
                        // Deshabilitamos el botón
                        document.getElementById(
                            "btnConfirmarModificarContrasenia"
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
                                "btnConfirmarModificarContrasenia"
                            ).disabled = false;
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
                        pintarTabla(); //repintar la lista
                    // Deshabilitamos el botón
                    document.getElementById(
                        "btnConfirmarModificarContrasenia"
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
                            "btnConfirmarModificarContrasenia"
                        ).disabled = false;
                    }, 2000);
                    }
                
                }

            }
        })
}


//MODIFICAR DATOS DEL MONITOR
document.getElementById('btnVolverCambiarDatos').addEventListener('click', ()=>{
    document.getElementById('overlayCambiarDatos').classList.remove('activeOverlayCambiarDatos')
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})
document.querySelector('.closeBtnCambiarDatos').addEventListener('click', () =>{
    document.getElementById('overlayCambiarDatos').classList.remove('activeOverlayCambiarDatos')
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})

function mostrarOverlayOperarMonitor(idMonitorSeleccionado){
    limpiarFormularioCambiarDatos()
    idMonitorSeleccionados = idMonitorSeleccionado;
    console.log(`El id de monitor seleccionado para Modificar es: ${idMonitorSeleccionados}`)
    document.getElementById('overlayCambiarDatos').classList.add('activeOverlayCambiarDatos')
    document.body.classList.add("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
    //rellenamos de datos
    autorelleno()
}
function limpiarFormularioCambiarDatos() {
    // Limpiar los campos de texto
    document.getElementById('nombreModificar').value = '';
    document.getElementById('descripcionModificar').value = '';
    
    // Limpiar los mensajes de error
    document.getElementById('errorNombreModificar').innerHTML = '';
    document.getElementById('errorDescripcionModificar').innerHTML = '';
    document.getElementById('errorCambiarDatosGeneral').innerHTML = '';
    
    // Limpiar mensaje de feedback
    document.getElementById('mensajeFeedbackComprobarModificarDatos').style.display = 'none';
}

// Llamar a la función para limpiar el formulario cuando sea necesario
document.getElementById('btnVolverCambiarDatos').addEventListener('click', limpiarFormularioCambiarDatos);


//funcion para rellenar los imputs
function autorelleno (){
    //hace el borado
    fetch("../Server/GestionarinfoMonitorAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            consultaAtorellenoModificarMonitor: idMonitorSeleccionados
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
                if (data.autoRelleno){
                    //rellenamos los value del html
                    document.getElementById('nombreModificar').value = data.autoRelleno['nombre'];
                    document.getElementById('descripcionModificar').value = data.autoRelleno['descripcion'];
                }
            }
        })
}

//validaciones 
function validarNombre (){
    if (document.getElementById('nombreModificar').value.trim() == ""){
        mostrarError(document.getElementById('errorNombreModificar'), "El nombre no debe estar vacio")
    }else{
        mostrarError(document.getElementById('errorNombreModificar'), "")
    }
    limpiezaCambiarDatoMonitor()
}
function validarDescripcion(){
    if (document.getElementById('descripcionModificar').value.trim() == ""){
        mostrarError(document.getElementById('errorDescripcionModificar'), "El descripcion no puede estar vacio")
    }else{
        mostrarError(document.getElementById('errorDescripcionModificar'), "")
    }
    limpiezaCambiarDatoMonitor()
}
//funcion para quitar el error general (limpieza)
function limpiezaCambiarDatoMonitor(){
    console.log(checkError(document.getElementById('errorCambiarDatosGeneral')))
    if (checkError(document.getElementById('errorCambiarDatosGeneral')) == false){
        if (
            checkError(document.getElementById("errorNombreModificar")) &&
            checkError(document.getElementById("errorDescripcionModificar"))
          ) {
            mostrarError(document.getElementById('errorCambiarDatosGeneral'), "")
          }else{
            mostrarError(document.getElementById('errorCambiarDatosGeneral'), "El formulario contiene error")
          }
    }
}

//activamos los validaciones
document.getElementById('nombreModificar').onblur = validarNombre;
document.getElementById('descripcionModificar').onblur = validarDescripcion;

document.getElementById('nombreModificar').oninput = validarNombre;
document.getElementById('descripcionModificar').oninput = validarDescripcion;


//cuando hacemos el envio del modificar 
//cuando recibe un submit
let formularioCambiarDatos = document.getElementById("formularioCambiarDatos");
formularioCambiarDatos.onsubmit = async function (event) {
    // Prevenir el envío del formulario al inicio
    event.preventDefault();

    //validamos por si acaso
    validarNombre;
    validarDescripcion;

    //comprobamos si hay error de validacion
  if (
    checkError(document.getElementById("errorNombreModificar")) &&
    checkError(document.getElementById("errorDescripcionModificar")) 
  ) {
    mostrarError(document.getElementById('errorCambiarDatosGeneral'), "")
    //SIGUIENTE PASO
    modificarDatosMonitor()

  }else{
    mostrarError(document.getElementById('errorCambiarDatosGeneral'), "El formulario contiene error")
  }
}

function modificarDatosMonitor(){
    console.log(`nombre: ${document.getElementById('nombreModificar').value}`)
    console.log(`definicion: ${document.getElementById('descripcionModificar').value}`)
    console.log(`id monitor: ${idMonitorSeleccionados}`)
    //hace el borado
    fetch("../Server/GestionarinfoMonitorAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            nombreCambiado: document.getElementById('nombreModificar').value,
            definicionCambiado: document.getElementById('descripcionModificar').value,
            idMonitorParaActualizarDato :idMonitorSeleccionados
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
                "mensajeFeedbackComprobarModificarDatos"
            ); //sacamos el div del html
            // Comprobar si hay un error en la respuesta
            if (data.error) {
                console.log("2Error: " + data.error); // Mostrar en consola el error
            } else {
                if (data.actualizacionDatosMonitor) {
                    if (data.actualizacionDatosMonitor == "ok") {
                        // Éxito
                        document.getElementById(
                            "errorCambiarDatosGeneral"
                        ).innerHTML = "";
                        mensajeFeedbackOperar.style.display = "block";
                        mensajeFeedbackOperar.style.color = "green";
                        mensajeFeedbackOperar.innerText =
                            "Datos del Monitor modificado con éxito 🎉";
                            pintarTabla(); //repintar la lista
                        // Deshabilitamos el botón
                        document.getElementById(
                            "btnConfirmarCambiarDatos"
                        ).disabled = true;
                        document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
                        // cerrar el overlay despues de 2s
                        setTimeout(() => {
                            mensajeFeedbackOperar.style.display =
                                "none";
                            document
                                .getElementById("overlayCambiarDatos")
                                .classList.remove("activeOverlayCambiarDatos"); // Quitar clase para ocultar el overlay
                            // habilitamos de nuevo el botón
                            document.getElementById(
                                "btnConfirmarCambiarDatos"
                            ).disabled = false;
                        }, 2000);
                    } else {
                        // Éxito
                        document.getElementById(
                            "errorCambiarDatosGeneral"
                        ).innerHTML = "";
                        mensajeFeedbackOperar.style.display = "block";
                        mensajeFeedbackOperar.style.color = "red";
                        mensajeFeedbackOperar.innerText =
                            "Error de modificar datos de monitor";
                            pintarTabla(); //repintar la lista
                        // Deshabilitamos el botón
                        document.getElementById(
                            "btnConfirmarCambiarDatos"
                        ).disabled = true;
                        document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
                        // cerrar el overlay despues de 2s
                        setTimeout(() => {
                            mensajeFeedbackOperar.style.display =
                                "none";
                            document
                                .getElementById("overlayCambiarDatos")
                                .classList.remove("activeOverlayCambiarDatos"); // Quitar clase para ocultar el overlay
                            // habilitamos de nuevo el botón
                            document.getElementById(
                                "btnConfirmarCambiarDatos"
                            ).disabled = false;
                        }, 2000);
                    }
                
                }

            }
        })
}


//CUANDO CREAMOS UN MONITOR
//creamos overlay de crear monitor
document.getElementById('btnVolverCrearMonitor').addEventListener('click', ()=>{
    document.getElementById('overlayCrearMonitor').classList.remove('activeOverlayCrearMonitor')
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})
document.querySelector('.closeBtnCrearMonitor').addEventListener('click', () =>{
    document.getElementById('overlayCrearMonitor').classList.remove('activeOverlayCrearMonitor')
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})

//abrir overlay de crear monitor
document.getElementById('btnCrearMonitor').addEventListener('click', ()=>{
    limpiarFormularioCrearMonitor();
    document.getElementById('overlayCrearMonitor').classList.add('activeOverlayCrearMonitor')
    document.body.classList.add("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})

function limpiarFormularioCrearMonitor() {
    // Limpiar los campos de texto
    document.getElementById('nombreCrear').value = '';
    document.getElementById('emailCrear').value = '';
    document.getElementById('descripcionCrear').value = '';
    document.getElementById('contrasenia1Crear').value = '';
    document.getElementById('contrasenia2Crear').value = '';
    
    // Limpiar los mensajes de error
    document.getElementById('errorNombreCrear').innerHTML = '';
    document.getElementById('errorEmailCrear').innerHTML = '';
    document.getElementById('errorDescripcionCrear').innerHTML = '';
    document.getElementById('errorContrasenia1Crear').innerHTML = '';
    document.getElementById('errorContrasenia2Crear').innerHTML = '';
    document.getElementById('errorCrearMonitorGeneral').innerHTML = '';
    
    // Limpiar mensaje de feedback
    document.getElementById('mensajeFeedbackCrearMonitor').style.display = 'none';
}

// Llamar a la función para limpiar el formulario cuando sea necesario
document.getElementById('btnVolverCrearMonitor').addEventListener('click', limpiarFormularioCrearMonitor);


//vertificamos
function validarNombreCrear (){
    if(document.getElementById('nombreCrear').value.trim()==""){
        mostrarError(document.getElementById('errorNombreCrear'), "El nombre no puede estar vacio")
    }else{
        mostrarError(document.getElementById('errorNombreCrear'), "")
    }
    limpiezaCrearMonitor()
}
function validarCorreoCrear (){
    if(document.getElementById('emailCrear').value.trim()==""){
        mostrarError(document.getElementById('errorEmailCrear'), "El correo no puede estar vacio")
    }else{
        mostrarError(document.getElementById('errorEmailCrear'), "")
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(document.getElementById('emailCrear').value) == true){
            mostrarError(document.getElementById('errorEmailCrear'), "")
        }else{
            mostrarError(document.getElementById('errorEmailCrear'), "Error del formato")
        }
    }
    limpiezaCrearMonitor()
}
function validarDescripcionCrear (){
    if(document.getElementById('descripcionCrear').value.trim()==""){
        mostrarError(document.getElementById('errorDescripcionCrear'), "El descripcion no puede estar vacio")
    }else{
        mostrarError(document.getElementById('errorDescripcionCrear'), "")
    }
    limpiezaCrearMonitor()
}


//validanos los campos 
function validarContrasenia1Crear (){
    //comprobamos si es vacio o no
    if(document.getElementById('contrasenia1Crear').value.trim() == ""){
        mostrarError(document.getElementById('errorContrasenia1Crear'), "La Contraseña no puede ser vacia")
    }else{
        mostrarError(document.getElementById('errorContrasenia1Crear'), "");
        //comprobar con el expresion regular
        if (/^\d{6}$/.test(document.getElementById('contrasenia1Crear').value) == true){
            mostrarError(document.getElementById('errorContrasenia1Crear'), "");
        }else{
            mostrarError(document.getElementById('errorContrasenia1Crear'), "El pin debe tener 6 digitos");
        }
        limpiezaCrearMonitor()
    }
    //comprobamos si ha asignado el segundo contraseña o no, en principio no
    if(document.getElementById('contrasenia2Crear').value){
        if (document.getElementById('contrasenia1Crear').value !== document.getElementById('contrasenia2Crear').value){
            mostrarError(document.getElementById('errorContrasenia2Crear'), "No coinciden la contraseña")
        }else{
            mostrarError(document.getElementById('errorContrasenia2Crear'), "")
             //comprobar con el expresion regular
        if (/^\d{6}$/.test(document.getElementById('contrasenia2Crear').value) == true){
            mostrarError(document.getElementById('errorContrasenia2Crear'), "");
        }else{
            mostrarError(document.getElementById('errorContrasenia2Crear'), "El pin debe tener 6 digitos");
        }
        }
        limpiezaCrearMonitor()
    }
}
function validarContrasenia2Crear (){
    //comprobamos si es vacio o no
    if(document.getElementById('contrasenia2Crear').value.trim() == ""){
        mostrarError(document.getElementById('errorContrasenia2Crear'), "La Contraseña no puede ser vacia")
    }else{
        mostrarError(document.getElementById('errorContrasenia2Crear'), "");
         //comprobar con el expresion regular
         if (/^\d{6}$/.test(document.getElementById('contrasenia2Crear').value) == true){
            mostrarError(document.getElementById('errorContrasenia2Crear'), "");
        }else{
            mostrarError(document.getElementById('errorContrasenia2Crear'), "El pin debe tener 6 digitos");
        }
    }
    //comprobamos si ha asignado el primer contraseña o no, en principio si
    if(document.getElementById('contrasenia1Crear').value){
        if (document.getElementById('contrasenia2Crear').value !== document.getElementById('contrasenia1Crear').value){
            mostrarError(document.getElementById('errorContrasenia2Crear'), "No coinciden la contraseña")
        }else{
            mostrarError(document.getElementById('errorContrasenia2Crear'), "")
             //comprobar con el expresion regular
            if (/^\d{6}$/.test(document.getElementById('contrasenia2Crear').value) == true){
                mostrarError(document.getElementById('errorContrasenia2Crear'), "");
            }else{
                mostrarError(document.getElementById('errorContrasenia2Crear'), "El pin debe tener 6 digitos");
            }
        }
    }
    limpiezaCrearMonitor()
}

//funcion para quitar el error general (limpieza)
function limpiezaCrearMonitor(){
    console.log(checkError(document.getElementById('errorCrearMonitorGeneral')))
    if (checkError(document.getElementById('errorCrearMonitorGeneral')) == false){
        if (
            checkError(document.getElementById("errorNombreCrear")) &&
            checkError(document.getElementById("errorEmailCrear")) &&
            checkError(document.getElementById("errorDescripcionCrear")) &&
            checkError(document.getElementById("errorContrasenia1Crear")) &&
            checkError(document.getElementById("errorContrasenia2Crear"))
          ) {
            mostrarError(document.getElementById('errorCrearMonitorGeneral'), "")
          }else{
            mostrarError(document.getElementById('errorCrearMonitorGeneral'), "El formulario contiene error")
          }
    }
}


//activamos la comprobacion 
document.getElementById('nombreCrear').onblur = validarNombreCrear;
document.getElementById('emailCrear').onblur = validarCorreoCrear;
document.getElementById('descripcionCrear').onblur = validarDescripcionCrear;
document.getElementById('contrasenia1Crear').onblur = validarContrasenia1Crear;
document.getElementById('contrasenia2Crear').onblur = validarContrasenia2Crear;

document.getElementById('nombreCrear').oninput = validarNombreCrear;
document.getElementById('emailCrear').oninput = validarCorreoCrear;
document.getElementById('descripcionCrear').oninput = validarDescripcionCrear;
document.getElementById('contrasenia1Crear').oninput = validarContrasenia1Crear;
document.getElementById('contrasenia2Crear').oninput = validarContrasenia2Crear;

//cuando hacemos el envio del modificar 
//cuando recibe un submit
let formularioInsertarDatos = document.getElementById("formularioCrearMonitor");
formularioInsertarDatos.onsubmit = async function (event) {
    // Prevenir el envío del formulario al inicio
    event.preventDefault();

    //validamos por si acaso
    validarNombreCrear();
    validarCorreoCrear();
    validarDescripcionCrear();
    validarContrasenia1Crear();
    validarContrasenia2Crear();

    //comprobamos si hay error de validacion
  if (
    checkError(document.getElementById("errorNombreCrear")) &&
    checkError(document.getElementById("errorEmailCrear")) &&
    checkError(document.getElementById("errorDescripcionCrear")) &&
    checkError(document.getElementById("errorContrasenia1Crear")) &&
    checkError(document.getElementById("errorContrasenia2Crear"))
  ) {
    mostrarError(document.getElementById('errorCrearMonitorGeneral'), "")
    //SIGUIENTE PASO
    crearDatosMonitor()
  }else{
    mostrarError(document.getElementById('errorCrearMonitorGeneral'), "El formulario contiene error")
  }
}

function crearDatosMonitor(){
    //hace el borado
    fetch("../Server/GestionarinfoMonitorAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            crearNombre: document.getElementById('nombreCrear').value,
            crearEmail: document.getElementById('emailCrear').value,
            crearDescripcion :document.getElementById('descripcionCrear').value,
            crearContrasenia: document.getElementById('contrasenia2Crear').value
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
                "mensajeFeedbackCrearMonitor"
            ); //sacamos el div del html
            // Comprobar si hay un error en la respuesta
            if (data.error) {
                console.log("2Error: " + data.error); // Mostrar en consola el error
            } else {
                if (data.crearMonitor) {
                    if (data.crearMonitor == "ok") {
                        // Éxito
                        document.getElementById(
                            "errorCrearMonitorGeneral"
                        ).innerHTML = "";
                        mensajeFeedbackOperar.style.display = "block";
                        mensajeFeedbackOperar.style.color = "green";
                        mensajeFeedbackOperar.innerText =
                            "Monitor Creado 🎉";
                            pintarTabla(); //repintar la lista
                        // Deshabilitamos el botón
                        document.getElementById(
                            "btnConfirmarCrearMonitor"
                        ).disabled = true;
                        document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
                        // cerrar el overlay despues de 2s
                        setTimeout(() => {
                            mensajeFeedbackOperar.style.display =
                                "none";
                            document
                                .getElementById("overlayCrearMonitor")
                                .classList.remove("activeOverlayCrearMonitor"); // Quitar clase para ocultar el overlay
                            // habilitamos de nuevo el botón
                            document.getElementById(
                                "btnConfirmarCrearMonitor"
                            ).disabled = false;
                        }, 2000);
                    } else {
                        // Éxito
                        document.getElementById(
                        "errorCrearMonitorGeneral"
                    ).innerHTML = "";
                    mensajeFeedbackOperar.style.display = "block";
                    mensajeFeedbackOperar.style.color = "red";
                    mensajeFeedbackOperar.innerText =
                        "Moditor no creado";
                        pintarTabla(); //repintar la lista
                    // Deshabilitamos el botón
                    document.getElementById(
                        "btnConfirmarCrearMonitor"
                    ).disabled = true;
                    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
                    // cerrar el overlay despues de 2s
                    setTimeout(() => {
                        mensajeFeedbackOperar.style.display =
                            "none";
                        document
                            .getElementById("overlayCrearMonitor")
                            .classList.remove("activeOverlayCrearMonitor"); // Quitar clase para ocultar el overlay
                        // habilitamos de nuevo el botón
                        document.getElementById(
                            "btnConfirmarCrearMonitor"
                        ).disabled = false;
                    }, 2000);
                    }
                
                }

            }
        })
}//-----------------------------------------------------------------------------------------------------------//
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