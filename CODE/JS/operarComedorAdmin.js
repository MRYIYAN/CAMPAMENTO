
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
fetch("../Server/GestionarComedorAdmin.php", {
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





//-----------------------------------------------------------------------------------------------------------//
//                                           INICIO DE JS DE CONTENIDO DE JS 
//-----------------------------------------------------------------------------------------------------------//

//pintamos los tarjetas de planes
pintarPlanComida();


//funcion para pintar plaes de comida
function pintarPlanComida() {
    //CONEXION CON EL BBDD
    // Conexión con el servidor para obtener datos del admin
    fetch("../Server/GestionarComedorAdmin.php", {
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
                console.log(data.planComidasDisponible)
                if (data.planComidasDisponible.length == 0) {
                    document.getElementById("tablaComida").classList.add("oculto"); // Ocultar el tabla
                    document.getElementById("infoTablaComida").innerText =
                        "No tienes ningun Plan de comida";
                } else {
                    //en caso si hay respuesta
                    document.getElementById("tablaComida").classList.remove("oculto"); // mostramos la tabladocument.getElementById("infoTabla").innerText = "";
                    //imprimimos la lista de actividades
                    const tabla = document
                        .getElementById("tablaComida")
                        .getElementsByTagName("tbody")[0]; // Obtener el cuerpo de la tabla
                    tabla.innerHTML = ""; // Limpiar el contenido anterior de la tabla

                    //iteramos la respuesta
                    data.planComidasDisponible.forEach((comida) => {
                        const nuevaFila = tabla.insertRow(); // Crear una nueva fila en la tabla

                        const celda = nuevaFila.insertCell(); // Crear celda
                        // Comprobar si la imagen del niño existe, si no usar la imagen predeterminada
                        comprobarImagen(comida.imagenComida_src).then(existe => {  //usamos el metodo para la comprobacion
                            const imagen = existe ? comida.imagenComida_src : '../assets/comida/uploads/defaultPlanComida.png';  //creamos un variable que guarda la ruta, y si el funcion del comprobacion devualve un false, asignamos la ruta predefinida del imagen, al contrario asignamos la ruta que esta en bbdd
                            celda.innerHTML = `<img src="${imagen}" alt="${comida.nombre_plan}">`;
                        });
                        const celda1 = nuevaFila.insertCell(); // Crear celda
                        celda1.innerHTML = `${comida.nombre_plan}`; // Introducir información en la celda
                        const celda2 = nuevaFila.insertCell(); // Crear celda
                        celda2.innerHTML = `${comida.precio}`; // Introducir información en la celda
                        const celda3 = nuevaFila.insertCell(); // Crear celda
                        let definicionCorta = comida.descripcion.slice(0, 50); // Obtener solo los primeros 50 caracteres
                        // Verificar si la longitud de la definición es mayor a 50
                        if (comida.descripcion.length > 50) {
                            definicionCorta += '...'; // Añadir tres puntos al final
                        }
                        // Colocar el texto en la celda
                        celda3.textContent = definicionCorta;

                        const celda4 = nuevaFila.insertCell(); // Crear la cuarta celda
                        celda4.innerHTML = `
                        <button class="verMasBtn" onclick="mostrarOverlayModificarPlanComida('${comida.id_plan_comedor}')" id="btnModificarPlanComida">Modificar</button>
                        <button class="verMasBtnEliminar" onclick="mostrarOverlayEliminarPlanComida('${comida.id_plan_comedor}')" id="btnEliminarPlanComida">Eliminar</button>
                        `; // boton para operar
                    });
                }
            }
        });
}

//funcion para limpir el formulario de crear plan de comida
function limpiarFormulario() {
    // Limpiar campos de texto
    document.getElementById('nombreComida').value = '';
    document.getElementById('descripcionComida').value = '';
    document.getElementById('precioComida').value = '';

    // Limpiar campo de archivo (foto)
    document.getElementById('avatar').value = '';  // Resetea el input de archivo

    // Ocultar la vista previa de la imagen
    document.getElementById('vistaPrevia').style.display = 'none';

    // Limpiar errores
    document.getElementById('errorNombreComida').innerHTML = '';
    document.getElementById('errorDescripcionComida').innerHTML = '';
    document.getElementById('errorPrecioComida').innerHTML = '';
    document.getElementById('errorModificar').innerHTML = '';
    document.getElementById('errorCrearPlanComida').innerHTML = '';

    // Ocultar mensajes de feedback si estaban visibles
    document.getElementById('mensajeFeedbackAgregarPlanComida').style.display = 'none';
}

// Llamar a la función para limpiar el formulario
// Puedes llamar esta función cuando sea necesario, por ejemplo, cuando el usuario presiona un botón "Limpiar" o "Cancelar".












//OVERLAYS

//abrir el overlay de agregar comida
document.getElementById('btnAgregarPlanDeComida').addEventListener('click', () => {
    limpiarFormulario()
    document.getElementById('overlayOperar').classList.add('activeOverlayOperar')
    document.body.classList.add('body-fondo-bloqueado');  // bloqua el fondo y el desplazamiento
})
//cerra el overlay
document.getElementById('btnRegresarActividad').addEventListener('click', () => {
    document.getElementById('overlayOperar').classList.remove('activeOverlayOperar')
    document.body.classList.remove('body-fondo-bloqueado');  // bloqua el fondo y el desplazamiento
})
document.querySelector('.closeBtnOperar').addEventListener('click', () => {
    document.getElementById('overlayOperar').classList.remove('activeOverlayOperar')
    document.body.classList.remove('body-fondo-bloqueado');  // bloqua el fondo y el desplazamiento
})

//hacemos funciones de validaciones
function validarNombre() {
    if (document.getElementById('nombreComida').value.trim() == "") {
        mostrarError(document.getElementById('errorNombreComida'), "El nombre de Menu no puede estar vacio")
    } else {
        mostrarError(document.getElementById('errorNombreComida'), "")
    }
}
function validarDescripcion() {
    if (document.getElementById('descripcionComida').value.trim() == "") {
        mostrarError(document.getElementById('errorDescripcionComida'), "El Descripcion de comida no puede estar vacio")
    } else {
        mostrarError(document.getElementById('errorDescripcionComida'), "")
    }
}
function validarPrecio() {
    if (document.getElementById('precioComida').value.trim() == "") {
        mostrarError(document.getElementById('errorPrecioComida'), "El precio no puede estar vacio, si El precio es gratis, por favor escribe 0")
    } else {
        mostrarError(document.getElementById('errorPrecioComida'), "")
    }
}

// Añadir un event listener para cuando el archivo cambie
document.getElementById('avatar').addEventListener("change", function () {
    // Verificar si hay un archivo seleccionado
    if (document.getElementById('avatar').files.length > 0) {
        // Crear una URL para el archivo seleccionado
        let fileURL = URL.createObjectURL(document.getElementById('avatar').files[0]);

        // Mostrar la imagen en la vista previa
        document.getElementById('vistaPrevia').src = fileURL;

        // Hacer visible la imagen de vista previa
        document.getElementById('vistaPrevia').style.display = "block";
    } else {
        // Si no hay archivo, ocultar la vista previa
        document.getElementById('vistaPrevia').style.display = "none";
    }
});


//utilizamos el funcion 
document.getElementById('nombreComida').onblur = validarNombre;
document.getElementById('descripcionComida').onblur = validarDescripcion;
document.getElementById('precioComida').onblur = validarPrecio;

document.getElementById('nombreComida').oninput = validarNombre;
document.getElementById('descripcionComida').oninput = validarDescripcion;
document.getElementById('precioComida').oninput = validarPrecio;

//cuando enviamos el formulario para el envio 
let formularioOperar = document.getElementById("formularioCrearComida");
formularioOperar.onsubmit = async function (event) {
    // Prevenir el envío del formulario al inicio
    event.preventDefault();

    //comprobamos otra vez el validacion 
    validarNombre();
    validarDescripcion();
    validarPrecio();

    //comprobasi si hay error
    if (
        checkError(document.getElementById("errorNombreComida")) &&
        checkError(document.getElementById("errorDescripcionComida")) &&
        checkError(document.getElementById("errorPrecioComida"))
    ) {
        mostrarError(document.getElementById('errorCrearPlanComida'), "")   //borramos el contenido de error
        crearPlanComidaBBDD();  //creamos el plan de ddado en el bbdd

    } else {
        mostrarError(document.getElementById('errorCrearPlanComida'), "El formulario contiene Error")   //borramos el contenido de error

    }

}

let fodoComidaPredeterminado = "../assets/comida/uploads/defaultPlanComida.png"
function crearPlanComidaBBDD() {
    console.log(`nombre para insertar: ${document.getElementById('nombreComida').value}`)
    console.log(`descripcion para insertar: ${document.getElementById('descripcionComida').value}`)
    console.log(`precio para insertar: ${document.getElementById('precioComida').value}`)

    //creamos un form data para enviar al bbdd para que se inserte 
    let formData = new FormData();
    formData.append("nombreComida", document.getElementById('nombreComida').value);
    formData.append("descripcionComida", document.getElementById('descripcionComida').value);
    formData.append("precioComida", document.getElementById('precioComida').value);
    // Solo agregar el avatar si hay uno seleccionado
    let avatarInput = document.getElementById("avatar");
    if (avatarInput.files.length > 0) {
        //en caso si hay contenido en el input
        formData.append("foto", avatarInput.files[0]); //pasamos el file al php
        formData.append("cambiarfoto", true); //pasamos un booleano dicidendo que hay que modificar el perfil
    } else {
        //en caso si no hay nada en el input
        formData.append("fondoComida", fodoComidaPredeterminado); //pasamos la ruta de avatar que esta en el bbdd
        formData.append("cambiarFoto", false); //pasamos un boleano para decir que no hay que cambiar nada
    }


    //FETCH PARA ENVIAR LOS MODIFICACIONES AL BBDD
    fetch("../Server/GestionarComedorAdmin.php", {
        method: "POST",
        //enviamos los datos
        body: formData
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
                if (data.creadoPlanComida) {
                    let mensajeFeedback = document.getElementById("mensajeFeedbackAgregarPlanComida"); //sacamos el div del html 

                    if (data.creadoPlanComida == "ok") {
                        console.log("insertado")
                        mensajeFeedback.style.display = "block";
                        mensajeFeedback.style.color = "green";
                        pintarPlanComida()  //repintar el pland e comida
                        mensajeFeedback.innerText = "Comida creado con éxito 🎉";

                        // Deshabilitamos el botón
                        document.getElementById('btnInsertarActividad').disabled = true;
                        // cerrar el overlay despues de 2s
                        setTimeout(() => {
                            mensajeFeedback.style.display = "none";
                            document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Quitar clase para ocultar el overlay
                            document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                            // habilitamos el botón
                            document.getElementById('btnInsertarActividad').disabled = false;
                        }, 2000);

                    } else {
                        console.log(data)
                        console.log('no insertado')
                        mensajeFeedback.style.display = "block";
                        mensajeFeedback.style.color = "red";
                        mensajeFeedback.innerText = "No insertado";
                        // Deshabilitamos el botón
                        document.getElementById('btnInsertarActividad').disabled = true;
                        pintarPlanComida()
                        // cerrar el overlay despues de 2s
                        setTimeout(() => {
                            mensajeFeedback.style.display = "none";
                            document.getElementById("overlayOperar").classList.remove("activeOverlayOperar"); // Quitar clase para ocultar el overlay
                            document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                            // habilitamos el botón
                            document.getElementById('btnInsertarActividad').disabled = false;
                        }, 2000);
                    }
                }
            }
        });
}
//funcion para resetear el overlay de comprobacion de eliminar 
function resetearOverlayEliminar() {
    // Restablecer el mensaje de feedback
    document.getElementById("mensajeFeedbackComprobarEliminar").style.display = "none";
    document.getElementById("mensajeFeedbackComprobarEliminar").innerHTML = "";
    // Limpiar posibles mensajes de error
    document.getElementById("errorComprobarEliminar").innerHTML = "";
}


//cerra el overlay de eliminar plan de comida
document.getElementById('btnVolverComprobarEliminar').addEventListener('click', () => {
    document.getElementById('overlayComprobarEliminar').classList.remove('activeOverlayComprobarEliminar')
    document.body.classList.remove('body-fondo-bloqueado');  // bloqua el fondo y el desplazamiento
})
document.querySelector('.closeBtnComprobarEliminar').addEventListener('click', () => {
    document.getElementById('overlayComprobarEliminar').classList.remove('activeOverlayComprobarEliminar')
    document.body.classList.remove('body-fondo-bloqueado');  // bloqua el fondo y el desplazamiento
})
//abrir comprobacion de eliminar comida y comprueba si quiere o no
function mostrarOverlayEliminarPlanComida(idPlanCominadEliminar) {
    resetearOverlayEliminar()   //reseteo de overlay 
    document.getElementById('overlayComprobarEliminar').classList.add('activeOverlayComprobarEliminar')
    document.body.classList.add('body-fondo-bloqueado');  // bloqua el fondo y el desplazamiento


    //en caso de que el usuario comorueba 
    document.getElementById('btnEliminarComprobarEliminar').addEventListener(('click'), () => {
        //FETCH PARA ENVIAR LOS MODIFICACIONES AL BBDD
        fetch("../Server/GestionarComedorAdmin.php", {
            method: "POST",
            //enviamos los datos
            body: JSON.stringify({
                //enviamos datos para la consulta
                id_planComida_paraEliminar: idPlanCominadEliminar
            }),
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
                    if (data.borrarPlanComida) {
                        let mensajeFeedback = document.getElementById("mensajeFeedbackComprobarEliminar"); //sacamos el div del html 

                        if (data.borrarPlanComida == "ok") {
                            console.log("insertado")
                            mensajeFeedback.style.display = "block";
                            mensajeFeedback.style.color = "green";
                            pintarPlanComida()  //repintar el pland e comida
                            mensajeFeedback.innerText = "Paln de comida eliminado con éxito 🎉";

                            // Deshabilitamos el botón
                            document.getElementById('btnEliminarComprobarEliminar').disabled = true;
                            // cerrar el overlay despues de 2s
                            setTimeout(() => {
                                mensajeFeedback.style.display = "none";
                                document.getElementById("overlayComprobarEliminar").classList.remove("activeOverlayComprobarEliminar"); // Quitar clase para ocultar el overlay
                                document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                                // habilitamos el botón
                                document.getElementById('btnEliminarComprobarEliminar').disabled = false;
                            }, 2000);

                        } else {
                            console.log('no insertado')
                            mensajeFeedback.style.display = "block";
                            mensajeFeedback.style.color = "red";
                            mensajeFeedback.innerText = "Hubo un error a la hora de Eliminar";
                            // Deshabilitamos el botón
                            document.getElementById('btnEliminarComprobarEliminar').disabled = true;
                            pintarPlanComida()
                            // cerrar el overlay despues de 2s
                            setTimeout(() => {
                                mensajeFeedback.style.display = "none";
                                document.getElementById("overlayComprobarEliminar").classList.remove("activeOverlayComprobarEliminar"); // Quitar clase para ocultar el overlay
                                document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                                // habilitamos el botón
                                document.getElementById('btnEliminarComprobarEliminar').disabled = false;
                            }, 2000);
                        }
                    }
                }
            });
    })
}

let fodoComidaPredeterminadoModificar = "../assets/comida/uploads/defaultPlanComida.png"




//cerra el overlay
document.getElementById('btnRegresarActividadModificar').addEventListener('click', () => {
    document.getElementById('overlayOperarModificar').classList.remove('activeOverlayOperarModificar')
    document.body.classList.remove('body-fondo-bloqueado');  // bloqua el fondo y el desplazamiento
})
document.querySelector('.closeBtnOperarModificar').addEventListener('click', () => {
    document.getElementById('overlayOperarModificar').classList.remove('activeOverlayOperarModificar')
    document.body.classList.remove('body-fondo-bloqueado');  // bloqua el fondo y el desplazamiento
})


//abrir el overlay de MODIFICAR comida
function mostrarOverlayModificarPlanComida(id_planDeComidaSeleccionadoModificar) {
    limpiarFormulario()
    document.getElementById('overlayOperarModificar').classList.add('activeOverlayOperarModificar')
    document.body.classList.add('body-fondo-bloqueado');  // bloqua el fondo y el desplazamiento

    //rellenamos los datos desde bbdd
    //FETCH PARA ENVIAR LOS MODIFICACIONES AL BBDD
    fetch("../Server/GestionarComedorAdmin.php", {
        method: "POST",
        //enviamos los datos
        body: JSON.stringify({
            //enviamos datos para la consulta
            id_planComida_paraRellenardedeBBDD: id_planDeComidaSeleccionadoModificar
        }),
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
                if (data.planComidabbdd) {
                    console.log(data.planComidabbdd)
                    document.getElementById('nombreComidaModificar').value = data.planComidabbdd['nombre_plan'];
                    document.getElementById('descripcionComidaModificar').value = data.planComidabbdd['descripcion'];
                    document.getElementById('precioComidaModificar').value = data.planComidabbdd['precio'];

                    //comprobamos el imagen si existe en bbdd o no 
                    comprobarImagen(data.planComidabbdd['imagenComida_src']).then(existe => {  //usamos el metodo para la comprobacion
                        let imagen = existe ? data.planComidabbdd['imagenComida_src'] : '../assets/comida/uploads/defaultPlanComida.png';  //creamos un variable que guarda la ruta, y si el funcion del comprobacion devualve un false, asignamos la ruta predefinida del imagen, al contrario asignamos la ruta que esta en bbdd
                        document.getElementById('vistaPreviaModificar').src = imagen;
                    });
                }
            }
        });

    //cuando enviamos el formulario para el envio 
    let formularioOperarModificar = document.getElementById("formularioCrearComidaModificar");
    formularioOperarModificar.onsubmit = async function (event) {
        // Prevenir el envío del formulario al inicio
        event.preventDefault();

        //comprobamos otra vez el validacion 
        validarNombreModificar();
        validarDescripcionModificar();
        validarPrecioModificar();

        //comprobasi si hay error
        if (
            checkError(document.getElementById("errorNombreComidaModificar")) &&
            checkError(document.getElementById("errorDescripcionComidaModificar")) &&
            checkError(document.getElementById("errorPrecioComidaModificar"))
        ) {
            mostrarError(document.getElementById('errorCrearPlanComidaModificar'), "")   //borramos el contenido de error
            crearPlanComidaBBDD();  //creamos el plan de ddado en el bbdd

        } else {
            mostrarError(document.getElementById('errorCrearPlanComidaModificar'), "El formulario contiene Error")   //borramos el contenido de error
        }


        function crearPlanComidaBBDD() {
            console.log(`nombre para Modificar: ${document.getElementById('nombreComidaModificar').value}`)
            console.log(`descripcion para Modificar: ${document.getElementById('descripcionComidaModificar').value}`)
            console.log(`precio para Modificar: ${document.getElementById('precioComidaModificar').value}`)

            //creamos un form data para enviar al bbdd para que se inserte 
            let formDataModificar = new FormData();
            formDataModificar.append("nombreComidaModificar", document.getElementById('nombreComidaModificar').value);
            formDataModificar.append("descripcionComidaModificar", document.getElementById('descripcionComidaModificar').value);
            formDataModificar.append("precioComidaModificar", document.getElementById('precioComidaModificar').value);
            formDataModificar.append("id_planComidaParaModificar", id_planDeComidaSeleccionadoModificar)
            // Solo agregar el avatar si hay uno seleccionado
            let avatarInputModificar = document.getElementById("avatarModificar");
            if (avatarInputModificar.files.length > 0) {
                //en caso si hay contenido en el input
                formDataModificar.append("fotoMod", avatarInputModificar.files[0]); //pasamos el file al php
                formDataModificar.append("cambiarfotoMod", true); //pasamos un booleano dicidendo que hay que modificar el perfil
            } else {
                //en caso si no hay nada en el input
                formDataModificar.append("fondoComidaMod", fodoComidaPredeterminadoModificar); //pasamos la ruta de avatar que esta en el bbdd
                formDataModificar.append("cambiarFotoMod", false); //pasamos un boleano para decir que no hay que cambiar nada
            }
        

        //FETCH PARA ENVIAR LOS MODIFICACIONES AL BBDD
        fetch("../Server/GestionarComedorAdmin.php", {
            method: "POST",
            //enviamos los datos
            body: formDataModificar
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
                    if (data.modificarPlanComida) {
                        let mensajeFeedback = document.getElementById("mensajeFeedbackAgregarPlanComidaModificar"); //sacamos el div del html 

                        if (data.modificarPlanComida == "ok") {
                            console.log("insertado")
                            mensajeFeedback.style.display = "block";
                            mensajeFeedback.style.color = "green";
                            pintarPlanComida()  //repintar el pland e comida
                            mensajeFeedback.innerText = "Comida Modificado con éxito 🎉";

                            // Deshabilitamos el botón
                            document.getElementById('btnInsertarActividadModificar').disabled = true;
                            // cerrar el overlay despues de 2s
                            setTimeout(() => {
                                mensajeFeedback.style.display = "none";
                                document.getElementById("overlayOperarModificar").classList.remove("activeOverlayOperarModificar"); // Quitar clase para ocultar el overlay
                                document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                                // habilitamos el botón
                                document.getElementById('btnInsertarActividadModificar').disabled = false;
                            }, 2000);

                        } else {
                            console.log(data)
                            console.log("no insertado")
                            mensajeFeedback.style.display = "block";
                            mensajeFeedback.style.color = "red";
                            pintarPlanComida()  //repintar el pland e comida
                            mensajeFeedback.innerText = "Comida no Modificado";

                            // Deshabilitamos el botón
                            document.getElementById('btnInsertarActividadModificar').disabled = true;
                            // cerrar el overlay despues de 2s
                            setTimeout(() => {
                                mensajeFeedback.style.display = "none";
                                document.getElementById("overlayOperarModificar").classList.remove("activeOverlayOperarModificar"); // Quitar clase para ocultar el overlay
                                document.body.classList.remove('body-fondo-bloqueado');  // Desbloquea el fondo y el desplazamiento
                                // habilitamos el botón
                                document.getElementById('btnInsertarActividadModificar').disabled = false;
                            }, 2000);
                        }
                    }
                }
            });

        }




    }
}

// funciones de validacion de inputs

function validarNombreModificar() {
    if (document.getElementById('nombreComidaModificar').value.trim() == "") {
        mostrarError(document.getElementById('errorNombreComidaModificar'), "El nombre de Menu no puede estar vacio")
    } else {
        mostrarError(document.getElementById('errorNombreComidaModificar'), "")
    }
}
function validarDescripcionModificar() {
    if (document.getElementById('descripcionComidaModificar').value.trim() == "") {
        mostrarError(document.getElementById('errorDescripcionComidaModificar'), "El Descripcion de comida no puede estar vacio")
    } else {
        mostrarError(document.getElementById('errorDescripcionComidaModificar'), "")
    }
}
function validarPrecioModificar() {
    if (document.getElementById('precioComidaModificar').value.trim() == "") {
        mostrarError(document.getElementById('errorPrecioComidaModificar'), "El precio no puede estar vacio, si El precio es gratis, por favor escribe 0")
    } else {
        mostrarError(document.getElementById('errorPrecioComidaModificar'), "")
    }
}
// Añadir un event listener para cuando el archivo cambie
document.getElementById('avatarModificar').addEventListener("change", function () {
    // Verificar si hay un archivo seleccionado
    if (document.getElementById('avatarModificar').files.length > 0) {
        // Crear una URL para el archivo seleccionado
        let fileURLModificar = URL.createObjectURL(document.getElementById('avatarModificar').files[0]);

        // Mostrar la imagen en la vista previa
        document.getElementById('vistaPreviaModificar').src = fileURLModificar;

        // Hacer visible la imagen de vista previa
        document.getElementById('vistaPreviaModificar').style.display = "block";
    } else {
        // Si no hay archivo, ocultar la vista previa
        document.getElementById('vistaPreviaModificar').style.display = "none";
    }
});
//utilizamos el funcion 
document.getElementById('nombreComidaModificar').onblur = validarNombreModificar;
document.getElementById('descripcionComidaModificar').onblur = validarDescripcionModificar;
document.getElementById('precioComidaModificar').onblur = validarPrecioModificar;

document.getElementById('nombreComidaModificar').oninput = validarNombreModificar;
document.getElementById('descripcionComidaModificar').oninput = validarDescripcionModificar;
document.getElementById('precioComidaModificar').oninput = validarPrecioModificar;


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