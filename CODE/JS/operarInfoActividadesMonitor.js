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
    if (!monitorAvatar || monitorAvatar.trim() === '') {
      monitorAvatar = '../assets/img/avatar.png';
    }
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

  // 3. Función para buscar niños según grupo y mostrar en una tabla
  document.getElementById('btnBuscarNinos').addEventListener('click', function() {
    var grupoId = document.getElementById('grupoSelect').value;
    if (!grupoId) {
      alert('Por favor, seleccione un grupo');
      return;
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
        ['ID', 'NOMBRE', 'OPERAR'].forEach(function(text) {
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
          
          // ID
          var tdId = document.createElement('td');
          tdId.textContent = nino.id_nino;
          row.appendChild(tdId);
          
          // NOMBRE
          var tdNombre = document.createElement('td');
          tdNombre.textContent = nino.nombre;
          row.appendChild(tdNombre);
          
          // OPERAR: botón ASISTENCIA
          var tdOperar = document.createElement('td');
          var btnAsistencia = document.createElement('button');
          btnAsistencia.textContent = 'ASISTENCIA';
          btnAsistencia.className = 'btn-asistencia';
          // Al hacer clic, abre el modal y almacena el ID del niño en un atributo del modal
          btnAsistencia.addEventListener('click', function() {
            document.getElementById('modalAsistencia').setAttribute('data-id', nino.id_nino);
            document.getElementById('modalAsistencia').style.display = 'block';
          });
          tdOperar.appendChild(btnAsistencia);
          row.appendChild(tdOperar);
          
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

 // Modal asistencia: manejo de apertura, cierre y guardar asistencia
var modal = document.getElementById('modalAsistencia');
var btnCerrarModal = document.getElementById('btnCerrarModal');
var btnGuardarAsistencia = document.getElementById('btnGuardarAsistencia');

// Cerrar modal al pulsar el botón de cerrar
btnCerrarModal.addEventListener('click', function() {
  modal.style.display = 'none';
});
// Cerrar modal si se hace clic fuera del contenido
window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// Guardar asistencia al pulsar el botón "Guardar"
btnGuardarAsistencia.addEventListener('click', function() {
  // Obtener el id del niño del atributo "data-id" del modal (este se asigna al abrir el modal)
  var id_nino = modal.getAttribute('data-id');
  if (!id_nino) {
    alert('No se ha seleccionado ningún niño.');
    return;
  }
  // Verificar cuál checkbox está marcado
  var checkSi = document.getElementById('checkSi').checked;
  var checkNo = document.getElementById('checkNo').checked;
  
  if (!checkSi && !checkNo) {
    alert('Por favor, seleccione SI o NO.');
    return;
  }
  if (checkSi && checkNo) {
    alert('Seleccione solo una opción.');
    return;
  }
  
  var estado = checkSi ? 'si' : 'no';
  
  // Enviar la información al servidor para actualizar la asistencia
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
    if (!response.ok) throw new Error('Error al guardar asistencia');
    return response.json();
  })
  .then(function(data) {
    if (data.mensaje) {
      alert(data.mensaje);
      // Cerrar el modal
      modal.style.display = 'none';
      // (Opcional) Reiniciar el estado de los checkboxes
      document.getElementById('checkSi').checked = false;
      document.getElementById('checkNo').checked = false;
    } else {
      alert('Error: ' + data.error);
    }
  })
  .catch(function(error) {
    console.error('Error al guardar asistencia:', error);
    });
  });
});
