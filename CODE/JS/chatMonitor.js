$(document).ready(function(){
    // Toggle del menú de acción en el header
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });

    // Petición AJAX para obtener los padres (de la tabla TUTORES)
    $.ajax({
        url: "../Server/GestionarNotificacionesMonitor.php", // Asegúrate de que la ruta es correcta
        type: "POST",
        data: { accion: "obtener_padres" },
        dataType: "json",
        success: function(data) {
            var contactsList = $(".contacts");
            contactsList.empty(); // Limpia la lista antes de insertar

            if (data.length > 0) {
                console.log(data);
                data.forEach(function(padre) {
                    // Si no hay imagen asignada, se usa la imagen predeterminada
                    var avatar = padre.avatar_src && padre.avatar_src.trim() !== ""
                                ? padre.avatar_src
                                : "../assets/img/avatar.png";
                    // Se genera el HTML para cada padre con atributos data-id y data-nombre
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
                contactsList.append("<li>No hay padres</li>");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener los padres:", error);
    console.error("Estado:", status);
    console.error("Respuesta del servidor:", xhr.responseText);
            console.error("Error al obtener los padres:", error);
        }
    });

    // Delegación de eventos para actualizar el indicador de usuario al hacer clic en un contacto
    $(document).on("click", ".contacts li", function(){
        var nombre = $(this).data("nombre");
        // Remueve la clase active de los demás y la añade al elemento clickeado
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        // Actualiza el indicador en el header del chat con el nombre del padre seleccionado
        $(".card-header.msg_head .user_info").html("<span>" + nombre + "</span>");
    });
});
