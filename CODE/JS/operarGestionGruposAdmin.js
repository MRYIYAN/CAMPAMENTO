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
    fetch("../Server/GestionarGestionarGrupoAdmin.php", {
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
                if (data.gruposDisponible.length == 0) {
                    document.getElementById("tablaActividad").classList.add("oculto"); // Ocultar el tabla
                    document.getElementById("infoTabla").innerText =
                        "No tiene ningun Grupo ";
                } else {
                    //en caso si hay respuesta
                    document.getElementById("tablaActividad").classList.remove("oculto"); // mostramos la tabladocument.getElementById("infoTabla").innerText = "";
                    //imprimimos la lista de actividades
                    const tabla = document
                        .getElementById("tablaActividad")
                        .getElementsByTagName("tbody")[0]; // Obtener el cuerpo de la tabla
                    tabla.innerHTML = ""; // Limpiar el contenido anterior de la tabla

                    //iteramos la respuesta
                    data.gruposDisponible.forEach((grupo) => {
                        const nuevaFila = tabla.insertRow(); // Crear una nueva fila en la tabla

                        const celda1 = nuevaFila.insertCell(); // Crear la primera celda
                        celda1.innerHTML = `${grupo.nombre}`; // Introducir información en la primera celda

                        const celda2 = nuevaFila.insertCell(); // Crear la segunda celda
                        celda2.innerHTML = `${grupo.monitor_nombre}`; // Introducir información en la segunda celda

                        const celda5 = nuevaFila.insertCell(); // Crear la cuarta celda
                        celda5.innerHTML = `
            <button class="verMasBtn" onclick="mostrarOverlayOperar('${grupo.id_grupo}')" id="btnOperar">Operar</button>
            <button class="verMasBtn" onclick="mostrarOverlayNinos('${grupo.id_grupo}')" id="btnVerNinos">VerNinos</button>
            
            `; // boton para operar
                    });
                }
            }
        });
}

//================================================================================================//
//                              FUNCION PARA MOSTRAR OVERLAY DE OPERAR
//================================================================================================//

//cuando hacemos click el boton de cerrar de añadir grupo
document.querySelector(".closeBtnOperar").addEventListener("click", () => {
    //mostramos el overlay
    document
        .getElementById("overlayOperar")
        .classList.remove("activeOverlayOperar"); // Quitar clase para ocultar el overlay
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
});
//cuando hacemos click el boton de volver de añadir grupo
document.getElementById("btnVolverOperar").addEventListener("click", () => {
    //mostramos el overlay
    document
        .getElementById("overlayOperar")
        .classList.remove("activeOverlayOperar"); // Quitar clase para ocultar el overlay
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
});

let idGrupoSeleccionadoGlobal = 0;
//funcion para mostrar y empezar
function mostrarOverlayOperar(idGrupoSeleccionado) {
    console.log(`id para consulta es ${idGrupoSeleccionado}`);
    idGrupoSeleccionadoGlobal = idGrupoSeleccionado; //asigna al posicion global
    limpiarFormularioOperar(); //limpiamos el formulario
    //mostramos el overlay
    document.getElementById("overlayOperar").classList.add("activeOverlayOperar"); // Quitar clase para mostrar el overlay
    document.body.classList.add("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento

    //CONEXION AL BBDD PARA SACAR LOS INFORMACION DEL GRUPO SELECCCIONADO
    //haccemos consulta al bbdd
    fetch("../Server/GestionarGestionarGrupoAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            idGrupoSeleccionado: idGrupoSeleccionado,
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
                console.log(data.infoGrupoSeleccionado);
                document.getElementById("nombre").value =
                    data.infoGrupoSeleccionado.nombre;
                let idMonitorBBDD = data.infoGrupoSeleccionado.id_monitor;

                // Generar las opciones del select con el monitor seleccionado por defecto
                document.getElementById("contenedorProfesores").innerHTML = `
            <select id="cambiarProfesor" name="cambiarProfesor">
                <option value="0">Seleccione un profesor</option>
                ${data.monitorDisponible
                        .map(
                            (monitor) => `
                    <option value="${monitor.id_monitor}" ${monitor.id_monitor == idMonitorBBDD ? "selected" : ""
                                }>
                        ${monitor.nombre}
                    </option>
                `
                        )
                        .join("")}
            </select>
            `;
            }
        });

    //funcion de limpieza de formulario
    function limpiarFormularioOperar() {
        // Limpiar el campo de texto "nombre"
        document.getElementById("nombre").value = "";

        // Limpiar el campo de selección "cambiarProfesor"
        document.getElementById("cambiarProfesor").value = "0";

        // Limpiar mensajes de error
        document.getElementById("errorNombreGrupo").innerHTML = "";
        document.getElementById("errorProfesorGrupo").innerHTML = "";
        document.getElementById("errorModificarGrupo").innerHTML = "";

        // También puedes ocultar los mensajes de feedback si es necesario
        document.getElementById("mensajeFeedbackOperar").style.display = "none";
    }

    //funcion del vertificacion del campo
    function vertificarNombre() {
        if (document.getElementById("nombre").value.trim() == "") {
            mostrarError(
                document.getElementById("errorNombreGrupo"),
                "El nombre no puede estar vacio"
            );
        } else {
            mostrarError(document.getElementById("errorNombreGrupo"), "");
        }
    }

    // Función de verificación del campo 'cambiarProfesor'
    function verificarProfesor() {
        let selectProfesor = document.getElementById("cambiarProfesor");
        let valorSeleccionado = selectProfesor.value.trim();

        if (valorSeleccionado == "0") {
            mostrarError(
                document.getElementById("errorProfesorGrupo"),
                "Debe seleccionar un profesor"
            );
        } else {
            mostrarError(document.getElementById("errorProfesorGrupo"), "");
        }
    }

    //utilizamos el funcion
    document.getElementById("nombre").onblur = vertificarNombre;
    document.getElementById("contenedorProfesores").onblur = verificarProfesor;

    document.getElementById("nombre").oninput = vertificarNombre;
    document.getElementById("contenedorProfesores").oninput = verificarProfesor;

    //cuando hace el envio del formulario
    formularioGrupo = document.getElementById("formGrupo");
    formularioGrupo.onsubmit = async function (event) {
        // Prevenir el envío del formulario al inicio
        event.preventDefault();

        //vertificamos otravez por si acaso
        vertificarNombre();
        verificarProfesor();

        //comprobamos si hay algun error
        if (
            checkError(document.getElementById("errorNombreGrupo")) &&
            checkError(document.getElementById("errorProfesorGrupo"))
        ) {
            //en caso de no hay nngun error
            document.getElementById("errorModificarGrupo").innerHTML = ""; //borramos el error
            //SIGUIENTE PASO
            actualizarGrupo(
                document.getElementById("nombre").value,
                document.getElementById("cambiarProfesor").value,
                idGrupoSeleccionado
            );
        } else {
            document.getElementById("errorModificarGrupo").innerHTML =
                "El formulario hay error"; //ponemos el error
        }
    };

    //actualizacion de dato
    function actualizarGrupo(nombre, id_monitor, idGrupoSeleccionado1) {
        fetch("../Server/GestionarGestionarGrupoAdmin.php", {
            method: "POST", // Método de la solicitud
            headers: {
                "Content-type": "application/json", // Tipo de contenido de la solicitud
            },
            body: JSON.stringify({
                //enviamos datos para la consulta
                idGrupoSeleccionadoNuevo: idGrupoSeleccionado1,
                nombreGrupoNuevo: nombre,
                idMonitorNuevo: id_monitor,
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
                    "mensajeFeedbackOperar"
                ); //sacamos el div del html
                // Comprobar si hay un error en la respuesta
                if (data.error) {
                    console.log("2Error: " + data.error); // Mostrar en consola el error
                } else {
                    if (data.modificarGrupo) {
                        if (data.modificarGrupo == "ok") {
                            // Éxito
                            document.getElementById("errorModificarGrupo").innerHTML = "";
                            mensajeFeedbackOperar.style.display = "block";
                            mensajeFeedbackOperar.style.color = "green";
                            mensajeFeedbackOperar.innerText =
                                "Grupo actualizado con éxito 🎉";
                            // Deshabilitamos el botón
                            document.getElementById("btnModificarOperar").disabled = true;
                            pintarTabla()
                            
                            // cerrar el overlay despues de 2s
                            setTimeout(() => {
                                mensajeFeedbackOperar.style.display = "none";
                                document
                                    .getElementById("overlayOperar")
                                    .classList.remove("activeOverlayOperar"); // Quitar clase para ocultar el overlay
                                // habilitamos de nuevo el botón
                                document.getElementById("btnModificarOperar").disabled = false;
                                document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento

                            }, 2000);
                        } else {
                            // FALLO
                            document.getElementById("errorModificarGrupo").innerHTML = "";
                            mensajeFeedbackOperar.style.display = "block";
                            mensajeFeedbackOperar.style.color = "red";
                            mensajeFeedbackOperar.innerText = "Grupo no actualizado";
                            // Deshabilitamos el botón
                            document.getElementById("btnModificarOperar").disabled = true;
                            document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento


                            // cerrar el overlay despues de 3s
                            setTimeout(() => {
                                mensajeFeedbackOperar.style.display = "none";
                                document
                                    .getElementById("overlayOperar")
                                    .classList.remove("activeOverlayOperar"); // Quitar clase para ocultar el overlay
                                // habilitamos de nuevo el botón
                                document.getElementById("btnModificarOperar").disabled = false;
                            }, 3000);
                        }
                    }
                }
            });
    }
}

//----------------------------------------------------------------
//CUANDO PRESIONAMOS A BORRAR
//----------------------------------------------------------------
document.getElementById("btnEliminarOperar").addEventListener("click", () => {
    //activamos el overlay de comprobcion de borrar
    document
        .getElementById("overlayComprobarEliminar")
        .classList.add("activeOverlayComprobarEliminar"); // Quitar clase para ocultar el overlay
    mensajeFeedbackComprobarEliminar.style.display = "none"; //esconder el feedbak
    document.body.classList.add("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento
});

//cuando hacemos click el boton de cerrar de añadir plan
document
    .querySelector(".closeBtnComprobarEliminar")
    .addEventListener("click", () => {
        //mostramos el overlay
        document
            .getElementById("overlayComprobarEliminar")
            .classList.remove("activeOverlayComprobarEliminar"); // Quitar clase para ocultar el overlay
        document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
    });
//cuando hacemos click el boton de volver de añadir plan
document
    .getElementById("btnVolverComprobarEliminar")
    .addEventListener("click", () => {
        //mostramos el overlay
        document
            .getElementById("overlayComprobarEliminar")
            .classList.remove("activeOverlayComprobarEliminar"); // Quitar clase para ocultar el overlay
        document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
    });

//BOTON CUANDO LO DAMOS DE SEGURO BORRAR
document
    .getElementById("btnEliminarComprobarEliminar")
    .addEventListener("click", () => {
        console.log(`Id para eliminar: ${idGrupoSeleccionadoGlobal}`);
        //bbdd
        fetch("../Server/GestionarGestionarGrupoAdmin.php", {
            method: "POST", // Método de la solicitud
            headers: {
                "Content-type": "application/json", // Tipo de contenido de la solicitud
            },
            body: JSON.stringify({
                //enviamos datos para la consulta
                idGrupoParaEliminar: idGrupoSeleccionadoGlobal,
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
                    "mensajeFeedbackOperar"
                ); //sacamos el div del html
                // Comprobar si hay un error en la respuesta
                if (data.error) {
                    console.log("2Error: " + data.error); // Mostrar en consola el error
                } else {
                    if (data.EliminarGrupo) {
                        if (data.EliminarGrupo == "ok") {
                            // Éxito
                            mensajeFeedbackComprobarEliminar.style.display = "block";
                            mensajeFeedbackComprobarEliminar.style.color = "green";
                            mensajeFeedbackComprobarEliminar.innerText =
                                "Grupo Eliminado con éxito 🎉";
                            pintarTabla(); //repintar la tabla

                            // Deshabilitamos el botón
                            document.getElementById(
                                "btnEliminarComprobarEliminar"
                            ).disabled = true;
                            // cerrar el overlay despues de 2s
                            setTimeout(() => {
                                mensajeFeedbackComprobarEliminar.style.display = "none";
                                document
                                    .getElementById("overlayComprobarEliminar")
                                    .classList.remove("activeOverlayComprobarEliminar"); // Quitar clase para ocultar el overlay
                                document
                                    .getElementById("overlayOperar")
                                    .classList.remove("activeOverlayOperar"); // Quitar clase para ocultar el overlay
                                document.getElementById(
                                    "btnEliminarComprobarEliminar"
                                ).disabled = false;
                                document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
                            }, 2000);
                        } else {
                            // FALLO
                            document.getElementById("errorComprobarEliminar").innerHTML = "";
                            mensajeFeedbackComprobarEliminar.style.display = "block";
                            mensajeFeedbackComprobarEliminar.style.color = "red";
                            mensajeFeedbackComprobarEliminar.innerText =
                                "Grupo no actualizado";
                        }
                    } else {
                        // FALLO de excepcion
                        document.getElementById("errorComprobarEliminar").innerHTML = "";
                        mensajeFeedbackComprobarEliminar.style.display = "block";
                        mensajeFeedbackComprobarEliminar.style.color = "red";
                        mensajeFeedbackComprobarEliminar.innerText =
                            "No se puede borrar grupo por que tiene niños o actividadesdentro";
                    }
                }
            });
    });

//================================================================================================//
//                              FIN FUNCION PARA MOSTRAR OVERLAY DE OPERAR
//================================================================================================//

//================================================================================================//
//                              FUNCION PARA MOSTRAR OVERLAY DE LISTA NIÑOS
//================================================================================================//
//cuando hacemos click el boton de cerrar de LISTANINO
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

let idGrupoSeleccionadoParaNinoGlobal = 0;
//funcio para abrir el oberlay y empezar
function mostrarOverlayNinos(idGrupoSeleccionadoParaNino) {
    console.log(`id para consulta es ${idGrupoSeleccionadoParaNino}`);
    idGrupoSeleccionadoParaNinoGlobal = idGrupoSeleccionadoParaNino;
    //limpiarFormularioListaNinos()  //limpiamos el formulario
    //mostramos el overlay
    document
        .getElementById("overlayListaNinos")
        .classList.add("activeOverlayListaNinos"); // Quitar clase para mostrar el overlay
    document.body.classList.add("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento
    //pintamos la tabla
    repintarLista();

    //---------------------------------------------------------------
    //mostrar overlay de modificar nino
    //---------------------------------------------------------------

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

    //---------------------------------------------------------------
    //fin mostrar overlay de modificar nino
    //---------------------------------------------------------------

    //---------------------------------------------------------------
    //mostrar overlay de eliminar nino
    //---------------------------------------------------------------

    //cuando hacemos click el boton de cerrar de añadir plan
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

    //---------------------------------------------------------------
    //mostrar overlay de eliminar nino
    //---------------------------------------------------------------
}

//funcion que pinta la tabla
function repintarLista() {
    //CONEXION AL BBDD PARA SACAR LOS INFORMACION DEL GRUPO SELECCCIONADO
    //haccemos consulta al bbdd
    fetch("../Server/GestionarGestionarGrupoAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            idGrupoSeleccionadoParaNino: idGrupoSeleccionadoParaNinoGlobal,
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
                if (data.ninosDelGrupoDisponible.length == 0) {
                    document.getElementById("tablaActividad2").classList.add("oculto"); // Ocultar el tabla
                    document.getElementById("infoTabla2").innerText =
                        "No tiene ningun Ninos ";
                } else {
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
    
                    data.ninosDelGrupoDisponible.forEach((nino) => {
                        console.log(nino)
                        const nuevaFila = tabla.insertRow(); // Crear una nueva fila en la tabla

                        const celda1 = nuevaFila.insertCell(); // Crear la primera celda
                        celda1.innerHTML = `<img src="${nino.avatar_src || rutaPredefinida
                            }" alt="${nino.nombre_nino}" />`;

                        const celda2 = nuevaFila.insertCell(); // Crear la segunda celda
                        celda2.innerHTML = `${nino.nombre_nino}`; // Introducir información en la segunda celda

                        const celda3 = nuevaFila.insertCell(); // Crear la segunda celda
                        celda3.innerHTML = nino.pagado === 1 ? "Pagado" : "No Pagado";

                        const celda4 = nuevaFila.insertCell(); // Crear la segunda celda
                        if (nino.fecha_inicio){
                            celda4.innerHTML = `${nino.fecha_inicio} - ${nino.fecha_fin}`; // Introducir información en la segunda celda
                        }else{
                            celda4.innerHTML='No tiene plan'
                        }
                        

                        const celda5 = nuevaFila.insertCell(); // Crear la cuarta celda
                        celda5.innerHTML = `
                    <button class="verMasBtn" onclick="mostrarOverlayModificarDatosNino('${nino.id_nino}')" id="btnModificarDatosNino">Operar</button>
                    <button class="verMasBtn" onclick="mostrarOverlayEliminarNino('${nino.id_nino}')" id="btnEliminarNino">Quitar del Grupo</button>
                    `;
                    });
                }
            }
        });
}
//MOSTRA OVERLAY DE ELIMINAR NIÑOS EN LA LISTA DE GRUPO
let idNinoSeleccionadoGlobalParaEliminar = 0;
function mostrarOverlayEliminarNino(idNinoSelecciona) {
    console.log(`id de nino para ELIMINAR:  ${idNinoSelecciona}`);
    idNinoSeleccionadoGlobalParaEliminar = idNinoSelecciona;
    // limpiarFormularioEliminarNino()
    document
        .getElementById("overlayComprobarEliminarPersona")
        .classList.add("activeOverlayComprobarEliminarPersona"); // Quitar clase para mostrar el overlay
    document.body.classList.add("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento

    //cuando presionamos el boton de borrar
    document
        .getElementById("btnEliminarComprobarEliminarPersona")
        .addEventListener("click", () => {
            //hace el borado
            fetch("../Server/GestionarGestionarGrupoAdmin.php", {
                method: "POST", // Método de la solicitud
                headers: {
                    "Content-type": "application/json", // Tipo de contenido de la solicitud
                },
                body: JSON.stringify({
                    //enviamos datos para la consulta
                    idNinoSeleccionaParaEliminar: idNinoSeleccionadoGlobalParaEliminar,
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
                        "mensajeFeedbackOperar"
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
                                mensajeFeedbackComprobarEliminarPersona.style.display = "block";
                                mensajeFeedbackComprobarEliminarPersona.style.color = "green";
                                mensajeFeedbackComprobarEliminarPersona.innerText =
                                    "Niño eliminado con éxito 🎉";
                                repintarLista(); //repintar la lista
                                // Deshabilitamos el botón
                                document.getElementById(
                                    "btnEliminarComprobarEliminarPersona"
                                ).disabled = true;
                                // cerrar el overlay despues de 2s
                                setTimeout(() => {
                                    mensajeFeedbackComprobarEliminarPersona.style.display =
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
                                mensajeFeedbackComprobarEliminarPersona.style.display = "block";
                                mensajeFeedbackComprobarEliminarPersona.style.color = "red";
                                mensajeFeedbackComprobarEliminarPersona.innerText =
                                    data.mensaje;
                                // Deshabilitamos el botón
                                document.getElementById(
                                    "btnEliminarComprobarEliminarPersona"
                                ).disabled = true;

                                // cerrar el overlay despues de 3s
                                setTimeout(() => {
                                    mensajeFeedbackComprobarEliminarPersona.style.display =
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
    fetch("../Server/GestionarGestionarGrupoAdmin.php", {
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
                    grupoNinoBBDD = data.infoninoParaModificar["id_grupo"];

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
        fetch("../Server/GestionarGestionarGrupoAdmin.php", {
            method: "POST", // Método de la solicitud
            headers: {
                "Content-type": "application/json", // Tipo de contenido de la solicitud
            },
            body: JSON.stringify({
                //enviamos datos para la consulta
                idNinoSeleccionaa2: idNinoSeleccionaa2,
                pagado2: pagado2,
                id_plan2: id_plan2,
                id_grupo2: id_grupo2,
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
                        repintarLista();    //repintar la lista
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
                        repintarLista();    //repintar la lista

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

//funcion para limpiar el formulario
function limpiarFormularioAñadirGrupo() {
    document.getElementById("nombreGrupo").value = ""; // Limpiar input de texto
    document.getElementById("monitorAsignado").value = "0"; // Reiniciar el select al valor por defecto

    // Limpiar mensajes de error
    document.getElementById("errorNombreGrupo2").innerHTML = "";
    document.getElementById("errorMonitorAsignado").innerHTML = "";
    document.getElementById("errorCrearGrupo").innerHTML = "";
}

//CUANDO PRESIONAMOS PARA AGREGAR UN NUEVO GRUPO
document
    .getElementById("contenedorBotonAgregarGrupo")
    .addEventListener("click", () => {
        limpiarFormularioAñadirGrupo(); //limpiamos el formulario
        //mostramos el overlay
        document.getElementById("overlayAñadirGrupo").classList.add("activeOverlayAñadirGrupo"); // Quitar clase para ocultar el overlay
        document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento

        //cuando hacemos click el boton de cerrar de añadir grupo
        document.querySelector(".closeBtnAñadirGrupo").addEventListener("click", () => {
            //mostramos el overlay
            document.getElementById("overlayAñadirGrupo").classList.remove("activeOverlayAñadirGrupo"); // Quitar clase para ocultar el overlay
            document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
        });
        //cuando hacemos click el boton de volver de añadir grupo
        document
            .getElementById("btnVolverAñadirGrupo")
            .addEventListener("click", () => {
                //mostramos el overlay
                document
                    .getElementById("overlayAñadirGrupo")
                    .classList.remove("activeOverlayAñadirGrupo"); // Quitar clase para ocultar el overlay
                document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
            });

        //CONEXION AL BBDD
        //conectar con el bbd para sacar los monitores que existen
        fetch("../Server/GestionarGestionarGrupoAdmin.php", {
            method: "POST", // Método de la solicitud
            headers: {
                "Content-type": "application/json", // Tipo de contenido de la solicitud
            },
            body: JSON.stringify({
                //enviamos datos para la consulta
                consultarMonitorDisponible: "monitor",
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
                        document.getElementById("monitorAsignado").innerHTML = `
          <option value="0" id="monitorSeleccionadoGrupo">Selecciona un monitor</option>
          ${data.monitoresDisponible
                                .map(
                                    (monitor) => `
            <option value="${monitor["id_monitor"]}" id="monitorSeleccionadoGrupo">${monitor["nombre"]}</option>
          `
                                )
                                .join("")}
        `;
                    }
                }
            });
        //FIN DE CONEXION AL BBDD

        //creamos los funciones para comprobar los variables si es valido o no
        //validar el nombre
        function validarNombreGrupoAnadir() {
            //comprobar si es vacio o no
            if (document.getElementById("nombreGrupo").value.trim() == "") {
                mostrarError(
                    document.getElementById("errorNombreGrupo2"),
                    "El no puede estar vacio"
                );
            } else {
                mostrarError(document.getElementById("errorNombreGrupo2"), ""); //quitamos el error
            }
        }
        //validar el select del monitor
        function validarSelectMonitorGrupo() {
            console.log(document.getElementById("monitorAsignado").value);
            //comprobar si es 0 o no
            if (document.getElementById("monitorAsignado").value == 0) {
                mostrarError(
                    document.getElementById("errorMonitorAsignado"),
                    "Por favor, elige un monitor"
                );
            } else {
                mostrarError(document.getElementById("errorMonitorAsignado"), ""); //quitamos el error
            }
        }

        //comprobacion de cuando se pierde el foco
        document.getElementById("nombreGrupo").onblur = validarNombreGrupoAnadir;
        document.getElementById("monitorAsignado").onblur =
            validarSelectMonitorGrupo;

        //comprobbacion en live
        document.getElementById("nombreGrupo").oninput = validarNombreGrupoAnadir;
        document.getElementById("monitorAsignado").oninput =
            validarSelectMonitorGrupo;

        //funcion para limpiar el formulario
        function limpiarFormularioAñadirGrupo() {
            document.getElementById("nombreGrupo").value = ""; // Limpiar input de texto
            document.getElementById("monitorAsignado").value = "0"; // Reiniciar el select al valor por defecto

            // Limpiar mensajes de error
            document.getElementById("errorNombreGrupo2").innerHTML = "";
            document.getElementById("errorMonitorAsignado").innerHTML = "";
            document.getElementById("errorCrearGrupo").innerHTML = "";
        }

        //cuando hace el envio del formulario
        formularioCrearGrupo = document.getElementById("formAñadirGrupo");
        formularioCrearGrupo.onsubmit = async function (event) {
            // Prevenir el envío del formulario al inicio
            event.preventDefault();

            //validamos por si acaso
            validarNombreGrupoAnadir();
            validarSelectMonitorGrupo();

            //comprobamos si hay error
            if (
                checkError(document.getElementById("errorNombreGrupo2")) &&
                checkError(document.getElementById("errorMonitorAsignado"))
            ) {
                //borramos el eror por si acaso
                mostrarError(document.getElementById("errorCrearGrupo"), "");
                //SIGUIENTE PASO
                //hacemos el insert y pasamos el nombre y el id del monitor que esta en el input
                console.log(
                    `nombre para insertar : ${document.getElementById("nombreGrupo").value
                    }`
                );
                console.log(
                    `idmonitor para insertar : ${document.getElementById(
                        "monitorAsignado"
                    )}.value`
                );
                crearGrupo(
                    document.getElementById("nombreGrupo").value,
                    document.getElementById("monitorAsignado").value
                );
            } else {
                mostrarError(
                    document.getElementById("errorCrearGrupo"),
                    "Error de formulario"
                );
            }
        };

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
                    idMonitoGrupoCrearGrupo: id_monitor,
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
                            if (data.crearGrupo == "ok") {
                                // Éxito
                                document.getElementById("errorCrearGrupo").innerHTML = "";
                                mensajeFeedback.style.display = "block";
                                mensajeFeedback.style.color = "green";
                                mensajeFeedback.innerText = "Grupo creado con éxito 🎉";
                                pintarTabla(); //repintar la tabla
                                // Deshabilitamos el botón
                                document.getElementById(
                                    "btnCrearGrupoConfirmar"
                                ).disabled = true;
                                // cerrar el overlay despues de 2s
                                setTimeout(() => {
                                    mensajeFeedback.style.display = "none";
                                    document
                                        .getElementById("overlayAñadirGrupo")
                                        .classList.remove("activeOverlayAñadirGrupo"); // Quitar clase para ocultar el overlay
                                    // habilitamos de nuevo el botón
                                    document.getElementById(
                                        "btnCrearGrupoConfirmar"
                                    ).disabled = false;
                                }, 2000);
                            } else {
                                // FALLO
                                document.getElementById("errorCrearGrupo").innerHTML = "";
                                mensajeFeedback.style.display = "block";
                                mensajeFeedback.style.color = "red";
                                mensajeFeedback.innerText = "Grupo no creado";
                                // Deshabilitamos el botón
                                document.getElementById(
                                    "btnCrearGrupoConfirmar"
                                ).disabled = true;

                                // cerrar el overlay despues de 3s
                                setTimeout(() => {
                                    mensajeFeedback.style.display = "none";
                                    document
                                        .getElementById("overlayAñadirGrupo")
                                        .classList.remove("activeOverlayAñadirGrupo"); // Quitar clase para ocultar el overlay
                                    // habilitamos de nuevo el botón
                                    document.getElementById(
                                        "btnCrearGrupoConfirmar"
                                    ).disabled = false;
                                }, 3000);
                            }
                        }
                    }
                });
        }
    });

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
    console.log(`id de grupo seleccionado: ${idGrupoSeleccionadoParaNinoGlobal}`);
    //resetea el formulario 
    resetFormularioAñadirNino()
    document
        .getElementById("overlayAñadirNinoAlGrupo")
        .classList.add("activeOverlayAñadirNinoAlGrupo"); // Añadir clase para mostrar el overlay
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento


    //conectamos con el bbdd
    fetch("../Server/GestionarGestionarGrupoAdmin.php", {
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
                if (data.ninosSinGrupo) {

                    document.getElementById('contenedorSeleccionarNinoParaAgregar').innerHTML = `
                         <select name="seleccionarNinoParaAgregar" id="seleccionarNinoParaAgregar">
                            <option value="0">Seleccione un niño</option>
                            ${data.ninosSinGrupo.map(nino => `
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
                        const ninoSeleccionado = data.ninosSinGrupo.find(nino => nino.id_nino === idSeleccionado);

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
    console.log(`id de grupo seleccionado: ${idGrupoSeleccionadoParaNinoGlobal}`);
    //cuando enviamos el el submit del formulario
    document.getElementById('formAñadirNinoAlGrupo').onsubmit = async function (event) {
        // Prevenir el envío del formulario al inicio
        event.preventDefault();
        console.log(`id Nino para agregar: ${idSeleccionadoNinoParaAgregar}`)
        console.log(`id grupo para agregar: ${idGrupoSeleccionadoParaNinoGlobal}`)
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
            fetch("../Server/GestionarGestionarGrupoAdmin.php", {
                method: "POST", // Método de la solicitud
                headers: {
                    "Content-type": "application/json", // Tipo de contenido de la solicitud
                },
                body: JSON.stringify({
                    //enviamos datos para la consulta
                    idSeleccionadoNinoParaAgregarAlGrupo: idSeleccionadoNinoParaAgregar,
                    idGrupoSeleccionadoParaNinoGlobalAlGrupo: idGrupoSeleccionadoParaNinoGlobal,
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
                                        .getElementById("overlayAñadirNinoAlGrupo")
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

//================================================================================================//
//                             FIN FUNCION PARA MOSTRAR OVERLAY DE LISTA NIÑOS
//================================================================================================//


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