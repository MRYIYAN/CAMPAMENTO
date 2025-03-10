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

    document.getElementById("btnGestionarPlan").addEventListener("click", () => {
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

// Función para comprobar si los elementos de error están vacíos
function checkError(element) {
    return element && element.textContent.trim() === "";
}
//-----------------------------------------------------------------------------------------------------------//
//                                           HTMLLLLLLLLLLLL
//-----------------------------------------------------------------------------------------------------------//

//pintar la tabla
pintarTabla();
//funcion para pintar la tabla
function pintarTabla() {
    //CONEXION CON EL BBDD
    // Conexión con el servidor para obtener datos del admin
    fetch("../Server/GestionarGestionarPlanesAdmin.php", {
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
                console.log(data.planesDisponible)
                if (data.planesDisponible.length == 0) {
                    document.getElementById("tablaPlan").classList.add("oculto"); // Ocultar el tabla
                    document.getElementById("infoTabla").innerText =
                        "No tienes ningua Plan";
                } else {
                    //en caso si hay respuesta
                    document.getElementById("tablaPlan").classList.remove("oculto"); // mostramos la tabladocument.getElementById("infoTabla").innerText = "";
                    //imprimimos la lista de actividades
                    const tabla = document
                        .getElementById("tablaPlan")
                        .getElementsByTagName("tbody")[0]; // Obtener el cuerpo de la tabla
                    tabla.innerHTML = ""; // Limpiar el contenido anterior de la tabla

                    //iteramos la respuesta
                    data.planesDisponible.forEach((plan) => {
                        const nuevaFila = tabla.insertRow(); // Crear una nueva fila en la tabla

                        const celda1 = nuevaFila.insertCell(); // Crear celda
                        celda1.innerHTML = `${plan.nombre}`; // Introducir información en la celda
                        const celda2 = nuevaFila.insertCell(); // Crear celda
                        celda2.innerHTML = `${plan.fecha_inicio} - ${plan.fecha_fin}`; // Introducir información en la celda
                        const celda3 = nuevaFila.insertCell(); // Crear celda
                        celda3.innerHTML = `${plan.fecha_maxInscripcion} (${plan.hora_maximaInscripcion})`; // Introducir información en la celda
                        const celda4 = nuevaFila.insertCell(); // Crear celda
                        celda4.innerHTML = `${plan.precio}`; // Introducir información en la celda
                        const celda5 = nuevaFila.insertCell(); // Crear celda
                        let definicionCorta = plan.definicion.slice(0, 50); // Obtener solo los primeros 50 caracteres
                        
                        // Verificar si la longitud de la definición es mayor a 50
                        if (plan.definicion.length > 50) {
                            definicionCorta += '...'; // Añadir tres puntos al final
                        }
                        
                        // Colocar el texto en la celda
                        celda5.textContent = definicionCorta;
                        const celda6 = nuevaFila.insertCell(); // Crear la cuarta celda
                        celda6.innerHTML = `
                        <button class="verMasBtn" onclick="mostrarOverlayOperar('${plan.id_plan}')" id="btnOperar">Modificar</button>
                        <button class="verMasBtn" onclick="mostrarOverlayNinos('${plan.id_plan}')" id="btnVerNinos">VerNinos</button>
                        
                        `; // boton para operar
                    });
                }
            }
        });
}

//================================================================================================================================================================================================================//

//---------------------------------------------------------------------------------------------------//
//BOTON DE CREAR PLAN
//---------------------------------------------------------------------------------------------------//
//cuando hacemos click el boton de añadir plan
document.getElementById('btnCrearNuevoPlan').addEventListener('click', () => {
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
function validarPrecio(){
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
document.getElementById('fechaInicioCrearPlan').onblur =recombrebacionFechaMaximaInscripcion;
function recombrebacionFechaMaximaInscripcion (){
    if (document.getElementById('fechaMaximaIncribcionCrearPlan').value){
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
    document.getElementById('mensajeFeedbackCrearPlan').style.display = "none";

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
        fetch("../Server/GestionarGestionarPlanesAdmin.php", {
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
                let mensajeFeedbackPlan = document.getElementById("mensajeFeedbackCrearPlan"); //sacamos el div del html 
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
                            // Deshabilitamos el botón
                            document.getElementById('btnCrearPlanConfirmar').disabled = true;
                            // cerrar el overlay despues de 2s
                            //Repintar la tabla
                            pintarTabla();
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
                            //Repintar la tabla
                            pintarTabla();
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
//---------------------------------------------------------------------------------------------------//

//---------------------------------------------------------------------------------------------------//
//OVERLAY MODIFICAR EL PLAN
//---------------------------------------------------------------------------------------------------//
//cuando hacemos click el boton de cerrar de modificar plan
document.querySelector('.closeBtnModificarPlan').addEventListener('click', () => {
    //mostramos el overlay
    document.getElementById("overlayModificarPlan").classList.remove("activeOverlayModificarPlan"); // Quitar clase para ocultar el overlay
    document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento

});
//cuando hacemos click el boton de volver de Modificar plan
document.getElementById('btnVolverModificarPlan').addEventListener('click', () => {
    //mostramos el overlay
    document.getElementById("overlayModificarPlan").classList.remove("activeOverlayModificarPlan"); // Quitar clase para ocultar el overlay
    document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
});



// funcion para mostrar el overlay para modificar
//funcion global del idPlan
//este valor se actualiza cada vez que presionamos el boton operar(cada vez que se abre la overlay de modificar)
let idPlanParaMofificarGlobal = null;   //inicializamos
function mostrarOverlayOperar(id_plan){
    limpiarFormularioModificacionPlan()
    //mostramos el overlay
    document.getElementById("overlayModificarPlan").classList.add("activeOverlayModificarPlan"); // Quitar clase para ocultar el overlay
    document.body.classList.add('body-fondo-bloqueado');  // Bloquea interacciones con el fondo y el desplazamiento
    idPlanParaMofificarGlobal = id_plan //pasamos al global
    //rellenamos los datos
    rellenoDatosBBDDParaModificar()

}
//funcion para rellenar datos para poder modificar
async function rellenoDatosBBDDParaModificar(){ //async hace que si el funcion no terminaa no sigue
    //conectamos al bbdd
    await fetch("../Server/GestionarGestionarPlanesAdmin.php", {    //espera a terminar el conexion
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            id_planParaAutorellenoParaModificar : idPlanParaMofificarGlobal
        }),

    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener datos del servidor para el relleno de dato."); // Manejo de error si la respuesta no es OK
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then((data) => {
            // Comprobar si hay un error en la respuesta
            if (data.error) {
                console.log("Error sacar ninos no operados: " + data.error); // Mostrar en consola el error
            } else {
                if (data.infoPlanParaModificar){
                    document.getElementById('nombrePlanModificar').value = data.infoPlanParaModificar['nombre'];
                    document.getElementById('fechaInicioCrearPlanModificar').value = data.infoPlanParaModificar['fecha_inicio'];
                    document.getElementById('fechaFinCrearPlanModificar').value = data.infoPlanParaModificar['fecha_fin'];
                    document.getElementById('fechaMaximaIncribcionCrearPlanModificar').value = data.infoPlanParaModificar['fecha_maxInscripcion'];
                    document.getElementById('horaMaximaInscribcionCrearPlanModificar').value = data.infoPlanParaModificar['hora_maximaInscripcion'];
                    document.getElementById('precioCrearPlanModificar').value = data.infoPlanParaModificar['precio'];
                    document.getElementById('descripcionCrearPlanModificar').value = data.infoPlanParaModificar['definicion'];
                }
            }
        })
}
function limpiarFormularioModificacionPlan() {
    const form = document.getElementById("formModificarPlan");
  
    // Limpiar todos los campos de texto, fecha, hora y número
    form.reset();
  
    // Limpiar los errores (si existen)
    const errorDivs = form.querySelectorAll("div[id^='error']");
    errorDivs.forEach(errorDiv => {
      errorDiv.innerHTML = '';
    });
  
    // Ocultar el mensaje de feedback
    const mensajeFeedback = document.getElementById("mensajeFeedbackCrearPlanModificar");
    if (mensajeFeedback) {
      mensajeFeedback.style.display = "none";
    }
  }

  

//VALIDACION DE CAMPO
//validacion de fecha inicio
function validaModificacionNombrePlan() {
    if (document.getElementById('nombrePlanModificar').value.trim() == "") {
        mostrarError(document.getElementById('errorNombrePlanModificar'), "El nombre no puede estar vacio")
    } else {
        mostrarError(document.getElementById('errorNombrePlanModificar'), "")
    }
}
function validarModificacionFechaInicio() {
    //comprobar si existe o no 
    if (document.getElementById('fechaInicioCrearPlanModificar').value) {
        mostrarError(document.getElementById('errorFechaInicioCrearPlanModificar'), "")
        // Obtener la fecha ingresada
        const fechaInput = new Date(document.getElementById('fechaInicioCrearPlanModificar').value);
        // Obtener la fecha actual
        const fechaActual = new Date();
        // Establecer las horas, minutos y segundos de la fecha actual a 00:00:00 para hacer la comparación sin horas
        fechaActual.setHours(0, 0, 0, 0);

        // Comparar las fechas
        if (fechaInput < fechaActual) {
            mostrarError(document.getElementById('errorFechaInicioCrearPlanModificar'), "La fecha no puede ser pasado")
        } else if (fechaInput > fechaActual) {
            //en caso de ser futuro
            mostrarError(document.getElementById('errorFechaInicioCrearPlanModificar'), "")
        } else {
            //en caso si es hoy
            mostrarError(document.getElementById('errorFechaInicioCrearPlanModificar'), "")
        }
    } else {
        mostrarError(document.getElementById('errorFechaInicioCrearPlanModificar'), "La fecha no puede ser vacia")
    }

}


//validacion de fecha fin
function validarModificacionFechaFin() {
    if (document.getElementById('fechaFinCrearPlanModificar').value) {
        mostrarError(document.getElementById('errorFechaCrearPlanModificar'), "")
        // Obtener la fecha ingresada
        const fechaInput = new Date(document.getElementById('fechaFinCrearPlan').value);
        // Obtener la fecha actual
        const fechaActual = new Date();
        // Establecer las horas, minutos y segundos de la fecha actual a 00:00:00 para hacer la comparación sin horas
        fechaActual.setHours(0, 0, 0, 0);

        // Comparar las fechas
        if (fechaInput < fechaActual) {
            mostrarError(document.getElementById('errorFechaCrearPlanModificar'), "La fecha no puede ser pasado")
        } else if (fechaInput > fechaActual) {
            //en caso de ser futuro
            mostrarError(document.getElementById('errorFechaCrearPlanModificar'), "")
            comprobarModificacionDuracionFechas();
        } else {
            //en caso si es hoy
            mostrarError(document.getElementById('errorFechaCrearPlanModificar'), "")
            comprobarModificacionDuracionFechas();
        }
    } else {
        mostrarError(document.getElementById('errorFechaCrearPlanModificar'), "La fecha no puede ser vacia")
    }

    //funcion que comprueba si es los dos fechas tiene sentido o no 
    function comprobarModificacionDuracionFechas() {
        const fechaInicioInput = new Date(document.getElementById('fechaInicioCrearPlanModificar').value);
        const fechaFinInput = new Date(document.getElementById('fechaFinCrearPlanModificar').value);

        //comparamos los fechas
        if (fechaInicioInput > fechaFinInput) {
            mostrarError(document.getElementById('errorFechaCrearPlanModificar'), "La fecha puede finalizarse antes de iniciarse")
        } else {
            mostrarError(document.getElementById('errorFechaCrearPlanModificar'), "")
        }
    }
}

//validar la fecha maxima de inscripcion 
function validarModificacionFechaMaximaInscripcion() {
    if (document.getElementById('fechaMaximaIncribcionCrearPlanModificar').value) {
        mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlanModificar'), "")

        // Obtener la fecha ingresada
        const fechaInput = new Date(document.getElementById('fechaMaximaIncribcionCrearPlanModificar').value);
        // Obtener la fecha actual
        const fechaActual = new Date();
        // Establecer las horas, minutos y segundos de la fecha actual a 00:00:00 para hacer la comparación sin horas
        fechaActual.setHours(0, 0, 0, 0);

        // Comparar las fechas
        if (fechaInput < fechaActual) {
            mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlanModificar'), "La fecha maxima de inscripcion no puede ser pasado")
        } else if (fechaInput > fechaActual) {
            //en caso de ser futuro
            mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlanModificar'), "")
            comprobarModificacionSiIniciaONo();

        } else {
            //en caso si es hoy
            mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlanModificar'), "")
            comprobarModificacionSiIniciaONo();
        }
    } else {
        mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlanModificar'), "La fecha maxima de inscripcion no puede ser vacio")
    }


    //funcion que se comprueba si se asignado el fecha de inicio tiene que ser menor que fecha de inicio
    function comprobarModificacionSiIniciaONo() {
        if (document.getElementById('fechaInicioCrearPlanModificar')) {
            const fechaInicioInput = new Date(document.getElementById('fechaInicioCrearPlanModificar').value);
            const fechaMaximaInput = new Date(document.getElementById('fechaMaximaIncribcionCrearPlanModificar').value);

            if (fechaInicioInput < fechaMaximaInput) {
                mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlanModificar'), "La fecha maxima de inscripcion no puede ser despues del inicio")
            } else {
                mostrarError(document.getElementById('errorFechaMaximaIncribcionCrearPlanModificar'), "")
            }
        }
    }
}

//validar la hora maxima 
function validarModificacionHoraMaximaInscripcion() {
    const horaMaximaInput = document.getElementById('horaMaximaInscribcionCrearPlanModificar').value;
    const fechaMaximaInput = document.getElementById('fechaMaximaIncribcionCrearPlanModificar').value;

    if (horaMaximaInput) {
        mostrarError(document.getElementById('errorHoraMaximaInscribcionCrearPlanModificar'), "");

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
                    mostrarError(document.getElementById('errorHoraMaximaInscribcionCrearPlanModificar'), "La hora máxima de inscripción no puede ser anterior a la hora actual.");
                } else {
                    mostrarError(document.getElementById('errorHoraMaximaInscribcionCrearPlanModificar'), ""); // No hay error
                }
            }
        }
    } else {
        mostrarError(document.getElementById('errorHoraMaximaInscribcionCrearPlanModificar'), "La hora no puede estar vacía.");
    }

}

//validacion de precio
function validarModificacionPrecio() {
    if (document.getElementById('precioCrearPlanModificar').value.trim() == "") {
        mostrarError(document.getElementById('errorPrecioCrearPlanModificar'), "El precio no puede ser nulo")
    } else {
        mostrarError(document.getElementById('errorPrecioCrearPlanModificar'), "")
    }
}

//validar Descripcion 
function validarModificacionDescripcion() {
    if (document.getElementById('descripcionCrearPlanModificar').value.trim() == "") {
        mostrarError(document.getElementById('errorDescripcionCrearPlaModificarn'), "El definicion no puede estar vacio")
    } else {
        mostrarError(document.getElementById('errorDescripcionCrearPlaModificarn'), "")
    }
}


//UTILIZAR LOS VALIDACIONES
document.getElementById('nombrePlanModificar').onblur = validaModificacionNombrePlan;
document.getElementById('fechaInicioCrearPlanModificar').onblur = validarModificacionFechaInicio;
document.getElementById('fechaFinCrearPlanModificar').onblur = validarModificacionFechaFin;
document.getElementById('fechaMaximaIncribcionCrearPlanModificar').onblur = validarModificacionFechaMaximaInscripcion;
document.getElementById('horaMaximaInscribcionCrearPlanModificar').onblur = validarModificacionHoraMaximaInscripcion;
document.getElementById('precioCrearPlanModificar').onblur = validarModificacionPrecio;
document.getElementById('descripcionCrearPlanModificar').onblur = validarModificacionDescripcion;

document.getElementById('nombrePlanModificar').oninput = validaModificacionNombrePlan;
document.getElementById('fechaInicioCrearPlanModificar').oninput = validarModificacionFechaInicio;
document.getElementById('fechaFinCrearPlanModificar').oninput = validarModificacionFechaFin;
document.getElementById('fechaMaximaIncribcionCrearPlanModificar').oninput = validarModificacionFechaMaximaInscripcion;
document.getElementById('horaMaximaInscribcionCrearPlanModificar').oninput = validarHoraMaximaInscripcion;
document.getElementById('precioCrearPlanModificar').oninput = validarModificacionPrecio;
document.getElementById('descripcionCrearPlanModificar').oninput = validarModificacionDescripcion;



//CUADO DAMOS EL BOTON DE CREAR
formularioModificarPlan = document.getElementById('formModificarPlan');
formularioModificarPlan.onsubmit = async function (event) {
    // Prevenir el envío del formulario al inicio
    event.preventDefault();

    //validamos otra vez por si acaso 
    validaModificacionNombrePlan();
    validarModificacionFechaInicio();
    validarModificacionFechaFin();
    validarModificacionFechaMaximaInscripcion();
    validarHoraMaximaInscripcion();
    validarModificacionPrecio();
    validarModificacionDescripcion();

    //comprobamos si hay error o no 
    if (
        checkError(document.getElementById('errorNombrePlanModificar')) &&
        checkError(document.getElementById('errorFechaInicioCrearPlanModificar')) &&
        checkError(document.getElementById('errorFechaCrearPlanModificar')) &&
        checkError(document.getElementById('errorFechaMaximaIncribcionCrearPlanModificar')) &&
        checkError(document.getElementById('errorHoraMaximaInscribcionCrearPlanModificar')) &&
        checkError(document.getElementById('errorPrecioCrearPlanModificar')) &&
        checkError(document.getElementById('errorDescripcionCrearPlaModificarn'))) {
        // Si no hay errores en ninguno de los campos, continuar con el proceso
        // Aquí puedes agregar la lógica para enviar el formulario o mostrar un mensaje de éxito
        mostrarError(document.getElementById('errorModificarPlanModificar'), "")
        //SIGUENTE PASO 
        crearPlan(
            document.getElementById('nombrePlanModificar').value,
            document.getElementById('fechaInicioCrearPlanModificar').value,
            document.getElementById('fechaFinCrearPlanModificar').value,
            document.getElementById('fechaMaximaIncribcionCrearPlanModificar').value,
            document.getElementById('horaMaximaInscribcionCrearPlanModificar').value,
            document.getElementById('precioCrearPlanModificar').value,
            document.getElementById('descripcionCrearPlanModificar').value,
        )
    } else {
        // Si hay algún error, evitar el envío y mostrar el mensaje de error
        mostrarError(document.getElementById('errorModificarPlanModificar'), "Hay campos del formulario no completado")
    }

    function crearPlan(nombre, fechaInicio, fechaFin, fechaMaxima, horaMaxima, precio, descripcion) {
        fetch("../Server/GestionarGestionarPlanesAdmin.php", {
            method: "POST", // Método de la solicitud
            headers: {
                "Content-type": "application/json", // Tipo de contenido de la solicitud
            },
            body: JSON.stringify({
                //enviamos datos para la consulta
                modificarnombreAgregatPlan: nombre,
                modificarfechaInicioCrearPlan: fechaInicio,
                modificarfechaFinCrearPlan: fechaFin,
                modificarfechaMaximaCrearPlan: fechaMaxima,
                modificarhoraMaximaCrearPlan: horaMaxima,
                modificarprecioCrearPlan: precio,
                modificardescripcionCrearPlan: descripcion,
                modificarIDPlan : idPlanParaMofificarGlobal
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener datos del servidor."); // Manejo de error si la respuesta no es OK
                }
                return response.json(); // Convertir la respuesta a JSON
            })
            .then((data) => {
                let mensajeFeedbackPlan = document.getElementById("mensajeFeedbackCrearPlanModificar"); //sacamos el div del html 
                // Comprobar si hay un error en la respuesta
                if (data.error) {
                    console.log("2Error: " + data.error); // Mostrar en consola el error
                } else {
                    if (data.modificarPlan) {
                        if (data.modificarPlan == 'ok') {
                            // Éxito
                            document.getElementById('errorModificarPlanModificar').innerHTML = "";
                            mensajeFeedbackPlan.style.display = "block";
                            mensajeFeedbackPlan.style.color = "green";
                            mensajeFeedbackPlan.innerText = "Plan Modificado 🎉";
                            // Deshabilitamos el botón
                            document.getElementById('btnCrearPlanConfirmarModificar').disabled = true;
                            // cerrar el overlay despues de 2s
                            //repintar la lista
                            pintarTabla()
                            setTimeout(() => {
                                mensajeFeedbackPlan.style.display = "none";
                                document.getElementById("overlayModificarPlan").classList.remove("activeOverlayModificarPlan"); // Quitar clase para ocultar el overlay
                                document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                                // habilitamos el botón
                                document.getElementById('btnCrearPlanConfirmarModificar').disabled = false;
                            }, 2000);
                        } else {
                             // Éxito
                             document.getElementById('errorModificarPlanModificar').innerHTML = "";
                             mensajeFeedbackPlan.style.display = "block";
                             mensajeFeedbackPlan.style.color = "red";
                             mensajeFeedbackPlan.innerText = "Plan no Modificado ";
                             // Deshabilitamos el botón
                             document.getElementById('btnCrearPlanConfirmarModificar').disabled = true;
                             // cerrar el overlay despues de 2s
                            //repintar la lista
                            pintarTabla()
                             setTimeout(() => {
                                mensajeFeedbackPlan.style.display = "none";
                                 document.getElementById("overlayModificarPlan").classList.remove("activeOverlayModificarPlan"); // Quitar clase para ocultar el overlay
                                 document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                                 // habilitamos el botón
                                 document.getElementById('btnCrearPlanConfirmarModificar').disabled = false;
                             }, 2000);
                        }
                    }else{
                        alert("???")
                    }

                }
            });
    }
}

//cuando presionamos el eliminar, aparecer el el overlay de seguro?
document.getElementById('btnEliminarPlan').addEventListener('click', ()=>{
//mostramos el overlay
document.getElementById("overlayComprobarEliminar").classList.add("activeOverlayComprobarEliminar"); // Quitar clase para ocultar el overlay
document.body.classList.add('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento

})

//cerra el overlay de comprobacion 
//cuando hacemos click el boton de cerrar de modificar plan
document.querySelector('.closeBtnComprobarEliminar').addEventListener('click', () => {
    //mostramos el overlay
    document.getElementById("overlayComprobarEliminar").classList.remove("activeOverlayComprobarEliminar"); // Quitar clase para ocultar el overlay
    document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento

});
//cuando hacemos click el boton de volver de Modificar plan
document.getElementById('btnVolverComprobarEliminar').addEventListener('click', () => {
    //mostramos el overlay
    document.getElementById("overlayComprobarEliminar").classList.remove("activeOverlayComprobarEliminar"); // Quitar clase para ocultar el overlay
    document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
});

//boton de confirmacion de eliminar
document.getElementById('btnEliminarComprobarEliminar').addEventListener('click', ()=>{
    fetch("../Server/GestionarGestionarPlanesAdmin.php", {    //espera a terminar el conexion
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            id_planParaEliminar : idPlanParaMofificarGlobal
        }),

    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener datos del servidor para el relleno de dato."); // Manejo de error si la respuesta no es OK
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then((data) => {
            let mensajeFeedbackPlan = document.getElementById("mensajeFeedbackComprobarEliminar"); //sacamos el div del html 

            // Comprobar si hay un error en la respuesta
            if (data.error) {
                console.log("erro de eliminar plan: " + data.error); // Mostrar en consola el error
                 // Éxito
                 document.getElementById('errorComprobarEliminar').innerHTML = "";
                 mensajeFeedbackPlan.style.display = "block";
                 mensajeFeedbackPlan.style.color = "red";
                 mensajeFeedbackPlan.innerText = "No ha podido Eliminar este plan";
                 // Deshabilitamos el botón
                 document.getElementById('btnEliminarComprobarEliminar').disabled = true;
                 // cerrar el overlay despues de 2s
                 //repintar la lista
                 pintarTabla()
                 setTimeout(() => {
                    mensajeFeedbackPlan.style.display = "none";
                    //  document.getElementById("overlayModificarPlan").classList.remove("activeOverlayModificarPlan"); // Quitar clase para ocultar el overlay
                    //  document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                     // habilitamos el botón
                     document.getElementById('btnEliminarComprobarEliminar').disabled = false;
                 }, 2000);
            } else {
                if (data.eliminarPlan){
                   if (data.eliminarPlan == 'ok'){
                      // Éxito
                      document.getElementById('errorComprobarEliminar').innerHTML = "";
                      mensajeFeedbackPlan.style.display = "block";
                      mensajeFeedbackPlan.style.color = "green";
                      mensajeFeedbackPlan.innerText = "Plan Eliminado 🎉";
                      // Deshabilitamos el botón
                      document.getElementById('btnEliminarComprobarEliminar').disabled = true;
                      // cerrar el overlay despues de 2s
                      //repintar la lista
                      pintarTabla()
                      setTimeout(() => {
                        mensajeFeedbackPlan.style.display = "none";
                        document.getElementById("overlayComprobarEliminar").classList.remove("activeOverlayComprobarEliminar"); // Quitar clase para ocultar el overlay
                          document.getElementById("overlayModificarPlan").classList.remove("activeOverlayModificarPlan"); // Quitar clase para ocultar el overlay
                          document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                          // habilitamos el botón
                          document.getElementById('btnEliminarComprobarEliminar').disabled = false;
                      }, 2000);
                   }else{
                     // Éxito
                     document.getElementById('errorComprobarEliminar').innerHTML = "";
                     mensajeFeedbackPlan.style.display = "block";
                     mensajeFeedbackPlan.style.color = "green";
                     mensajeFeedbackPlan.innerText = "Plan Eliminado 🎉";
                     // Deshabilitamos el botón
                     document.getElementById('btnEliminarComprobarEliminar').disabled = true;
                     // cerrar el overlay despues de 2s
                     //repintar la lista
                     pintarTabla()
                     setTimeout(() => {
                        mensajeFeedbackPlan.style.display = "none";
                         document.getElementById("overlayModificarPlan").classList.remove("activeOverlayModificarPlan"); // Quitar clase para ocultar el overlay
                         document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                         // habilitamos el botón
                         document.getElementById('btnEliminarComprobarEliminar').disabled = false;
                     }, 2000);
                   }
                }else{
                     // Éxito
                     document.getElementById('errorComprobarEliminar').innerHTML = "";
                     mensajeFeedbackPlan.style.display = "block";
                     mensajeFeedbackPlan.style.color = "red";
                     mensajeFeedbackPlan.innerText = "No ha podido Eliminar porque hay ninos enlazado a este plan";
                     // Deshabilitamos el botón
                     document.getElementById('btnEliminarComprobarEliminar').disabled = true;
                     // cerrar el overlay despues de 2s
                     //repintar la lista
                     pintarTabla()
                     setTimeout(() => {
                        mensajeFeedbackPlan.style.display = "none";
                        //  document.getElementById("overlayModificarPlan").classList.remove("activeOverlayModificarPlan"); // Quitar clase para ocultar el overlay
                        //  document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                         // habilitamos el botón
                         document.getElementById('btnEliminarComprobarEliminar').disabled = false;
                     }, 2000);
                }
            }
        })
})



    //cuando hacemos click el boton de cerrar de añadir grupo
    document
        .querySelector(".closeBtnModificarNino")
        .addEventListener("click", () => {
            //mostramos el overlay
            document
                .getElementById("overlayModificarNino")
                .classList.remove("activeOverlayModificarNino"); // Quitar clase para ocultar el overlay
            document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
        });
    //cuando hacemos click el boton de volver de añadir grupo
    document
        .getElementById("btnVolverModificarNino")
        .addEventListener("click", () => {
            //mostramos el overlay
            document
                .getElementById("overlayModificarNino")
                .classList.remove("activeOverlayModificarNino"); // Quitar clase para ocultar el overlay
            document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
        });


//CERRAR LISTA DE NINOS
document.querySelector(".closeBtnListaNinos").addEventListener("click", () => {
    //mostramos el overlay
    document
        .getElementById("overlayListaNinos")
        .classList.remove("activeOverlayListaNinos"); // Quitar clase para ocultar el overlay
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
});
//cuando hacemos click el boton de volver de lista nino
document.getElementById("btnVolverListaNinos").addEventListener("click", () => {
    //mostramos el overlay
    document
        .getElementById("overlayListaNinos")
        .classList.remove("activeOverlayListaNinos"); // Quitar clase para ocultar el overlay
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
});

//APRIMOS EL OVERLAY DE LISTADO DE NINOS 
//este valor se actualiza cada vez que presionamos el boton operar(cada vez que se abre la overlay de modificar)
let idPlanParaMofificarGlobal2 = null;   //inicializamos
function mostrarOverlayNinos(id_planSeleccionado) {
    idPlanParaMofificarGlobal2 = id_planSeleccionado
    console.log(`id de plan para consulta es ${idPlanParaMofificarGlobal2}`);
    //limpiarFormularioListaNinos()  //limpiamos el formulario
    //mostramos el overlay
    document
        .getElementById("overlayListaNinos")
        .classList.add("activeOverlayListaNinos"); // Quitar clase para mostrar el overlay
    document.body.classList.add("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento
    pintarListaNino()   //pintamos la lista de ninos
}

//funcion para pintar la lista de ninos 
//CONEXION AL BBDD PARA SACAR LOS INFORMACION DEL GRUPO SELECCCIONADO
function pintarListaNino(){
 //haccemos consulta al bbdd
 fetch("../Server/GestionarGestionarPlanesAdmin.php", {
    method: "POST", // Método de la solicitud
    headers: {
        "Content-type": "application/json", // Tipo de contenido de la solicitud
    },
    body: JSON.stringify({
        //enviamos datos para la consulta
        idPlanSeleccionadoParaConsultaLista: idPlanParaMofificarGlobal2
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
            if (data.ninosEnElGrupo.length == 0) {
                document.getElementById("tablaActividad2").classList.add("oculto"); // Ocultar el tabla
                document.getElementById("infoTabla2").innerText =
                    "No tiene ningun Ninos ";
            } else {
                console.log(data.ninosEnElGrupo)
                document.getElementById("infoTabla2").innerText = '';
                //en caso si hay respuesta
                document.getElementById("tablaActividad2").classList.remove("oculto"); // mostramos la tabladocument.getElementById("infoTabla").innerText = "";
                //imprimimos la lista de actividades
                const tabla = document
                    .getElementById("tablaActividad2")
                    .getElementsByTagName("tbody")[0]; // Obtener el cuerpo de la tabla
                tabla.innerHTML = ""; // Limpiar el contenido anterior de la tabla
                const rutaPredefinida = "../assets/img/avatar.png";
                //iteramos la respuesta
                data.ninosEnElGrupo.forEach((nino) => {
                    const nuevaFila = tabla.insertRow(); // Crear una nueva fila en la tabla

                    const celda1 = nuevaFila.insertCell(); // Crear la primera celda
                    celda1.innerHTML = `<img src="${nino.avatar_src || rutaPredefinida
                        }" alt="${nino.nombre}" />`;

                    const celda2 = nuevaFila.insertCell(); // Crear la segunda celda
                    celda2.innerHTML = `${nino.nombre}`; // Introducir información en la segunda celda

                    const celda3 = nuevaFila.insertCell(); // Crear la segunda celda
                    celda3.innerHTML = nino.pagado === 1 ? "Pagado" : "No Pagado";

                    const celda4 = nuevaFila.insertCell(); // Crear la segunda celda
                    if (nino.fecha_inicio){
                        celda4.innerHTML = `${nino.fecha_inicio} - ${nino.fecha_fin}`; // Introducir información en la segunda celda
                    }else{
                        celda4.innerHTML = "No tiene Plan "
                    }

                    const celda5 = nuevaFila.insertCell(); // Crear la cuarta celda
                    celda5.innerHTML = `
                <button class="verMasBtn" onclick="mostrarOverlayModificarDatosNino('${nino.id_nino}')" id="btnModificarDatosNino">Modificar</button>
                <button class="verMasBtn" onclick="mostrarOverlayEliminarNino('${nino.id_nino}')" id="btnEliminarNino">Quitar del Plan</button>
                `;
                });
            }
        }
    });
}

//MOSTRA OVERLAY DE ELIMINAR NIÑOS EN LA LISTA DE GRUPO
let idNinoSeleccionadoGlobalParaEliminar = 0;
function mostrarOverlayEliminarNino(idNinoSelecciona) {
    
    idNinoSeleccionadoGlobalParaEliminar = idNinoSelecciona;
    console.log(`id de nino para ELIMINAR:  ${idNinoSeleccionadoGlobalParaEliminar}`);
    // limpiarFormularioEliminarNino()
    document
        .getElementById("overlayComprobarEliminarPersona")
        .classList.add("activeOverlayComprobarEliminarPersona"); // Quitar clase para mostrar el overlay
    document.body.classList.add("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento

    document
    .querySelector(".closeBtnComprobarEliminarPersona")
    .addEventListener("click", () => {
        //mostramos el overlay
        document
            .getElementById("overlayComprobarEliminarPersona")
            .classList.remove("activeOverlayComprobarEliminarPersona"); // Quitar clase para ocultar el overlay
        document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
    });
//cuando hacemos click el boton de volver de añadir plan
document
    .getElementById("btnVolverComprobarEliminarPersona")
    .addEventListener("click", () => {
        //mostramos el overlay
        document
            .getElementById("overlayComprobarEliminarPersona")
            .classList.remove("activeOverlayComprobarEliminarPersona"); // Quitar clase para ocultar el overlay
        document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
    });

    //cuando presionamos el boton de borrar
    document
        .getElementById("btnEliminarComprobarEliminarPersona")
        .addEventListener("click", () => {
            //hace el borado
            fetch("../Server/GestionarGestionarPlanesAdmin.php", {
                method: "POST", // Método de la solicitud
                headers: {
                    "Content-type": "application/json", // Tipo de contenido de la solicitud
                },
                body: JSON.stringify({
                    //enviamos datos para la consulta
                    idNinoSeleccionaParaEliminar: idNinoSeleccionadoGlobalParaEliminar
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
                        if (data.EliminarNino) {
                            if (data.EliminarNino == "ok") {
                                // Éxito
                                document.getElementById(
                                    "errorComprobarEliminarPersona"
                                ).innerHTML = "";
                                mensajeFeedbackOperar.style.display = "block";
                                mensajeFeedbackOperar.style.color = "green";
                                mensajeFeedbackOperar.innerText =
                                    "El Niño eliminado con éxito 🎉";
                                pintarListaNino(); //repintar la lista
                                // Deshabilitamos el botón
                                document.getElementById(
                                    "btnEliminarComprobarEliminarPersona"
                                ).disabled = true;
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
        });
}
//mostrar overlay y iniciar HAY QUE ESTA FUERA DE TODO PARA QUE SE FUNCIONA
let idNinoSeleccionadoGlobal = 0;
function mostrarOverlayModificarDatosNino(idNinoSelecciona) {
    console.log(`id para consulta es ${idNinoSelecciona}`);
    idNinoSeleccionadoGlobal = idNinoSelecciona;
    limpiarFormularioModificarNino();
    //mostramos el overlay
    document
        .getElementById("overlayModificarNino")
        .classList.add("activeOverlayModificarNino"); // Quitar clase para mostrar el overlay
    document.body.classList.add("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento
    //CONEXION AL BBDD PARA SACAR LOS INFORMACION DEL GRUPO SELECCCIONADO
    //haccemos consulta al bbdd
    fetch("../Server/GestionarGestionarPlanesAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            idNinoSeleccionadoParaModificar: idNinoSelecciona,
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
                //recibiendo respuesta

                //inserts de datos a imputs
                if (data.infoninoParaModificar) {

                    document.getElementById("nombreNino").value =
                        data.infoninoParaModificar["nombre"];
                    if (data.infoninoParaModificar["pagado"] == 1) {
                        document.getElementById("pagadoSi").checked = true;
                    } else {
                        document.getElementById("pagadoNo").checked = true;
                    }
                    
                    planNinoBBDD = data.idPlanBBDD["id_plan"];
                    grupoNinoBBDD = data.idGrupoBBDD["id_grupo"];

                    document.getElementById("contenedorSelectGrupoNino").innerHTML = `

                    <select id="grupoNino" name="grupoNino">
                    <option value="0">Seleccione un rupo</option>
                    ${data.infoGruposninoExistente
                            .map(
                                (grupo) => `
                        <option value="${grupo.id_grupo}" ${grupo.id_grupo == grupoNinoBBDD ? "selected" : ""
                                    }>
                            ${grupo.nombre}
                        </option>
                    `
                            )
                            .join("")}
                </select>
            `;

                    document.getElementById("contenedorSelectPlanNino").innerHTML = `

                    <select id="planNino" name="planNino">
                    <option value="0">Seleccione un Plan</option>
                    ${data.infoPlanFechaninoExistente
                            .map(
                                (plan) => `
                        <option value="${plan.id_plan}" ${plan.id_plan == planNinoBBDD ? "selected" : ""
                                    }>
                            ${plan.fecha_inicio} - ${plan.fecha_fin}
                        </option>
                    `
                            )
                            .join("")}
                </select>
            `;
                }
            }
        });

    //validaciones plan
    function validarPlanModificar() {
        if (document.getElementById("planNino").value == 0) {
            mostrarError(
                document.getElementById("errorSelecionPlanNino"),
                "Por favor, selecciona un plan"
            );
        } else {
            mostrarError(document.getElementById("errorSelecionPlanNino"), "");
        }
    }

    //validaciones grupo
    function validarGrupoModificar() {
        if (document.getElementById("grupoNino").value == 0) {
            mostrarError(
                document.getElementById("errorSelecionGrupoNino"),
                "Por favor, selecciona un grupo"
            );
        } else {
            mostrarError(document.getElementById("errorSelecionGrupoNino"), "");
        }
    }

    //utilizar los validaciones
    document.getElementById("contenedorSelectPlanNino").onblur =
        validarPlanModificar;
    document.getElementById("contenedorSelectGrupoNino").onblur =
        validarGrupoModificar;

    document.getElementById("contenedorSelectPlanNino").oninput =
        validarPlanModificar;
    document.getElementById("contenedorSelectGrupoNino").oninput =
        validarGrupoModificar;

    //funcion que limpia el formulario
    function limpiarFormularioModificarNino() {
        // Limpiar campos de texto
        document.getElementById("nombreNino").value = "";

        // Limpiar botones de radio (desmarcar ambos)
        document.getElementById("pagadoSi").checked = false;
        document.getElementById("pagadoNo").checked = false;

        // Limpiar selectores (establecer el valor por defecto)
        document.getElementById("planNino").value = "0";
        document.getElementById("grupoNino").value = "0";

        // Limpiar mensajes de error
        document.getElementById("errorSelecionPlanNino").innerHTML = "";
        document.getElementById("errorSelecionGrupoNino").innerHTML = "";
        document.getElementById("errorModificarModificarNino").innerHTML = "";
        document.getElementById("mensajeFeedbackModificarNino").style.display =
            "none";

        // Rehabilitar el campo nombre (en caso de que estuviera deshabilitado)
        document.getElementById("nombreNino").disabled = true;
    }

    //cuando hace el submit
    let formulariomodificar = document.getElementById("formModificarNino");
    formulariomodificar.onsubmit = async function (event) {
        // Prevenir el envío del formulario al inicio
        event.preventDefault();

        //comprobamos los dayos por si acaso
        validarPlanModificar();
        validarGrupoModificar();

        //comprobamos si hay error de validacion
        if (
            checkError(document.getElementById("errorSelecionPlanNino")) &&
            checkError(document.getElementById("errorSelecionGrupoNino"))
        ) {
            mostrarError(document.getElementById("errorModificarModificarNino"), ""); //limpiar
            //SIGUIENTE PASO
            //sacamos el valor de pagado o no
            let numPag = document.querySelector('input[name="padago"]:checked').value;
            console.log(numPag);
            actualizarModificacionNino(
                idNinoSelecciona,
                numPag,
                document.getElementById("planNino").value,
                document.getElementById("grupoNino").value
            );
        } else {
            mostrarError(
                document.getElementById("errorModificarModificarNino"),
                "el formulario hay campos no rellenos "
            );
        }
    };

    //insert a bbdd
    function actualizarModificacionNino(
        idNinoSeleccionaa2,
        pagado2,
        id_plan2,
        id_grupo2
    ) {
        fetch("../Server/GestionarGestionarPlanesAdmin.php", {
            method: "POST", // Método de la solicitud
            headers: {
                "Content-type": "application/json", // Tipo de contenido de la solicitud
            },
            body: JSON.stringify({
                //enviamos datos para la consulta
                idNinoSeleccionaa2: idNinoSeleccionaa2,
                pagado2: pagado2,
                id_plan2: id_plan2,
                id_grupo2: id_grupo2
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
                    //recibiendo respuesta
                    if (data.modificarNino == "ok") {
                        // Éxito
                        document.getElementById("errorModificarModificarNino").innerHTML =
                            "";
                        mensajeFeedbackModificarNino.style.display = "block";
                        mensajeFeedbackModificarNino.style.color = "green";
                        mensajeFeedbackModificarNino.innerText =
                            "Nino actualizado con éxito 🎉";
                        // Deshabilitamos el botón
                        document.getElementById(
                            "btnModificarModificarNino"
                        ).disabled = true;
                        pintarListaNino()    //repintar la lista
                        // cerrar el overlay despues de 2s
                        setTimeout(() => {
                            mensajeFeedbackModificarNino.style.display = "none";
                            document
                                .getElementById("overlayModificarNino")
                                .classList.remove("activeOverlayModificarNino"); // Quitar clase para ocultar el overlay
                            // habilitamos de nuevo el botón
                            document.getElementById(
                                "btnModificarModificarNino"
                            ).disabled = false;

                        }, 2000);
                    } else {
                        // FALLO
                        document.getElementById("errorModificarModificarNino").innerHTML =
                            "";
                        mensajeFeedbackModificarNino.style.display = "block";
                        mensajeFeedbackModificarNino.style.color = "red";
                        mensajeFeedbackModificarNino.innerText = "Grupo no actualizado";
                        // Deshabilitamos el botón
                        document.getElementById(
                            "btnModificarModificarNino"
                        ).disabled = true;
                        pintarListaNino()     //repintar la lista

                        // cerrar el overlay despues de 3s
                        setTimeout(() => {
                            mensajeFeedbackModificarNino.style.display = "none";
                            document
                                .getElementById("overlayModificarNino")
                                .classList.remove("activeOverlayModificarNino"); // Quitar clase para ocultar el overlay
                            // habilitamos de nuevo el botón
                            document.getElementById(
                                "btnModificarModificarNino"
                            ).disabled = false;
                        }, 3000);
                    }
                }
            });
    }
}



//añadir nino en el plan 

//cuando hacemos click el boton de cerrar de añadir grupo (X)
document.querySelector(".closeBtnAñadirNinosGrupo").addEventListener("click", () => {
    //mostramos el overlay
    document.getElementById("overlayAñadirNinoAlGrupo").classList.remove("activeOverlayAñadirNinoAlGrupo"); // Quitar clase para ocultar el overlay
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
});

//cuando hacemos click el boton de volver de añadir grupo
document.getElementById("btnVolverAñadirNinoAlGrupo").addEventListener("click", () => {
    //mostramos el overlay
    document.getElementById("overlayAñadirNinoAlGrupo").classList.remove("activeOverlayAñadirNinoAlGrupo"); // Quitar clase para ocultar el overlay
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
});

//abrir el overlay
//variable globar del ninos seleccionado para insertar en la tabla
let idSeleccionadoNinoParaAgregar = 0;
let estadoPagado = null;
document.getElementById("btnAgregarNino").addEventListener("click", () => {
    console.log(`id de grupo seleccionado: ${idPlanParaMofificarGlobal2}`);
    //resetea el formulario 
    resetFormularioAñadirNino()
    document
        .getElementById("overlayAñadirNinoAlGrupo")
        .classList.add("activeOverlayAñadirNinoAlGrupo"); // Añadir clase para mostrar el overlay
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento


    //conectamos con el bbdd
    fetch("../Server/GestionarGestionarPlanesAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            seleccionarNinoParaAgregar: 'seleccionarNinoParaAgregar'
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
                console.log("Error sacar ninos no operados: " + data.error); // Mostrar en consola el error
            } else {
                if (data.ninosSinPlan) {

                    document.getElementById('contenedorSeleccionarNinoParaAgregar').innerHTML = `
                         <select name="seleccionarNinoParaAgregar" id="seleccionarNinoParaAgregar">
                            <option value="0">Seleccione un niño</option>
                            ${data.ninosSinPlan.map(nino => `
                                <option value="${nino.id_nino}">${nino.nombre}</option>
                            `).join('')}
                        </select>
                    `;
                    //cuando cambiamos de cambiar 
                    document.getElementById('seleccionarNinoParaAgregar').addEventListener('change', (event) => {
                        const idSeleccionado = parseInt(event.target.value, 10);
                        idSeleccionadoNinoParaAgregar = idSeleccionado; //pasamos al variable global 
                        console.log(`El ninos seleccionado para agregar es: ${idSeleccionadoNinoParaAgregar}`)
                        //buscamos el id en el data.ninosSinGrupo
                        const ninoSeleccionado = data.ninosSinPlan.find(nino => nino.id_nino === idSeleccionado);
                        console.log(data.ninosSinPlan)

                        //comprobamos si hay solucion o no 
                        if (ninoSeleccionado) {
                            // si no encentra
                            document.getElementById('infocSeleccionarNinoParaAgregar').classList.remove('oculto');
                            //mostramos el boton de cambiar 
                            document.getElementById('btnCrearAñadirNinoAlGrupo').classList.remove('oculto');
                            //en caso si lo envuantra
                            //sacamos el nombre
                            document.getElementById('nombreDelHijoSeleccionadoParaAgregar').value = ninoSeleccionado.nombre;
                            //imagen del nino
                            document.getElementById('imagenNinoSeleccionadoParaAgregar').src = ninoSeleccionado.avatar_src ? ninoSeleccionado.avatar_src : '../assets/img/avatar.png'; //aqui comprobamos si hay avatar_src o no, si no hay ponemos el predeterminado, y en caso de si se pone el que esta en bbdd
                            //comprobamos si esta pagado o no 
                            console.log("Valor de pagado:", ninoSeleccionado.pagado);
                            if (parseInt(ninoSeleccionado.pagado, 10) === 0) {  //10 = base decibal
                                //en caso de no esta pagado
                                document.getElementById('ninoPagadoONoNo').checked = true;
                                document.getElementById('ninoPagadoONoSi').checked = false;
                            } else {
                                //en caso si esta pagado 
                                document.getElementById('ninoPagadoONoNo').checked = false;
                                document.getElementById('ninoPagadoONoSi').checked = true;
                            }
                        } else {
                            // si no encentra
                            document.getElementById('infocSeleccionarNinoParaAgregar').classList.add('oculto');
                        }

                    })
                }
            }

        })





});
//funcion que limpia el formulario
function resetFormularioAñadirNino() {
    // Restablecer el valor del select
    document.getElementById('seleccionarNinoParaAgregar').value = '0';

    // Ocultar la sección de información del niño
    document.getElementById('infocSeleccionarNinoParaAgregar').classList.add('oculto');
    document.getElementById('btnCrearAñadirNinoAlGrupo').classList.add('oculto');

    // Limpiar los campos de información del niño
    document.getElementById('nombreDelHijoSeleccionadoParaAgregar').value = '';
    document.getElementById('imagenNinoSeleccionadoParaAgregar').src = '../assets/img/avatar.png'; // Imagen por defecto

    // Limpiar los radio buttons
    document.getElementById('ninoPagadoONoNo').checked = false;
    document.getElementById('ninoPagadoONoSi').checked = false;

    // Limpiar cualquier mensaje de error o feedback
    document.getElementById('mensajeFeedbackAñadirNinoAlGrupo').style.display = 'none';
    document.getElementById('errorContenedorSeleccionarNinoParaAgregar').innerHTML = '';
    document.getElementById('errorCrearAñadirNinoAlGrupo').innerHTML = '';
}

// Llamar a la función en el evento adecuado, por ejemplo, al hacer clic en el botón "Volver"
document.getElementById('btnVolverAñadirNinoAlGrupo').addEventListener('click', resetFormularioAñadirNino);


//cuando hacemos click el boton de volver de añadir grupo (enbio al bbdd)
document.getElementById("btnCrearAñadirNinoAlGrupo").addEventListener("click", () => {
    console.log(`id de Plan seleccionado: ${idPlanParaMofificarGlobal2}`);
    //cuando enviamos el el submit del formulario
    document.getElementById('formAñadirNinoAlGrupo').onsubmit = async function (event) {
        // Prevenir el envío del formulario al inicio
        event.preventDefault();
        console.log(`id Nino para agregar: ${idSeleccionadoNinoParaAgregar}`)
        console.log(`id plan para agregar: ${idPlanParaMofificarGlobal2}`)
        console.log(`pagado: `)

        //si el nino esta pagado y lo enviamos
        const radioButtons = document.getElementsByName('ninoPagadoONo'); // Obtenemos todos los radio buttons con el mismo nombre
        for (let i = 0; i < radioButtons.length; i++) {
            if (radioButtons[i].checked) { // Si el radio button está seleccionado
                estadoPagado = radioButtons[i].value; // Guardamos el valor del seleccionado
                break; // Salimos del bucle una vez que encontramos el seleccionado
            }
        }
        console.log(`el estado de pago del nino: ${idSeleccionadoNinoParaAgregar} es ${estadoPagado}`)
        if (document.getElementById('ninoPagadoONoSi').checked == true) {
            insertarAlGrupo();
        } else {
            //mostramos el overlay para comprobar
            document.getElementById("overlayComprobarNoPagado").classList.add("activeComprobarNoPagado"); // Añadir clase para mostrar el overlay
            document.body.classList.add("body-fondo-bloqueado"); // bloquea el fondo y el desplazamiento
        }

        function insertarAlGrupo() {
            //si el nino esta pagado 
            fetch("../Server/GestionarGestionarPlanesAdmin.php", {
                method: "POST", // Método de la solicitud
                headers: {
                    "Content-type": "application/json", // Tipo de contenido de la solicitud
                },
                body: JSON.stringify({
                    //enviamos datos para la consulta
                    idSeleccionadoNinoParaAgregarAlGrupo: idSeleccionadoNinoParaAgregar,
                    idGrupoSeleccionadoParaNinoGlobalAlGrupo: idPlanParaMofificarGlobal2,
                    estadoPagado :estadoPagado


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
                        console.log("Error sacar ninos no operados: " + data.error); // Mostrar en consola el error
                    } else {
                        if (data.gregadoNinoGrupo) {
                            if (data.gregadoNinoGrupo == "ok") {
                                // Éxito
                                document.getElementById("errorComprobarNoPagado").innerHTML = "";
                                mensajeFeedbackAñadirNinoAlGrupo.style.display = "block";
                                mensajeFeedbackAñadirNinoAlGrupo.style.color = "green";
                                mensajeFeedbackAñadirNinoAlGrupo.innerText =
                                    "Niño Agregado con éxito 🎉";
                                repintarLista();    //repintar ala lista
                                // Deshabilitamos el botón
                                document.getElementById("btnCrearAñadirNinoAlGrupo").disabled = true;
                                // cerrar el overlay despues de 2s
                                setTimeout(() => {
                                    mensajeFeedbackAñadirNinoAlGrupo.style.display = "none";
                                    document
                                        .getElementById("overlayContenidoAñadirNinoAlGrupo")
                                        .classList.remove("activeOverlayAñadirNinoAlGrupo"); // Quitar clase para ocultar el overlay
                                    // habilitamos de nuevo el botón
                                    document.getElementById("btnCrearAñadirNinoAlGrupo").disabled = false;
                                }, 2000);
                            } else {
                                // FALLO
                                document.getElementById("errorComprobarNoPagado").innerHTML = "";
                                mensajeFeedbackAñadirNinoAlGrupo.style.display = "block";
                                mensajeFeedbackAñadirNinoAlGrupo.style.color = "red";
                                mensajeFeedbackAñadirNinoAlGrupo.innerText = "Nino no insertado";
                                // Deshabilitamos el botón
                                document.getElementById("btnCrearAñadirNinoAlGrupo").disabled = true;

                                // cerrar el overlay despues de 3s
                                setTimeout(() => {
                                    mensajeFeedbackAñadirNinoAlGrupo.style.display = "none";
                                    document
                                        .getElementById("overlayAñadirNinoAlGrupo")
                                        .classList.remove("activeOverlayAñadirNinoAlGrupo"); // Quitar clase para ocultar el overlay
                                    // habilitamos de nuevo el botón
                                    document.getElementById("btnCrearAñadirNinoAlGrupo").disabled = false;
                                }, 3000);
                            }
                        }
                    }
                })
        }

        //------------------------------------------------------------------------------------------------------------------------------------
        //action button del overlay overlayComprobarNoPagado
        //cuando damos el boton de volver
        document.getElementById('btnVolverComprobarNoPagado').addEventListener('click', () => {
            document.getElementById("overlayComprobarNoPagado").classList.remove("activeComprobarNoPagado"); // quitamos clase para mostrar el overlay
            document.body.classList.remove("body-fondo-bloqueado"); // bloquea el fondo y el desplazamiento
        })
        //cuando damos el boton de confirmar que no esta pagado
        document.getElementById('btnNoPagadoComprobarNoPagado').addEventListener('click', () => {
            insertarAlGrupo();
            document.getElementById("overlayComprobarNoPagado").classList.remove("activeComprobarNoPagado"); // quitamos clase para mostrar el overlay
            document.body.classList.remove("body-fondo-bloqueado"); // bloquea el fondo y el desplazamie


        })

    }

});
   

//---------------------------------------------------------------------------------------------------//





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