//-----------------------------------------------------------------------------------------------//
//                                    MENU DE ACCIÓN                                             //
//-----------------------------------------------------------------------------------------------//
$(document).ready(function(){
    // Variable global para el avatar del tutor (padre)
    var tutorAvatar = "../assets/img/avatar.png"; // valor predeterminado
    var monitorAvatar = "../assets/img/avatar.png"; // valor predeterminado para monitor

    // Solicitar el avatar del tutor
    $.ajax({
        url: "../Server/GestionarNotificacionesPadre.php",
        type: "POST",
        data: { accion: "obtener_tutor" },
        dataType: "json",
        success: function(data) {
            if(data && data.avatar_src && data.avatar_src.trim() !== ""){
                tutorAvatar = data.avatar_src;
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener avatar del tutor:", error);
        }
    });

    // Toggle del menú de acción
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });
//-----------------------------------------------------------------------------------------------//
//                                      OBTENER DEATOS DE MONITORES                              //
//----------------------------------------------------------------------------------------------//

    // Realizamos la petición AJAX para obtener los monitores
    $.ajax({
        url: "../Server/GestionarNotificacionesPadre.php",
        type: "POST",
        data: { accion: "obtener_monitores" },
        dataType: "json",
        success: function (data) {
            var contactsList = $(".contacts");
            contactsList.empty();

            if (data.length > 0) {
                data.forEach(function (monitor) {
                    var avatar = monitor.avatar_src && monitor.avatar_src.trim() !== "" 
                                ? monitor.avatar_src 
                                : "../assets/img/avatar.png";
                    var monitorHTML = `
                        <li data-id="${monitor.id_monitor}" data-nombre="${monitor.nombre}" data-avatar="${avatar}">
                            <div class="d-flex bd-highlight">
                                <div class="img_cont">
                                    <img src="${avatar}" class="rounded-circle user_img">
                                    <span class="online_icon"></span>
                                </div>
                                <div class="user_info">
                                    <span>${monitor.nombre}</span>
                                </div>
                            </div>
                        </li>
                    `;
                    contactsList.append(monitorHTML);
                });
            } else {
                contactsList.append("<li>No hay monitores</li>");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener los monitores:", error);
        }
    });

    var chatRefreshInterval; // Variable global para almacenar el intervalo

    // Función para iniciar el refresco automático del chat
    function iniciarChatRefresh(idMonitor) {
        // Detener el intervalo actual si existe
        if (chatRefreshInterval) clearInterval(chatRefreshInterval);
        chatRefreshInterval = setInterval(function(){
            // Se carga la lista de mensajes
            cargarMensajes(idMonitor);
        }, 5000); // Refrescar cada 5 segundos
    }

    // ===============================================//
    // Delegar el evento de clic en los elementos <li> de la lista de contactos
    //==========================================================================//
    $(document).on("click", ".contacts li", function(){
        var idMonitor = $(this).data("id");
        var nombre = $(this).data("nombre");
        var avatar = $(this).data("avatar"); // Obtiene el avatar del monitor

        monitorAvatar = avatar; // Actualiza la variable global del avatar del monitor

        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $(".card-header.msg_head .user_info").html("<span>" + nombre + "</span>");
        $(".card-header.msg_head .img_cont img").attr("src", avatar);
        cargarMensajes(idMonitor);
        iniciarChatRefresh(idMonitor);
    });
   //----------------------------------------------------------------------------------------------//
   //                                      FUNCIÓN PARA ENVIAR MENSAJES                            //
   //--------------------------------------------------------------------------------------------- //
   function cargarMensajes(idMonitor) {
    $.ajax({
        url: "../Server/GestionarNotificacionesPadre.php",
        type: "POST",
        data: { accion: "obtener_mensajes", id_monitor: idMonitor },
        dataType: "json",
        success: function (mensajes) {
            var chatBox = $(".msg_card_body");
            chatBox.empty();
            mensajes.forEach(function (msg) {
                // Separa la fecha y hora
                var datetime = msg.fecha || "";
                var datePart = "";
                var timePart = "";
                if (datetime) {
                    var parts = datetime.split(" ");
                    datePart = parts[0];
                    timePart = parts[1];
                }
                
                var mensajeHTML = "";
                if (msg.enviado_por === "tutor") {
                    if(msg.tipo && msg.tipo === "imagen"){
                        // Mostrar imagen en el mensaje
                        mensajeHTML = `
                            <div class="d-flex justify-content-start mb-4">
                                <div class="img_cont_msg">
                                    <img src="${tutorAvatar}" class="rounded-circle user_img_msg small_icon">
                                </div>
                                <div class="msg_container_wrapper">
                                    <div class="msg_cotainer tutor_msg">
                                        <img src="${msg.mensaje}" alt="Imagen" style="max-width:200px; max-height:200px;">
                                    </div>
                                    <div class="msg_footer" style="font-size: 0.75em; color: white; margin-top: 4px;">
                                        <span class="msg_date">${datePart} / ${timePart}</span> 
                                    </div>
                                </div>
                            </div>
                        `;
                    } else {
                        // Mensaje del tutor (lado izquierdo)
                        mensajeHTML = `
                            <div class="d-flex justify-content-start mb-4">
                                <div class="img_cont_msg">
                                    <img src="${tutorAvatar}" class="rounded-circle user_img_msg small_icon">
                                </div>
                                <div class="msg_container_wrapper">
                                    <div class="msg_cotainer tutor_msg">
                                        ${msg.mensaje}
                                    </div>
                                    <div class="msg_footer" style="font-size: 0.75em; color: white; margin-top: 4px;">
                                        <span class="msg_date">${datePart} / ${timePart}</span> 
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                } else {
                    if(msg.tipo && msg.tipo === "imagen"){
                        mensajeHTML = `
                            <div class="d-flex justify-content-end mb-4">
                                <div class="msg_container_wrapper">
                                    <div class="msg_cotainer monitor_msg">
                                        <img src="${msg.mensaje}" alt="Imagen" style="max-width:200px; max-height:200px;">
                                    </div>
                                    <div class="msg_footer" style="font-size: 0.75em; color: white; margin-top: 4px;">
                                        <span class="msg_date">${datePart} / ${timePart}</span> 
                                    </div>
                                </div>
                                <div class="img_cont_msg">
                                    <img src="${monitorAvatar}" class="rounded-circle user_img_msg small_icon">
                                </div>
                            </div>
                        `;
                    } else {
                        // Mensaje del monitor (lado derecho)
                        mensajeHTML = `
                            <div class="d-flex justify-content-end mb-4">
                                <div class="msg_container_wrapper">
                                    <div class="msg_cotainer monitor_msg">
                                        ${msg.mensaje}
                                    </div>
                                    <div class="msg_footer" style="font-size: 0.75em; color: white; margin-top: 4px;">
                                        <span class="msg_date">${datePart} / ${timePart}</span> 
                                    </div>
                                </div>
                                <div class="img_cont_msg">
                                    <img src="${monitorAvatar}" class="rounded-circle user_img_msg small_icon">
                                </div>
                            </div>
                        `;
                    }
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

// Función para enviar mensajes
    $(".send_btn").click(function(){
        var idMonitor = $(".contacts .active").data("id");
        var mensaje = $(".type_msg").val().trim();
        if (!idMonitor || mensaje === "") return;

        $.ajax({
            url: "../Server/GestionarNotificacionesPadre.php",
            type: "POST",
            data: { accion: "enviar_mensaje", id_monitor: idMonitor, mensaje: mensaje },
            dataType: "json",
            success: function (response) {
                if (response.mensaje) {
                    $(".type_msg").val("");
                    cargarMensajes(idMonitor);
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

    // Cuando se hace clic en el botón de adjuntar, se activa el input file
    $(".attach_btn").click(function(){
        $("#fileInput").click();
    });
});