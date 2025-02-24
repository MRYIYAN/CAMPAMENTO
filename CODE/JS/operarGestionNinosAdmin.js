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
//CONEXION CON EL BBDD
// Conexión con el servidor para obtener datos del admin
fetch("../Server/GestionarGestionarNinosAdmin.php", {
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



pintarTablaNinos()

function pintarTablaNinos() {
    //CONEXION CON EL BBDD
    // Conexión con el servidor para obtener datos del admin
    fetch("../Server/GestionarGestionarNinosAdmin.php", {
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
                console.log(data.ninosDisponible)
                if (data.ninosDisponible.length == 0) {
                    document.getElementById("tablaPlan").classList.add("oculto"); // Ocultar el tabla
                    document.getElementById("infoTabla").innerText =
                        "No tienes ningun Alumno Matriculado";
                } else {
                    //en caso si hay respuesta
                    document.getElementById("tablaPlan").classList.remove("oculto"); // mostramos la tabladocument.getElementById("infoTabla").innerText = "";
                    //imprimimos la lista de actividades
                    const tabla = document
                        .getElementById("tablaPlan")
                        .getElementsByTagName("tbody")[0]; // Obtener el cuerpo de la tabla
                    tabla.innerHTML = ""; // Limpiar el contenido anterior de la tabla

                    //iteramos la respuesta
                    data.ninosDisponible.forEach((nino) => {
                        const nuevaFila = tabla.insertRow(); // Crear una nueva fila en la tabla

                        const celda = nuevaFila.insertCell(); // Crear celda
                        celda.innerHTML = `<img src="${nino.avatar_nino}" alt="${nino.nombre_nino}">`;

                        const celda1 = nuevaFila.insertCell(); // Crear celda
                        celda1.innerHTML = `${nino.nombre_nino}`; // Introducir información en la celda

                        const celda2 = nuevaFila.insertCell(); // Crear celda
                        celda2.innerHTML = `${nino.pagado}`; // Introducir información en la celda
                        // Cambiar el color de fondo según el estado de "pagado"
                        if (nino.pagado == 0) {
                            celda2.style.backgroundColor = "yellow"; // Si el valor es 0, color amarillo
                        }

                        const celda3 = nuevaFila.insertCell(); // Crear celda
                        celda3.innerHTML = `${nino.alergias}`; // Introducir información en la celda

                        const celda4 = nuevaFila.insertCell(); // Crear celda
                        celda4.innerHTML = `${nino.nombre_grupo} (${nino.id_grupo})`; // Introducir información en la celda
                        // Cambiar el color de fondo si el grupo es null
                        if (nino.nombre_grupo === null) {
                            celda4.style.backgroundColor = "orange"; // Si el grupo es null, color naranja
                        }

                        const celda5 = nuevaFila.insertCell(); // Crear celda
                        celda5.textContent = `${nino.nombre_plan} (${nino.id_plan})`; // Introducir información en la celda
                        // Cambiar el color de fondo si el plan es null
                        if (nino.nombre_plan === null) {
                            celda5.style.backgroundColor = "red"; // Si el plan es null, color rojo
                        }

                        // Lógica de prioridad de colores:
                        if (nino.pagado == 0) {
                            celda2.style.backgroundColor = "yellow"; // Si pagado es 0, amarillo
                        }
                        if (nino.nombre_grupo === null) {
                            celda4.style.backgroundColor = "orange"; // Si grupo es null, naranja
                        }
                        if (nino.nombre_plan === null) {
                            celda5.style.backgroundColor = "red"; // Si plan es null, rojo
                        }

                        // Añadir los botones con la lógica de su click:
                        const celda6 = nuevaFila.insertCell(); // Crear la celda para los botones
                        celda6.innerHTML = `
                            <button class="verMasBtn" onclick="mostrarOverlayOperar('${nino.id_nino}')" id="btnOperar">Operar</button>
                            <button class="verMasBtn" onclick="mostrarOverlayActividad('${nino.id_nino}')" id="btnVerActividadNinos">Ver su Actividad</button>
                            <button class="verMasBtn" onclick="mostrarOverlayEliminar('${nino.id_nino}')" id="btneliminarNinos">Eliminar</button>
                        `;

                    });
                }
            }
        });
}

function mostrarOverlayEliminar (id_ninoEliminar){
    console.log(`id de nino para ELIMINAR:  ${id_ninoEliminar}`);
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
            fetch("../Server/GestionarGestionarNinosAdmin.php", {
                method: "POST", // Método de la solicitud
                headers: {
                    "Content-type": "application/json", // Tipo de contenido de la solicitud
                },
                body: JSON.stringify({
                    //enviamos datos para la consulta
                    idNinoSeleccionaParaEliminar: id_ninoEliminar
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
                        if (data.eliminadoNino) {
                            if (data.eliminadoNino == "ok") {
                                // Éxito
                                document.getElementById(
                                    "errorComprobarEliminarPersona"
                                ).innerHTML = "";
                                mensajeFeedbackOperar.style.display = "block";
                                mensajeFeedbackOperar.style.color = "green";
                                mensajeFeedbackOperar.innerText =
                                    "El Niño eliminado con éxito 🎉";
                                    pintarTablaNinos(); //repintar la lista
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
        });

}

//funcion para mostrar modificaciones 
function mostrarOverlayOperar(id_nino){
    console.log(`id para consulta es ${id_nino}`);
    limpiarFormularioModificarNino();
    //mostramos el overlay
    document
        .getElementById("overlayModificarNino")
        .classList.add("activeOverlayModificarNino"); // Quitar clase para mostrar el overlay
    document.body.classList.add("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento
    //CONEXION AL BBDD PARA SACAR LOS INFORMACION DEL GRUPO SELECCCIONADO
    //haccemos consulta al bbdd
    fetch("../Server/GestionarGestionarNinosAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
            "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
            //enviamos datos para la consulta
            idNinoSeleccionadoParaModificar: id_nino,
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
                id_nino,
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
        fetch("../Server/GestionarGestionarNinosAdmin.php", {
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
                            document.body.classList.remove("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento

                        // Deshabilitamos el botón
                        document.getElementById(
                            "btnModificarModificarNino"
                        ).disabled = true;
                        pintarTablaNinos()    //repintar la lista
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
                        mensajeFeedbackModificarNino.innerText = "Datos no actualizado";
                        document.body.classList.remove("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento

                        // Deshabilitamos el botón
                        document.getElementById(
                            "btnModificarModificarNino"
                        ).disabled = true;
                        pintarTablaNinos()    //repintar la lista
                             //repintar la lista

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