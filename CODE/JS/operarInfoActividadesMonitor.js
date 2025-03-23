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
        redirectWithTransition("../html/IndexMonitor.html"); // Redirigir a la página Inndex
      });
    
    document
      .getElementById("btnVerActividad")
      .addEventListener("click", () => {
        redirectWithTransition("../html/infoActividadesMonitor.html"); // Redirigir a la página de Actividades
      });
  
    document.getElementById("btnComedor").addEventListener("click", () => {
      redirectWithTransition("../html/infoComedorMonitor.html"); // Redirigir a la página de comedor
    });
  
    document.getElementById("btnContacto").addEventListener("click", () => {
      redirectWithTransition("../html/infoContactoMonitor.html"); // Redirigir a la página de contacto
    });
  
    document.getElementById("btnNotificaciones").addEventListener("click", () => {
      redirectWithTransition("../html/notificacionesMonitor.html"); // Redirigir a la página de Notificaciones
    });
  
    document
      .getElementById("btnModificarDatosMonitor")
      .addEventListener("click", () => {
        redirectWithTransition("../html/ModificarMonitor.html"); // Redirigir a la página de actividades
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
//                                CARGAR INFORMACIÓN DEL MONITOR
//-----------------------------------------------------------------------------------------------------------//

//================================================================//
//                     VALIDACIONES 
//================================================================//
const estiloError = `
    color: red; 
    font-size: 12px; 
    margin-top: 5px; 
    display: flex; 
    align-items: center;

`;

//================================================================//
//                     CARGAR INFORMACIÓN DEL MONITOR
//================================================================//
document.addEventListener('DOMContentLoaded', function() {
  // 1. Cargar información del monitor
  fetch('../Server/GestionarInfoAcividadesMonitor.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ accion: 'info_monitor' })
  })
  .then(function(response) {
    if (!response.ok) throw new Error('Error al obtener la información del monitor');
    return response.json();
  })
  .then(function(data) {
    var monitorName = data.nombre || 'Monitor';
    var monitorAvatar = data.avatar_src;

    if (data.avatar_src) {
      monitorAvatar = data.avatar_src;
    }
    comprobarImagen(data.avatar_src).then(existe => {
      monitorAvatar = existe ? data.avatar_src : '../assets/img/avatar.png';
      document.getElementById('monitorAvatar').setAttribute('src', monitorAvatar);
    });
    document.getElementById('monitorName').textContent = monitorName;
    document.getElementById('monitorAvatar').setAttribute('src', monitorAvatar);
  })
  .catch(function(error) {
    console.error('Error al obtener la información del monitor:', error);
  });

  // 2. Cargar grupos asociados al monitor
  fetch('../Server/GestionarInfoAcividadesMonitor.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ accion: 'obtener_grupos' })
  })
  .then(function(response) {
    if (!response.ok) throw new Error('Error al obtener grupos');
    return response.json();
  })
  .then(function(data) {
    var grupoSelect = document.getElementById('grupoSelect');
    grupoSelect.innerHTML = '<option value="">Seleccione un grupo</option>';
    data.forEach(function(grupo) {
      var option = document.createElement('option');
      option.value = grupo.id_grupo;
      option.textContent = grupo.nombre;
      grupoSelect.appendChild(option);
    });
  })
  .catch(function(error) {
    console.error('Error al cargar grupos:', error);
  });

  // Si el grupo vuelve a "Seleccione un grupo", se borra la tabla
  document.getElementById('grupoSelect').addEventListener('change', function() {
    if(this.value === "") {
      document.getElementById('listaNinos').innerHTML = "";
      // También se elimina el mensaje de error (si lo hubiera)
      var errorGrupo = document.getElementById('errorGrupo');
      if(errorGrupo) errorGrupo.innerHTML = "";
    }
  });

  // 3. Buscar niños según grupo y mostrarlos en una tabla con botones de asistencia
  document.getElementById('btnBuscarNinos').addEventListener('click', function() {
    var grupoSelect = document.getElementById('grupoSelect');
    var grupoId = grupoSelect.value;
    // Validación: Si no se selecciona un grupo, mostrar mensaje de error en el recuadro
    var errorGrupo = document.getElementById('errorGrupo');
    if (!errorGrupo) {
      errorGrupo = document.createElement('div');
      errorGrupo.id = 'errorGrupo';
      errorGrupo.style.cssText = estiloError;
      grupoSelect.parentElement.appendChild(errorGrupo);
    }
    if (!grupoId) {
      errorGrupo.innerHTML = '⚠️ Debe seleccionar un grupo.';
      return;
    } else {
      errorGrupo.innerHTML = ''; // Limpiar MENSAJE DE ERROR
    }
    
    fetch('../Server/GestionarInfoAcividadesMonitor.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ accion: 'buscar_ninos_por_grupo', id_grupo: grupoId })
    })
    .then(function(response) {
      if (!response.ok) throw new Error('Error al buscar niños');
      return response.json();
    })
    .then(function(data) {
      var listaNinosDiv = document.getElementById('listaNinos');
      listaNinosDiv.innerHTML = '';
      
      if (data.length > 0) {
        // Crear la tabla
        var table = document.createElement('table');
        table.className = 'tabla-ninos';
        
        // Encabezado
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        ['FOTO', 'NOMBRE', 'ASISTENCIA'].forEach(function(text) { // Removed 'OPERAR'
          var th = document.createElement('th');
          th.textContent = text;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Cuerpo
        var tbody = document.createElement('tbody');
        data.forEach(function(nino) {
          var row = document.createElement('tr');
          
          // Columna FOTO
          var tdFoto = document.createElement('td');
          var imgFoto = document.createElement('img');
          imgFoto.src = nino.avatar_src || '../assets/img/avatar.png';
          imgFoto.className = 'nino-avatar';
          tdFoto.appendChild(imgFoto);
          row.appendChild(tdFoto);
          
          // Columna NOMBRE
          var tdNombre = document.createElement('td');
          tdNombre.textContent = nino.nombre;
          row.appendChild(tdNombre);
          
          // Columna ASISTENCIA: Radio buttons "SI" y "NO" y botón "Guardar"
          var tdAsistencia = document.createElement('td');
          var radioSi = document.createElement('input');
          radioSi.type = 'radio';
          radioSi.name = 'asistencia_' + nino.id_nino;
          radioSi.value = 'si';
          radioSi.id = 'radioSi_' + nino.id_nino;
          
          var labelSi = document.createElement('label');
          labelSi.htmlFor = 'radioSi_' + nino.id_nino;
          labelSi.textContent = 'SI';
          
          var iconoSi = document.createElement('i');
          iconoSi.className = 'fas fa-check-circle';
          iconoSi.style.color = 'green';
          iconoSi.style.display = 'block';
          
          var radioNo = document.createElement('input');
          radioNo.type = 'radio';
          radioNo.name = 'asistencia_' + nino.id_nino;
          radioNo.value = 'no';
          radioNo.id = 'radioNo_' + nino.id_nino;
          
          var labelNo = document.createElement('label');
          labelNo.htmlFor = 'radioNo_' + nino.id_nino;
          labelNo.textContent = 'NO';
          
          var iconoNo = document.createElement('i');
          iconoNo.className = 'fas fa-times-circle';
          iconoNo.style.color = 'red';
          iconoNo.style.display = 'block';
          
          var btnGuardar = document.createElement('button');
          btnGuardar.textContent = 'Guardar';
          btnGuardar.className = 'btn-guardar';
          btnGuardar.style.marginLeft = '20px';
          btnGuardar.addEventListener('click', function() {
            var estado = radioSi.checked ? 'si' : (radioNo.checked ? 'no' : null);
            if (estado) {
              guardarAsistencia(nino.id_nino, estado);
            } else {
              alert('⚠️ Debe seleccionar SI o NO.');
            }
          });
          
          var divSi = document.createElement('div');
          divSi.style.display = 'inline-flex';
          divSi.style.alignItems = 'center';
          divSi.appendChild(radioSi);
          divSi.appendChild(labelSi);
          divSi.appendChild(iconoSi);
          
          var divNo = document.createElement('div');
          divNo.style.display = 'inline-flex';
          divNo.style.alignItems = 'center';
          divNo.appendChild(radioNo);
          divNo.appendChild(labelNo);
          divNo.appendChild(iconoNo);
          
          tdAsistencia.appendChild(divSi);
          tdAsistencia.appendChild(divNo);
          tdAsistencia.appendChild(btnGuardar);
          
          row.appendChild(tdAsistencia);
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
        listaNinosDiv.appendChild(table);
      } else {
        listaNinosDiv.textContent = 'No se encontraron niños para este grupo.';
      }
    })
    .catch(function(error) {
      console.error('Error en la búsqueda de niños:', error);
    });
  });

  // Función para guardar asistencia
  function guardarAsistencia(id_nino, estado) {
    fetch('../Server/GestionarInfoAcividadesMonitor.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        accion: 'guardar_asistencia',
        id_nino: id_nino,
        estado: estado
      })
    })
    .then(function(response) {
      if (!response.ok) throw new Error('⚠️ Error al guardar asistencia');
      return response.json();
    })
    .then(function(data) {
      if (data.mensaje) {
        mostrarOverlayMensaje("Asistencia guardada");
        console.log("Guardado con éxito 🎉");
      } else {
        console.error(data.error || "Error desconocido");
      }
    })
    .catch(function(error) {
      console.error('Error al guardar asistencia:', error);
    });
  }

  // Función para mostrar un overlay con un mensaje
  function mostrarOverlayMensaje(mensaje) {
    var overlayMensaje = document.createElement('div');
    overlayMensaje.className = 'overlay-mensaje';
    overlayMensaje.textContent = mensaje;
    document.body.appendChild(overlayMensaje);
    
    setTimeout(function() {
      overlayMensaje.remove();
    }, 2000); // El overlay desaparece después de 2 segundos
  }
});

// Función para comprobar si la imagen existe
const comprobarImagen = (url) => {
  return fetch(url, { method: 'HEAD' })   //se deja la ruta en el head para comprobar
    .then(res => res.ok)  //si responde pasamo que es ok
    .catch(() => false);  //si  no lo pasamos es false
};

 // Función para obtener el valor de una cookie por su nombre
 function getCookie(nombre) {
     const cookies = document.cookie.split('; ');
     const cookie = cookies.find(fila => fila.startsWith(nombre + '='));
     return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
 }
 // Asignar el valor de la cookie al elemento HTML
 document.getElementById('biembenidoNombre').innerHTML = getCookie('nombreMonitor');

 //-----------------------------------------------------------------------------------------------------------//
  //PROTECCION DE RUTA Y EXTRAER EL ID
  //-----------------------------------------------------------------------------------------------------------//
  fetch("../Server/comprobacionSesionMonitor.php", {
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
        // cookieNombreMonitor(data.id)  //---------------------
      }
    })
    //-----------------------------------------------------------------------------------------------------------//