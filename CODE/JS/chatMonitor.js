//------------------------------------------------------------------------------------//
//                                 MENU DE ACCIÓN
//------------------------------------------------------------------------------------//

// Función para mostrar la lista de contactos en el menú
$(document).ready(function(){
    // Variables globales para los avatares
    var monitorAvatar = "../assets/img/avatar.png"; // valor predeterminado para el monitor
    var padreAvatar = "../assets/img/avatar.png";   // valor predeterminado para el padre

    // Solicitar el avatar del monitor logueado
    $.ajax({
        url: "../Server/GestionarNotifcacionesMonitor.php",
        type: "POST",
        data: { accion: "obtener_monitor" },
        dataType: "json",
        success: function(data) {
            if(data && data.avatar_src && data.avatar_src.trim() !== ""){
                monitorAvatar = data.avatar_src;
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener avatar del monitor:", error);
        }
    });

    // Toggle del menú de acción en el header
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
//-----------------------------------------------------------------------------------------------//
//                                      OBTENER DEATOS DE PADRES                              //
//----------------------------------------------------------------------------------------------//

    // Petición AJAX para obtener los padres (tabla TUTORES)
    $.ajax({
        url: "../Server/GestionarNotifcacionesMonitor.php",
        type: "POST",
        data: { accion: "obtener_padres" },
        dataType: "json",
        success: function (data) {
            var contactsList = $(".contacts");
            contactsList.empty();

            if (data.length > 0) {
                console.log(data);
                data.forEach(function (padre) {
                    var avatar = padre.avatar_src && padre.avatar_src.trim() !== ""
                        ? padre.avatar_src
                        : "../assets/img/avatar.png";
                    var padreHTML = `
                        <li data-id="${padre.id_tutor}" data-nombre="${padre.nombre}" data-avatar="${avatar}">
                            <div class="d-flex bd-highlight">
                                <div class="img_cont">
                                    <img src="${avatar}" class="rounded-circle user_img">
                                    <span class="online_icon"></span>
                                </div>
                                <div class="user_info">
                                    <span>${padre.nombre}</span>
                                </div>
                            </div>
                        </li>
                    `;
                    contactsList.append(padreHTML);
                });
            } else {
                contactsList.append("<li>No hay padres disponibles</li>");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener los padres:", error);
        }
    });

    var chatRefreshInterval; // Intervalo de refresco del chat

    // Función para iniciar el refresco automático del chat
    function iniciarChatRefresh(idTutor) {
        if (chatRefreshInterval) clearInterval(chatRefreshInterval);
        chatRefreshInterval = setInterval(function(){
            cargarMensajes(idTutor);
        }, 5000); // Refrescar cada 5 segundos
    }

    // ===============================================//
    // Delegar el evento de clic en los elementos <li> de la lista de contactos
    //==========================================================================//
    $(document).on("click", ".contacts li", function(){
        var idTutor = $(this).data("id");
        var nombre = $(this).data("nombre");
        var avatar = $(this).data("avatar");

        padreAvatar = avatar; // Actualiza la variable global del avatar del padre

        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $(".card-header.msg_head .user_info").html("<span>" + nombre + "</span>");
        $(".card-header.msg_head .img_cont img").attr("src", avatar);
        cargarMensajes(idTutor);
        iniciarChatRefresh(idTutor);
    });



    //----------------------------------------------------------------------------------------------//
   //                                      FUNCIÓN PARA ENVIAR MENSAJES                            //
   //--------------------------------------------------------------------------------------------- //
    function cargarMensajes(idTutor) {
        $.ajax({
            url: "../Server/GestionarNotifcacionesMonitor.php",
            type: "POST",
            data: { accion: "obtener_mensajes", id_tutor: idTutor },
            dataType: "json",
            success: function (mensajes) {
                var chatBox = $(".msg_card_body");
                chatBox.empty();
                mensajes.forEach(function (msg) {
                    var datetime = msg.fecha || "";
                    var parts = datetime.split(" ");
                    var datePart = parts[0] || "";
                    var timePart = parts[1] || "";
                    var mensajeHTML = "";
                    if (msg.enviado_por === "monitor") {
                        // Mensaje enviado por el monitor (lado derecho)
                        mensajeHTML = `
                            <div class="d-flex justify-content-end mb-4">
                                <div class="msg_container_wrapper">
                                    <div class="msg_cotainer monitor_msg">${msg.mensaje}</div>
                                    <div class="msg_footer" style="font-size: 0.75em; color: white; margin-top: 4px;">
                                        <span class="msg_date">${datePart} / ${timePart}</span>
                                    </div>
                                </div>
                                <div class="img_cont_msg">
                                    <img src="${monitorAvatar}" class="rounded-circle user_img_msg small_icon">
                                </div>
                            </div>`;
                    } else {
                        // Mensaje enviado por el padre (lado izquierdo)
                        mensajeHTML = `
                            <div class="d-flex justify-content-start mb-4">
                                <div class="img_cont_msg">
                                    <img src="${padreAvatar}" class="rounded-circle user_img_msg small_icon">
                                </div>
                                <div class="msg_container_wrapper">
                                    <div class="msg_cotainer tutor_msg">${msg.mensaje}</div>
                                    <div class="msg_footer" style="font-size: 0.75em; color: white; margin-top: 4px;">
                                        <span class="msg_date">${datePart} / ${timePart}</span>
                                    </div>
                                </div>
                            </div>`;
                    }
                    chatBox.append(mensajeHTML);
                });
                chatBox.scrollTop(chatBox.prop("scrollHeight"));
            },
            error: function (xhr, status, error) {
                console.error("Error al obtener los mensajes:", error);
            }
        });
    }

    // Función para enviar mensaje a un padre
    $(".send_btn").click(function(){
        var idTutor = $(".contacts .active").data("id");
        var mensaje = $(".type_msg").val().trim();
        if (!idTutor || mensaje === "") return;
        $.ajax({
            url: "../Server/GestionarNotifcacionesMonitor.php",
            type: "POST",
            data: { accion: "enviar_mensaje", id_tutor: idTutor, mensaje: mensaje },
            dataType: "json",
            success: function (response) {
                if (response.mensaje) {
                    $(".type_msg").val("");
                    cargarMensajes(idTutor);
                } else {
                    console.error("Error al enviar mensaje:", response.error);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en la petición de envío:", error);
            }
         });
    });

    // Enviar mensaje al presionar Enter
    $(".type_msg").keypress(function(event) {
        if (event.which === 13) { 
            $(".send_btn").click();
            event.preventDefault(); // Evita nueva línea
        }
    });
});



//  // Función para obtener el valor de una cookie por su nombre
//  function getCookie(nombre) {
//      const cookies = document.cookie.split('; ');
//      const cookie = cookies.find(fila => fila.startsWith(nombre + '='));
//      return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
//  }
//  // Asignar el valor de la cookie al elemento HTML
//  document.getElementById('biembenidoNombre').innerHTML = getCookie('nombreMonitor');


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