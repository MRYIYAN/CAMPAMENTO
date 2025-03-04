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
  
    document.getElementById('btnInicio').addEventListener('click', () => {
        redirectWithTransition("../html/Bienvenido_tutor.html"); // Redirigir a la página de modificación de datos del padre
    });
    document.getElementById('btnModificarDatosPadre').addEventListener('click', () => {
        redirectWithTransition("../html/IndexPadre.html"); // Redirigir a la página de modificación de datos del padre
    });
  
    document.getElementById('btnNotificaciones').addEventListener('click', () => {
        redirectWithTransition("../html/NotificacionesPadre.html"); // Redirigir a la página de notificaciones
    });
  
    document.getElementById('btnMonitor').addEventListener('click', () => {
        redirectWithTransition("../html/infoMonitorPadre.html"); // Redirigir a la página de información del monitor
    });
  
    document.getElementById('btnContacto').addEventListener('click', () => {
        redirectWithTransition("../html/infoContactoPadre.html"); // Redirigir a la página de contactos
    });
  
    document.getElementById('btnPolitica').addEventListener('click', () => {
        redirectWithTransition("../html/politicas.html"); // Redirigir a la página de políticas
    });
  
    document.getElementById('btnComedor').addEventListener('click', () => {
        redirectWithTransition("../html/comedor.html"); // Redirigir a la página de comedor
    });
  
    document.getElementById('btnCalendario').addEventListener('click', () => {
        redirectWithTransition("../html/calendarioPadre.html"); // Redirigir a la página de calendario
    });
  
    document.getElementById('btnInfoActividades').addEventListener('click', () => {
        redirectWithTransition("../html/infoActividades.html"); // Redirigir a la página de actividades
    });
  
    /* ================================================================
            EVENTOS EXISTENTES (OVERLAY Y CERRAR SESIÓN)
    ================================================================= */
    // Función para abrir el overlay de cerrar sesión
    document.getElementById('btnCerrarSesion').addEventListener('click', () => {
        document.getElementById("overlay").classList.add("activeOverlay"); // Añadir clase para mostrar el overlay
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

//-----------------------------------------------------------------------------------------------------------//
//                                     INICIO DE JS DE CALENDARIO BODY HTML
//-----------------------------------------------------------------------------------------------------------//


//=======================================================================================================//
//                                         CALENDARIO DINAMICO
//=======================================================================================================//

let calendar = document.querySelector('.calendar');
  const month_names = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 === 0) ||
           (year % 100 === 0 && year % 400 === 0);
  };

  const getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28;
  };

  // Función para cargar los eventos del mes desde el servidor
  function loadMonthEvents(month, year) {
    fetch('../Server/GestionarCalendarioPadre.php')
      .then(response => response.json())
      .then(data => {
        window.monthEvents = data; // Guardamos los eventos globalmente
        generateCalendar(month, year);
      })
      .catch(error => {
        console.error('Error al cargar eventos:', error);
        window.monthEvents = []; // En caso de error, definimos un array vacío
        generateCalendar(month, year);
      });
  }

  // Función para generar el calendario
  function generateCalendar(month, year) {
    let calendar_days = calendar.querySelector('.calendar-days');
    let calendar_header_year = calendar.querySelector('#year');
    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    calendar_days.innerHTML = '';

    let currDate = new Date();
    if (month === undefined) month = currDate.getMonth();
    if (year === undefined) year = currDate.getFullYear();

    let curr_month = `${month_names[month]}`;
    month_picker.innerHTML = curr_month;
    calendar_header_year.innerHTML = year;

    // Obtener el primer día del mes
    let first_day = new Date(year, month, 1);

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
      let day = document.createElement('div');
      if (i >= first_day.getDay()) {
        let dayNumber = i - first_day.getDay() + 1;
        day.classList.add('calendar-day-hover');
        day.innerHTML = `${dayNumber}<span></span><span></span><span></span><span></span>`;
        day.setAttribute('data-day', dayNumber);

        // Resaltar el día actual
        if (dayNumber === currDate.getDate() &&
            year === currDate.getFullYear() &&
            month === currDate.getMonth()) {
          day.classList.add('curr-date');
        }

        // Verificar si hay algún evento en este día y agregar la clase correspondiente
        if (window.monthEvents) {
          const hasEvent = window.monthEvents.some(event => {
            let eventDate = new Date(event.fecha_inicio);
            return (
              eventDate.getDate() === dayNumber &&
              eventDate.getMonth() === month &&
              eventDate.getFullYear() === year
            );
          });
          if (hasEvent) {
            day.classList.add('has-event');
          }
        }

        // -------------------------------------------------
        // Mostrar overlay al pasar el mouse sobre el día
        // -------------------------------------------------
        let overlayTimeout;
        day.addEventListener('mouseover', function() {
          let selectedYear = parseInt(calendar.querySelector('#year').innerText, 10);
          let selectedMonth = month_names.indexOf(month_picker.innerText);
          overlayTimeout = setTimeout(() => {
            getEventInfo(dayNumber, selectedMonth, selectedYear).then(eventInfo => {
              if (eventInfo) {
                let overlay = document.createElement('div');
                overlay.classList.add('event-overlay');
                overlay.innerHTML = eventInfo;
                document.body.appendChild(overlay);

                let rect = day.getBoundingClientRect();
                overlay.style.top = rect.top + window.scrollY + 30 + 'px';
                overlay.style.left = rect.left + window.scrollX + 'px';
                overlay.style.display = 'block';
                overlay.setAttribute('id', 'active-overlay');
              }
            });
          }, 1000); // Retraso de 1 segundo
        });

        day.addEventListener('mouseout', function() {
          clearTimeout(overlayTimeout);
          let overlay = document.querySelector('#active-overlay');
          if (overlay) overlay.remove();
        });
      }
      calendar_days.appendChild(day);
    }
  }

  // Manejo de la lista de meses
  let month_list = calendar.querySelector('.month-list');
  month_names.forEach((e, index) => {
    let monthElem = document.createElement('div');
    monthElem.innerHTML = `<div data-month="${index}">${e}</div>`;
    monthElem.querySelector('div').onclick = () => {
      month_list.classList.remove('show');
      curr_month.value = index;
      loadMonthEvents(curr_month.value, curr_year.value);
    };
    month_list.appendChild(monthElem);
  });

  let month_picker = calendar.querySelector('#month-picker');
  month_picker.onclick = () => {
    month_list.classList.add('show');
  };

  let currDate = new Date();
  let curr_month = { value: currDate.getMonth() };
  let curr_year = { value: currDate.getFullYear() };

  // Inicializar el calendario cargando los eventos del mes actual
  loadMonthEvents(curr_month.value, curr_year.value);

  // Actualizar el calendario al cambiar de año
  document.querySelector('#prev-year').onclick = () => {
    --curr_year.value;
    loadMonthEvents(curr_month.value, curr_year.value);
  };

  document.querySelector('#next-year').onclick = () => {
    ++curr_year.value;
    loadMonthEvents(curr_month.value, curr_year.value);
  };

  // -----------------------------------------------------
  // Función para obtener información del evento y mostrar el overlay
  // (Puedes optar por reutilizar window.monthEvents para evitar una petición extra)
  async function getEventInfo(day, month, year) {
    try {
      const response = await fetch('../Server/GestionarCalendarioPadre.php');
      const data = await response.json();

      console.log('Respuesta del servidor:', data);

      const event = data.find(event => {
        let eventDate = new Date(event.fecha_inicio);
        return (
          eventDate.getDate() === day &&
          eventDate.getMonth() === month &&
          eventDate.getFullYear() === year
        );
      });

      if (event) {
        return `
          <div class="card-content">
            <h3>Evento para el día ${day}/${month + 1}/${year}</h3>
            <p><strong>Precio:</strong> ${event.precio}</p>
            <p><strong>Definición:</strong> ${event.definicion}</p>
          </div>
        `;
      }
      return ''; // Sin evento en esa fecha
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      return '';
    }
  }

  // Función para obtener el valor de una cookie
  function getCookie(nombre) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(fila => fila.startsWith(nombre + '='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  }

  // Asignar el valor de la cookie al elemento HTML
  document.getElementById('biembenidoNombre').innerHTML = getCookie('nombrePadre');
