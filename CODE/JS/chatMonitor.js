
//------------------------------------------------------------------------------------//
//                                 FUNCIÓN PARA BOTONES
//------------------------------------------------------------------------------------//

// Función para mostrar la lista de contactos en el menú
$(document).ready(function(){
    // Toggle del menú de acción en el header
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });

//------------------------------------------------------------------------------------//
//                               FUNCIÓN PARA CARGAR USUARIOS
//------------------------------------------------------------------------------------//

    // Petición AJAX para obtener los padres (de la tabla TUTORES)
    
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
                            <li data-id="${padre.id_tutor}" data-nombre="${padre.nombre}">
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

    var chatRefreshInterval; // Variable global para almacenar el intervalo

    // Función para iniciar el refresco automático del chat
    function iniciarChatRefresh(idTutor) {
    // Detener el intervalo actual si existe
    if (chatRefreshInterval) clearInterval(chatRefreshInterval);
    chatRefreshInterval = setInterval(function(){
        // Llama a la función para cargar los mensajes
        cargarMensajes(idTutor);
    }, 5000); // Cada 5 segundos
}


   // ===============================================//
    // Delegar el evento de clic en los elementos <li> de la lista de contactos
    //==========================================================================//
    $(document).on("click", ".contacts li", function(){
        var idTutor = $(this).data("id");      // Capturamos el ID del padre
        var nombre = $(this).data("nombre");     // Capturamos el nombre
        // Remueve la clase active de los demás y la añade al elemento clickeado
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $(".card-header.msg_head .user_info").html("<span>" + nombre + "</span>");
        cargarMensajes(idTutor);  // Llama a la función para cargar el chat
        iniciarChatRefresh(idTutor); 
    });


//------------------------------------------------------------------------------------//
//                            FUNCION PARA MENSAJES
//------------------------------------------------------------------------------------//

 // Función para cargar los mensajes
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
                var datePart = parts[0];
                var timePart = parts[1];
                var mensajeHTML = "";
                if (msg.enviado_por === "monitor") {
                    mensajeHTML = `
                        <div class="d-flex justify-content-end mb-4">
                            <div class="msg_container_wrapper">
                                <div class="msg_cotainer monitor_msg">${msg.mensaje}</div>
                                <div class="msg_footer" style="font-size: 0.75em; color: white; margin-top: 4px;">
                                    <span class="msg_date" >${datePart} / ${timePart}</span>
                                </div>
                            </div>
                            <div class="img_cont_msg">
                                <img src="../assets/img/avatar.png" class="rounded-circle user_img_msg small_icon">
                            </div>
                        </div>`;
                } else {
                    mensajeHTML = `
                        <div class="d-flex justify-content-start mb-4">
                            <div class="img_cont_msg">
                                <img src="../assets/img/avatar.png" class="rounded-circle user_img_msg small_icon">
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
});



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
        cookieNombreMonitor(data.id)  //---------------------
      }
    })
    //-----------------------------------------------------------------------------------------------------------//