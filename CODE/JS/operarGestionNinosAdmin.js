
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

// Función para comprobar si la imagen existe
const comprobarImagen = (url) => {
    return fetch(url, { method: 'HEAD' })   //se deja la ruta en el head para comprobar
      .then(res => res.ok)  //si responde pasamo que es ok
      .catch(() => false);  //si  no lo pasamos es false
  };
  
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
            gruposDisponibles = data.grupos; //asignamos al variable externo
            planesDisponibles = data.planFecha; //asignamos al variable externo
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

                        // Comprobar si la imagen del niño existe, si no usar la imagen predeterminada
                        comprobarImagen(nino.avatar_nino).then(existe => {  //usamos el metodo para la comprobacion
                            const imagen = existe ? nino.avatar_nino : '../assets/img/avatar.png';  //creamos un variable que guarda la ruta, y si el funcion del comprobacion devualve un false, asignamos la ruta predefinida del imagen, al contrario asignamos la ruta que esta en bbdd
                            celda.innerHTML = `<img src="${imagen}" alt="${nino.nombre_nino}">`;
                        });

                        const celda1 = nuevaFila.insertCell(); // Crear celda
                        celda1.innerHTML = `${nino.nombre_nino}`; // Introducir información en la celda

                        const celda2 = nuevaFila.insertCell(); // Crear celda
                        
                        // Cambiar el color de fondo según el estado de "pagado"
                        if (nino.pagado == 0) {
                            celda2.style.backgroundColor = "yellow"; // Si el valor es 0, color amarillo
                            celda2.innerHTML = `No pagado`; // Introducir información en la celda
                        }else {
                          celda2.innerHTML = `Pagado`; // Introducir información en la celda
                        }

                        const celda3 = nuevaFila.insertCell(); // Crear celda
                        celda3.innerHTML = `${nino.alergias}`; // Introducir información en la celda

                        const celda4 = nuevaFila.insertCell(); // Crear celda
                        if (nino.nombre_grupo){
                          celda4.innerHTML = `${nino.nombre_grupo}`; // Introducir información en la celda
                        }else{
                          celda4.innerHTML = 'No tiene grupo'
                        }
                        
                        // Cambiar el color de fondo si el grupo es null
                        if (nino.nombre_grupo === null) {
                            celda4.style.backgroundColor = "orange"; // Si el grupo es null, color naranja
                        }

                        const celda5 = nuevaFila.insertCell(); // Crear celda
                        if (nino.nombre_plan){
                          celda5.textContent = `${nino.nombre_plan}`; // Introducir información en la celda
                        }else{
                          celda5.textContent = 'No tiene Plan'
                        }
                        // Cambiar el color de fondo si el plan es null
                        if (nino.nombre_plan === null) {
                            celda5.style.backgroundColor = "red"; // Si el plan es null, color rojo
                        }

                        // Lógica de prioridad de colores:
                        if (nino.pagado == 0) {
                            celda2.style.backgroundColor = "yellow"; // Si pagado es 0, amarillo
                        }
                        if (nino.id_grupo === null) {
                            celda4.style.backgroundColor = "orange"; // Si grupo es null, naranja
                        }
                        if (nino.id_plan === null) {
                            celda5.style.backgroundColor = "orange"; // Si plan es null, rojo
                        }

                        // Añadir los botones con la lógica de su click:
                        const celda6 = nuevaFila.insertCell(); // Crear la celda para los botones
                        // celda6.innerHTML = `
                        //     <button class="verMasBtn" onclick="mostrarOverlayOperar('${nino.id_nino}')" id="btnOperar">Operar</button>
                        //     <button class="verMasBtn" id= "btnVerActividadesDelNino"onclick="mostrarOverlayActividad('${nino.id_plan}', '${nino.id_grupo}')" id="btnVerActividadNinos">Ver su Actividad</button>
                        //     <button class="verMasBtn" onclick="mostrarOverlayEliminar('${nino.id_nino}')" id="btneliminarNinos">Eliminar</button>
                        // `;
                        if (nino.id_plan == null || nino.id_grupo == null) {
                            celda6.innerHTML = `
                            <button class="verMasBtn" onclick="mostrarOverlayOperar('${nino.id_nino}')" id="btnOperar">Operar</button>
                            <button class="verMasBtn" onclick="mostrarOverlayEliminar('${nino.id_nino}')" id="btneliminarNinos">Eliminar</button>
                        `;
                        }else{
                            celda6.innerHTML = `
                            <button class="verMasBtn" onclick="mostrarOverlayOperar('${nino.id_nino}')" id="btnOperar">Operar</button>
                            <button class="verMasBtn" onclick="mostrarOverlayEliminar('${nino.id_nino}')" id="btneliminarNinos">Eliminar</button>
                            <button class="verMasBtn" id= "btnVerActividadesDelNino"onclick="mostrarOverlayActividad('${nino.id_plan}', '${nino.id_grupo}')" id="btnVerActividadNinos">Ver su Actividad</button>

                        `;
                        }
                        

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
//cerrar el modificacion del nino
document.querySelector('.closeBtnModificarNino').addEventListener('click', () =>{
    document.getElementById('overlayModificarNino').classList.remove("activeOverlayModificarNino")
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})
document.querySelector('#btnVolverModificarNino').addEventListener('click', () =>{
    document.getElementById('overlayModificarNino').classList.remove("activeOverlayModificarNino")
    document.body.classList.remove("body-fondo-bloqueado"); // Desbloquea el fondo y el desplazamiento
})

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
                            ${plan.nombre} (${plan.fecha_inicio} - ${plan.fecha_fin})
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

//boton de cerra para cerrar overlay de actividades
document.querySelector('.closeBtnActividadDeNino').addEventListener('click', ()=>{
    document.getElementById("overlayActividadDeNino").classList.remove("activeOverlayActividadDeNino"); // Añadir clase para mostrar el overlay
    document.body.classList.remove("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento
})
document.querySelector('#btncolverActividadesDeNino').addEventListener('click', ()=>{
    document.getElementById("overlayActividadDeNino").classList.remove("activeOverlayActividadDeNino"); // Añadir clase para mostrar el overlay
    document.body.classList.remove("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento
})


let id_grupoParaActividades = null;
let id_planParaActividades = null;
function mostrarOverlayActividad(id_plan, id_grupo){
    id_grupoParaActividades = id_grupo;
    id_planParaActividades = id_plan;
    console.log(`idGrupo para consulta de actividad: ${id_grupoParaActividades}`)
    console.log(`idPlan para consulta de actividad: ${id_planParaActividades}`)

    //mostramos el overlay
    document.getElementById("overlayActividadDeNino").classList.add("activeOverlayActividadDeNino"); // Añadir clase para mostrar el overlay
    document.body.classList.add("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento

    pintarActividadesDelNinoSeleccionado()

}

function pintarActividadesDelNinoSeleccionado (){
    //haccemos consulta al bbdd
    fetch("../Server/GestionarGestionarNinosAdmin.php", {
        method: "POST", // Método de la solicitud
        headers: {
          "Content-type": "application/json", // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({
          //enviamos datos para la consulta
          id_grupoParaActividades: id_grupoParaActividades,
          id_planParaActividades: id_planParaActividades
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
            console.log(data.infoActividadNinoSeleccionado)
            if (data.infoActividadNinoSeleccionado.length == 0) {
                //en caso si es vacio
                document.getElementById("tablaListaActividades").classList.add("oculto"); // Ocultar el tabla
                document.getElementById('contenedorBotonAgregarActividad').innerHTML=`<button type="button" id="botonAgregaractividad" onclick = "agregarActividad()">Agregar Actividad</button>`;
                document.getElementById("mensajeInformacionTabla").innerText =
                  "No tiene ningun actividad";
              } else {
                //en caso si hay contenido 
                document.getElementById("tablaListaActividades").classList.remove("oculto"); // Ocultar el tabla
                document.getElementById('contenedorBotonAgregarActividad').innerHTML=`<button type="button" id="botonAgregaractividad" onclick = "agregarActividad()">Agregar Actividad</button>`;
                document.getElementById("mensajeInformacionTabla").innerText ="";

                // Obtenemos el cuerpo de la tabla
                const tablaActividades = document.getElementById('tablaListaActividades').getElementsByTagName("tbody")[0];  // Accedemos al <tbody>

                // Borramos el contenido del cuerpo de la tabla
                tablaActividades.innerHTML = "";
                  //iteramos la respuesta
                data.infoActividadNinoSeleccionado.forEach((actividad) => {
                const nuevaFila = tablaActividades.insertRow(); // Crear una nueva fila en la tabla
  
                const celda1 = nuevaFila.insertCell(); // Crear la primera celda
                celda1.innerHTML = `${actividad.titulo}`; // Introducir información en la primera celda
  
                const celda2 = nuevaFila.insertCell(); // Crear la segunda celda
                celda2.innerHTML = `${actividad.hora} - ${actividad.hora_fin}`; // Introducir información en la segunda celda
  
                const celda3 = nuevaFila.insertCell(); // Crear la tercera celda
                //creamos un boton donde al hacer el clic envia el descripcion que quiere imprimir en el overlay
                celda3.innerHTML = `<button class="verMasBtn" onclick="mostrarDescripcionActividad('${actividad.descripcion}') ">Ver más</button>`; // Introducir información en la tercera celda
  
                const celda4 = nuevaFila.insertCell(); // Crear la cuarta celda
                celda4.innerHTML = `${actividad.dia}`; // Introducir información en la cuarta celda
  
                const celda5 = nuevaFila.insertCell(); // Crear la cuarta celda
                celda5.innerHTML = `<button class="verMasBtn" onclick="mostrarOverlayOperarActividad('${actividad.id_actividad}') ">Operar</button>`; // boton para operar
              });


              }
          }

        });
}


//================================================================================================//
//                              FUNCION PARA MOSTRAR OVERLAY DE DEFINICION
//================================================================================================//
// Función para cerrar el overlay
document
.querySelector(".closeBtnDefinicion")
.addEventListener("click", function () {
  document
    .getElementById("overlayDefinicion")
    .classList.remove("activeOverlayDefinicion"); // Añadir clase para mostrar el overlay
    
    document.body.classList.remove("body-fondo-bloqueado"); // Bloquea interacciones con el fondo y el desplazamiento

});

// Función para mostrar el overlay con la descripción completa
function mostrarDescripcionActividad(descripcionCompleta) {
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
function mostrarOverlayOperarActividad(id_actividad) {
  id_actividadSeleccionada = id_actividad;
  //hacemos una consuta a bbdd para sacar todo los informaciones de esa actividad
  //haccemos consulta al bbdd
  fetch("../Server/GestionarGestionarNinosAdmin.php", {
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
  document.getElementById('btnEliminarActividad').classList.remove("oculto")
  document.getElementById('btnModificarActividad').classList.remove("oculto") //mostramos el boton de modificar
  document.getElementById('btnInsertarActividad').classList.add("oculto") //quitamos el boton de modificar
  document.querySelector('.contenedorBotones').classList.remove("oculto")
  document.body.classList.add('body-fondo-bloqueado');  // Bloquea interacciones con el fondo y el desplazamiento



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

        arError(document.gmostretElementById("errorModificar"), "");
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
    fetch("../Server/GestionarGestionarNinosAdmin.php", {
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
                  pintarActividadesDelNinoSeleccionado()
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

    document.getElementById('contenedorSelectGrupoNino').classList.add('oculto')
    document.getElementById('contenedorSelectPlanNino').classList.add('oculto')


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
//                            FUNCION PARA AGREGAR ACTIVIDAD EN BBDD mostrar overlay
//================================================================================================//
function agregarActividad(){
    sacarFechas();
    //abrir el overlay de operar
    document.getElementById("overlayOperar").classList.add("activeOverlayOperar"); // Añadir clase para mostrar el overlay
    document.getElementById('btnInsertarActividad').classList.remove("oculto") //aparecemos el boton de borrar
    document.getElementById('btnEliminarActividad').classList.add("oculto") //quitamos el boton de borrar
    document.getElementById('btnModificarActividad').classList.add("oculto") //quitamos el boton de modificar
    document.querySelector('.contenedorBotones').classList.add("oculto")
    document.body.classList.add('body-fondo-bloqueado');  // Bloquea interacciones con el fondo y el desplazamiento

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
  
  function insertBBDDActividad(){
  
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
    formDataInsert.append("planSeleccionado", id_planParaActividades);
    formDataInsert.append("grupoSeleccionado", id_grupoParaActividades);
  
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
      fetch("../Server/GestionarGestionarNinosAdmin.php", {
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
            if (data.insertado){
              alert('insertado')
                if (data.insertado == "ok"){
                    console.log("insertado")
                    pintarActividadesDelNinoSeleccionado()
                    //cerrar el overlay de operar
                    document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
                }else{
                    console.log('no insertado')
                }
            }
          }
        });
    }else{
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
  fetch("../Server/GestionarGestionarNinosAdmin.php", {
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
                pintarActividadesDelNinoSeleccionado();
                //cerrar el overlay de operar
                document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Añadir clase para mostrar el overlay
            }else{
                console.log('no borrado')
            }
        }
      }
    });
}
//================================================================================================//
//                            FIN DE BORRAR UN ACTIVIDAD EN BBDD
//================================================================================================//

//================================================================================================//
//                    CONSULTA DE FECHA INICIO Y FECHA FIN CON EL ID DEL PLAN PARA INSERTS DE ACTIVIDAD
//================================================================================================//
function sacarFechas(){
    console.log(`id_plan seleccionado ${id_planParaActividades}`)
    fetch("../Server/GestionarGestionarNinosAdmin.php", {
      method: "POST", // Método de la solicitud
      headers: {
        "Content-type": "application/json", // Tipo de contenido de la solicitud
      },
      body: JSON.stringify({
        //enviamos datos para la consulta
        planSeleccionadoParaInsert: id_planParaActividades
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