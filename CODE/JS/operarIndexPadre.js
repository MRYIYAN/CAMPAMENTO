//-----------------------------------------------------------------------------------------------------------//
// Constantes para los elementos del HTML
//-----------------------------------------------------------------------------------------------------------//
const nombrePadre = document.getElementById('nombrePadres'); // Elemento para mostrar el nombre del padre
const idPadre = document.getElementById('idPadre'); // Elemento para mostrar el ID del padre
const emailPadres = document.getElementById('emailPadres'); // Elemento para mostrar el email del padre
const selectHijo = document.getElementById('selectHijo'); // Elemento select para elegir un hijo
const tablaPadresv = document.getElementById('tablaPadres'); // Elemento de la tabla de padres
const nombreHijo = document.getElementById('nombreHijo'); // Elemento para mostrar el nombre del hijo
const edadHijo = document.getElementById('edadHijo'); // Elemento para mostrar la edad del hijo
const alergia = document.getElementById('alergiaHijo'); // Elemento para mostrar las alergias del hijo
const grupoHijo = document.getElementById('grupoHijo'); // Elemento para mostrar el grupo del hijo
const profesorHijo = document.getElementById('profesorHijo'); // Elemento para mostrar el profesor del hijo
const estadoHijo = document.getElementById('estadoHijo'); // Elemento para mostrar el estado del hijo
const planHijo = document.getElementById('planHijo'); // Elemento para mostrar el plan del hijo

// Conexión con el servidor para obtener datos del padre y sus hijos
fetch("../Server/GestionarIndexPadre.php", {
    method: 'POST', // Método de la solicitud
    headers: {
        'Content-type': 'application/json', // Tipo de contenido de la solicitud
    },
})
.then(response => {
    if (!response.ok) {
        throw new Error('Error al obtener datos del servidor.'); // Manejo de error si la respuesta no es OK
    }
    return response.json(); // Convertir la respuesta a JSON
})
.then(data => {
    // Comprobar si hay un error en la respuesta
    if (data.error) {
        alert('Error: ' + data.error); // Mostrar alerta en caso de error
    } else if (data.noLogin) {
        // Redirigir si no hay sesión iniciada
        window.location.href = data.noLogin;
        console.log(`Login: ${data.login}`); // Mostrar en consola el estado de login
    } else {
        // Mostrar datos del padre
        console.log(`Login: ${data.login}`); // Mostrar en consola el estado de login
        idPadre.innerHTML = 'ID: ' + data.id_Padre; // Mostrar el ID del padre
        nombrePadre.innerHTML = data.infoPadre['nombre']; // Mostrar el nombre del padre
        // Asignar una cookie con el nombre "nombrePadre" y el valor desde data.infoPadre['nombre']
        document.cookie = `nombrePadre=${data.infoPadre['nombre']}; path=/; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}`;

        // Función para obtener el valor de una cookie por su nombre
        function getCookie(nombre) {
            const cookies = document.cookie.split('; ');
            const cookie = cookies.find(fila => fila.startsWith(nombre + '='));
            return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
        }

        // Asignar el valor de la cookie al elemento HTML
        document.getElementById('biembenidoNombre').innerHTML = getCookie('nombrePadre');
        emailPadres.innerHTML = data.infoPadre['email']; // Mostrar el email del padre

        // Mostrar avatar del padre si está disponible
        if (data.infoPadre['avatar_src']) {
            comprobarImagen(data.infoPadre['avatar_src']).then(existe => {  //usamos el metodo para la comprobacion
                const imagen = existe ? data.infoPadre['avatar_src'] : '../assets/img/avatar.png';  //creamos un variable que guarda la ruta, y si el funcion del comprobacion devualve un false, asignamos la ruta predefinida del imagen, al contrario asignamos la ruta que esta en bbdd
                document.getElementById('imagenPadres').innerHTML = `<img src="${imagen}" alt="${data.infoPadre['nombre']}" width="100px" />`;

            });

        }

        let hijoSeleccionado = 0; // Inicializar variable para el hijo seleccionado

        console.log(data.infoHijos); // Mostrar en consola la información de los hijos
        // Manejar la selección de hijos
        if (data.infoHijos.length === 0) {
            // No hay hijos matriculados
            document.getElementById('hijoNoMatriculado').innerHTML = "Aun no tienes ningun hijos matriculado"; // Mostrar mensaje
            document.getElementById('esconderHijo').classList.add('oculto'); // Ocultar el div de hijos
            document.getElementById('tablaPadres').classList.add('oculto'); // Ocultar la tabla de padres
        } else if (data.infoHijos.length === 1) {
            // Un solo hijo matriculado
            document.getElementById('hijoNoMatriculado').innerHTML ="";
            document.getElementById('esconderHijo').classList.remove('oculto'); // Mostrar el div de hijos
            document.getElementById('tablaPadres').classList.remove('oculto'); // Mostrar la tabla de padres
            hijoSeleccionado = data.infoHijos[0]['id_nino']; // Asignar el ID del hijo seleccionado
            console.log(hijoSeleccionado); // Mostrar en consola el ID del hijo seleccionado
            document.getElementById('divParaSeleccionar').classList.add('oculto'); // Ocultar el div para seleccionar
        } else {
            document.getElementById('hijoNoMatriculado').innerHTML ="";
            // Varios hijos matriculados
            $arrayHijos = data.infoHijos; // Asignar la información de los hijos a una variable
            document.getElementById('esconderHijo').classList.remove('oculto'); // Mostrar el div de hijos
            document.getElementById('tablaPadres').classList.remove('oculto'); // Mostrar la tabla de padres
            document.getElementById('divParaSeleccionar').classList.remove('oculto'); // Mostrar el div para seleccionar
            selectHijo.innerHTML = `<select name="hijoSelect" id="hijoSelect">
                ${$arrayHijos.map(hijo =>`
                         <option value="${hijo['id_nino']}}">${hijo['nombre']}</option>
                        `)}
            </select>`;

            // Asignar el primer niño seleccionado automáticamente
            hijoSeleccionado = $arrayHijos[0].id_nino;

            // Capturar el evento 'change' cuando el usuario selecciona un niño
            document.getElementById('hijoSelect').addEventListener('change', function () {
                hijoSeleccionado = this.value; // Asignar el valor del hijo seleccionado
                console.log('ID del niño seleccionado:' + hijoSeleccionado); // Mostrar en consola el ID del hijo seleccionado
                if (hijoSeleccionado != 0) {
                    mostarDatosNino(hijoSeleccionado); // Mostrar datos del niño seleccionado
                }
            });
        }
        console.log("id hijo seleccionado:" + hijoSeleccionado); // Mostrar en consola el ID del hijo seleccionado
        if (hijoSeleccionado != 0) {
            mostarDatosNino(hijoSeleccionado); // Mostrar datos del niño seleccionado
        }
    }
});

// Función para mostrar datos del niño seleccionado
function mostarDatosNino(id_nino) {
    console.log(`Buscando datos para niño id: ${id_nino}`); // Mostrar en consola el ID del niño
    fetch("../Server/GestionarIndexPadre.php", {
        method: 'POST', // Método de la solicitud
        headers: {
            'Content-type': 'application/json', // Tipo de contenido de la solicitud
        },
        body: JSON.stringify({ id_nino: id_nino }) // Enviar el ID del niño en el cuerpo de la solicitud
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener datos del servidor (2).'); // Manejo de error si la respuesta no es OK
        }
        return response.json(); // Convertir la respuesta a JSON
    })
    .then(data => {
        // Comprobar si hay un error en la respuesta
        if (data.error) {
            console.log('2Error: ' + data.error); // Mostrar en consola el error
        } else {
            console.log("Datos del hijo: ", data.datoHijo); // Mostrar en consola los datos del hijo
            nombreHijo.innerHTML = data.datoHijo['nombre']; // Mostrar el nombre del hijo
            edadHijo.innerHTML = calcularEdad(data.datoHijo['fecha_nacimiento']); // Mostrar la edad del hijo
            alergia.innerHTML = data.datoHijo['alergias']; // Mostrar las alergias del hijo

            // Método para calcular la edad del niño
            function calcularEdad(fechaNacimiento) {
                const hoy = new Date(); // Obtener la fecha actual
                console.log("hoy: " + hoy); // Mostrar en consola la fecha actual
                const nacimiento = new Date(fechaNacimiento); // Convertir la fecha de nacimiento a un objeto Date
                console.log("nacimiento: " + nacimiento); // Mostrar en consola la fecha de nacimiento
                let edad = hoy.getFullYear() - nacimiento.getFullYear(); // Calcular la edad
                return edad; // Devolver la edad
            }

            // Mostrar el nombre del grupo
            if (data.nombreGrupo.length > 0) {
                grupoHijo.innerHTML = data.nombreGrupo; // Mostrar el nombre del grupo
            } else {
                grupoHijo.innerHTML = "Aun no se ha asignado el grupo"; // Mostrar mensaje si no hay grupo asignado
            }

            // Mostrar el nombre del profesor
            if (data.profesorHijo.length > 0) {
                profesorHijo.innerHTML = data.profesorHijo; // Mostrar el nombre del profesor
            } else {
                profesorHijo.innerHTML = "Aun no se ha asignado el profesor"; // Mostrar mensaje si no hay profesor asignado
            }

            // Mostrar la tabla de actividades
            console.log(`id del monitor del grupo ${data.profesorHijo} es: ${data.idProfesorHijo}`); // Mostrar en consola el ID del profesor
            console.log(`Actividades con el monitor ${data.idProfesorHijo} es: ${data.actividades}`); // Mostrar en consola las actividades
            console.log(data.actividades); // Mostrar en consola las actividades
            const tabla = document.getElementById('tablaActividad').getElementsByTagName('tbody')[0]; // Obtener el cuerpo de la tabla
            tabla.innerHTML = ""; // Limpiar el contenido anterior de la tabla
            document.getElementById('infoTabla').innerHTML = ""; // Limpiar el contenido anterior de la información de la tabla
            if (data.actividades.length > 0) {
                document.getElementById('tablaActividad').classList.remove('oculto'); // Mostrar la tabla de actividades
                data.actividades.forEach(actividad => {
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
                    //================================================================================================//
                    //                               Funcion cerrar overlay
                    //================================================================================================//
                    // Función para cerrar el overlay
                    document.querySelector(".closeBtnDefinicion").addEventListener("click", function () {
                        document.getElementById("overlayDefinicion").classList.remove("activeOverlayDefinicion"); // Añadir clase para mostrar el overlay
                    });

                });
            } else {
                document.getElementById('tablaActividad').classList.add('oculto'); // Ocultar la tabla de actividades
                document.getElementById('infoTabla').innerHTML = "No tiene ninguna actividad programada"; // Mostrar mensaje si no hay actividades
                document.getElementById('infoTabla').style.color = "black"; // Cambiar el color del texto
            }

            // Mostrar el estado del niño
            let fechaInicio = new Date(data.planHijo['fecha_inicio']); // Convertir la fecha de inicio a un objeto Date
            let fechaFin = new Date(data.planHijo['fecha_fin']); // Convertir la fecha de fin a un objeto Date
            let fechaActual = new Date(); // Obtener la fecha actual

            console.log(`fecha inicio: ${data.planHijo['fecha_inicio']}`); // Mostrar en consola la fecha de inicio
            console.log(`fecha fin: ${data.planHijo['fecha_fin']}`); // Mostrar en consola la fecha de fin

            // Comparar las fechas
            if (fechaActual < fechaInicio) {
                console.log("El niño esta en estado no iniciado."); // Mostrar en consola el estado del niño
                estadoHijo.innerHTML = "No iniciado"; // Mostrar el estado del niño
            } else if (fechaActual > fechaFin) {
                console.log("El niño está caducado."); // Mostrar en consola el estado del niño
                estadoHijo.innerHTML = "Caducado"; // Mostrar el estado del niño
            } else if (fechaActual > fechaInicio && fechaActual < fechaFin) {
                estadoHijo.innerHTML = "Normal"; // Mostrar el estado del niño
            } else {
                estadoHijo.innerHTML = "No tiene Fechas"; // Mostrar el estado del niño
            }

            // Mostrar estado de pago del niño
            console.log(data.datoHijo['pagado']); // Mostrar en consola el estado de pago
            if (data.datoHijo['pagado'] !== 1) {
                estadoHijo.innerHTML = "No pagado"; // Mostrar el estado de pago
            }

            // Mostrar el plan del niño
            console.log("plannnnnnnnn" +data.planHijo); // Mostrar en consola el ID del plan
            console.log(data.planHijo); // Mostrar en consola el ID del plan

            if (data.planHijo && Object.keys(data.planHijo).length > 0) {   //vertifica si es nulo o indefined y luedo comprueba si tiene datos o no
                planHijo.innerHTML = `${data.planHijo.id_plan} : ${data.planHijo.fecha_inicio} a ${data.planHijo.fecha_fin}`;
            } else {
                planHijo.innerHTML = "Hay Modificación de Plan, Estamos preparando para ello";
            }
            

            // Actualización de avatar del niño
            comprobarImagen(data.datoHijo['avatar_src']).then(existe => {  //usamos el metodo para la comprobacion
                const imagen = existe ? data.datoHijo['avatar_src'] : '../assets/img/avatar.png';  //creamos un variable que guarda la ruta, y si el funcion del comprobacion devualve un false, asignamos la ruta predefinida del imagen, al contrario asignamos la ruta que esta en bbdd
                document.getElementById('imagenHijo').innerHTML = `<img src="${imagen}" alt="${data.datoHijo['nombre']}" width="100px" />`; // Mostrar el avatar del niño
            });
        }
    });
}
//================================================================================================//
//                              funcion para el overlay
//================================================================================================//
// Función para mostrar el overlay con la descripción completa
function mostrarOverlay(descripcionCompleta) {
    // Asignamos datos en el overlay
  console.log(descripcionCompleta);
  document.getElementById("descripcionCompleta").innerHTML =`
  <h1>Descripcion: </h1>
  ${descripcionCompleta}
  `
    ;
    // Hacemos que el overlay sea visible
  document
    .getElementById("overlayDefinicion")
    .classList.add("activeOverlayDefinicion"); // Añadir clase para mostrar el overlay
}
//================================================================================================//
//                              Fin Funcion para el overlay
//================================================================================================//

// Cuando se presiona el botón de inscribir un niño
document.getElementById('suscribirse').addEventListener('click', function() {
    $paginaInscripcion = '../html/inscripcion.html'; // URL de la página de inscripción
    window.location.href = $paginaInscripcion; // Redirigir a la página de inscripción
});

// Cuando se presiona el botón de modificar un niño
document.getElementById('modificar').addEventListener('click', function() {
    $paginaModificarNino = '../html/ModificarNino.html'; // URL de la página de modificación de niño
    window.location.href = $paginaModificarNino; // Redirigir a la página de modificación de niño
});

// Cuando se presiona el botón de modificar un padre
document.getElementById('modificarPadre').addEventListener('click', function() {
    $paginaModificarPadre = '../html/ModificarPadre.html'; // URL de la página de modificación de padre
    window.location.href = $paginaModificarPadre; // Redirigir a la página de modificación de padre
});
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

// Función para comprobar si la imagen existe
const comprobarImagen = (url) => {
    return fetch(url, { method: 'HEAD' })   //se deja la ruta en el head para comprobar
      .then(res => res.ok)  //si responde pasamo que es ok
      .catch(() => false);  //si  no lo pasamos es false
  };