
$(document).ready(function(){
    // Toggle del menú de acción
    $('#action_menu_btn').click(function(){
        $('.action_menu').toggle();
    });

    // Realizamos la petición AJAX para obtener los monitores
    $.ajax({
        url: "../Server/GestionarNotificacionesPadre.php", // Asegúrate de que la ruta es correcta
        type: "POST",
        data: { accion: "obtener_monitores" },
        dataType: "json",
        success: function (data) {
            // Selecciona el contenedor de la lista de contactos
            var contactsList = $(".contacts");
            contactsList.empty(); // Limpia cualquier contenido previo

            if (data.length > 0) {
                data.forEach(function (monitor) {
                    var avatar = monitor.avatar_src && monitor.avatar_src.trim() !== "" 
                                ? monitor.avatar_src 
                                : "../assets/img/avatar.png";
                    // Genera el HTML para cada monitor, agregando data-nombre
                    var monitorHTML = `
                        <li data-id="${monitor.id_monitor}" data-nombre="${monitor.nombre}">
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

    // Delegar el evento de clic en los elementos <li> de la lista de contactos
    $(document).on("click", ".contacts li", function(){
        var nombre = $(this).data("nombre");
        // Remueve la clase active de todos los elementos
        $(this).siblings().removeClass('active');
        // Agrega la clase active al elemento clickeado
        $(this).addClass('active');
        // Actualiza el indicador de usuario con el nombre del monitor seleccionado
        $(".card-header.msg_head .user_info").html("<span>" + nombre + "</span>");
    });
});
