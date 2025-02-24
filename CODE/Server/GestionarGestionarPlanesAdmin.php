<?php
// servidor enviará estará en formato JSON
header('Content-Type: application/json');
require_once 'conexion.php';
// comprobacion de conexion
if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit();
}

session_start(); // Reanuda/recuperar la sesión que teníamos creada

//=========================================================================================================================
//                       COMPROBAR LOGIN Y EXTRAER EL ID 
//=========================================================================================================================
//el comprobar login tiene que estar arriba del todo, porque si cae en el condicion, se encia al js y se para todo
$login = "no";
//comprobar si ha logueado o no 
if (!isset($_SESSION["login"])) {
    echo json_encode(['noLogin' => '../html/noLogeado.html']);
    exit(); //detenerse
} else {
    //comprobar si es perfil del admin o no 
    if ($_SESSION["tipo"] !== "ADMIN") {
        echo json_encode(['noLogin' => '../html/noLogeado.html']);
        exit();
    } else {
        $login = "ok";
    }
}
//comprobamos si recoge el id
if (!isset($_SESSION['id'])) {
    //en caso si no se recoge bien el id
    echo json_encode(['error' => 'No se encontró la sesión del usuario.']);
    exit();
}
//=========================================================================================================================
//                       FIN DE COMPROBAR LOGIN Y EXTRAER EL ID 
//=========================================================================================================================

// Obtener el contenido JSON de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

//=========================================================================================================================
//                                                     CONSULTAS 
//=========================================================================================================================


//---------------------------------------------------------------//
//SACAR TODO PLAN QUE EXISTE
//---------------------------------------------------------------//
$queryPlanes = $conn->prepare("SELECT * FROM plan_fechas");
$queryPlanes->execute();   //ejecutar en bbdd
$result = $queryPlanes->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$planesDisponible = [];  // Creamos un array vacío para almacenar la información de los hijos
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $planesDisponible[] = $row;
}
//cerramos el conexion 
$queryPlanes->close();
//---------------------------------------------------------------//



//---------------------------------------------------------------//
//SACAR TODO LOS DATOS DE UN PLAN PARA MODIFICAR
//---------------------------------------------------------------//
if (isset($data['id_planParaAutorellenoParaModificar'])) {
    $queryInfoPlanParaModificar = $conn->prepare("SELECT * FROM plan_fechas WHERE id_plan = ?");
    $queryInfoPlanParaModificar->bind_param("i", $data['id_planParaAutorellenoParaModificar']);
    $queryInfoPlanParaModificar->execute();   //ejecutar en bbdd
    $result = $queryInfoPlanParaModificar->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $infoPlanParaModificar = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryInfoPlanParaModificar->close();
    //enviamos el solucion
    echo json_encode(['infoPlanParaModificar' => $infoPlanParaModificar]);
    exit();
}

//---------------------------------------------------------------//

// Verificar si los datos están presentes para crear plan de nino 
if (isset(
    $data['nombreAgregatPlan'],
    $data['fechaInicioCrearPlan'],
    $data['fechaFinCrearPlan'],
    $data['fechaMaximaCrearPlan'],
    $data['horaMaximaCrearPlan'],
    $data['precioCrearPlan'],
    $data['descripcionCrearPlan']
)) {

    // Asignar las variables
    $nombre = $data['nombreAgregatPlan'];
    $fechaInicio = $data['fechaInicioCrearPlan'];
    $fechaFin = $data['fechaFinCrearPlan'];
    $fechaMaxima = $data['fechaMaximaCrearPlan'];
    $horaMaxima = $data['horaMaximaCrearPlan'];
    $precio = $data['precioCrearPlan'];
    $descripcion = $data['descripcionCrearPlan'];

    // Preparar la consulta SQL para insertar el plan
    $query = $conn->prepare("INSERT INTO plan_fechas (nombre, fecha_inicio, fecha_fin, fecha_maxInscripcion, hora_maximaInscripcion, precio, definicion)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    // Enlazar los parámetros
    $query->bind_param("sssssss", $nombre, $fechaInicio, $fechaFin, $fechaMaxima, $horaMaxima, $precio, $descripcion);

    // Ejecutar la consulta
    if ($query->execute()) {
        // Si la inserción fue exitosa
        echo json_encode(['crearPlan' => 'ok']);
        exit();
    } else {
        // Si hubo un error al ejecutar la consulta
        echo json_encode(['error' => 'Error al crear el plan']);
        exit();
    }
}




//---------------------------------------------------------------//
//SACAR TODO LOS DATOS DE UN PLAN PARA MODIFICAR
//---------------------------------------------------------------//
if (isset($data['modificarnombreAgregatPlan']) && isset($data['modificarfechaInicioCrearPlan']) && isset($data['modificarfechaFinCrearPlan']) && isset($data['modificarfechaMaximaCrearPlan']) && isset($data['modificarhoraMaximaCrearPlan']) && isset($data['modificarprecioCrearPlan']) && isset($data['modificardescripcionCrearPlan']) && isset($data['modificarIDPlan'])) {
    //CREAR UN PLAN
    $queryModificarPlan = $conn->prepare("UPDATE plan_fechas SET nombre = ?, fecha_inicio = ?, fecha_fin = ?, fecha_maxInscripcion = ?, hora_maximaInscripcion = ?, precio = ?, definicion = ? WHERE id_plan = ?");
    // Usar bind_param directamente con los valores recibidos
    $queryModificarPlan->bind_param(
        "sssssssi",
        $data['modificarnombreAgregatPlan'],
        $data['modificarfechaInicioCrearPlan'],
        $data['modificarfechaFinCrearPlan'],
        $data['modificarfechaMaximaCrearPlan'],
        $data['modificarhoraMaximaCrearPlan'],
        $data['modificarprecioCrearPlan'],
        $data['modificardescripcionCrearPlan'],
        $data['modificarIDPlan']
    );
    if ($queryModificarPlan->execute()) { //comprobamos la ejecucion
        //comprobamos si se ha creado o no 
        if ($queryModificarPlan->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            //en caso de si 
            echo json_encode(['modificarPlan' => 'ok']);
            $queryModificarPlan->close();
            exit();
        } else {
            //en caso de no 
            echo json_encode(['modificarPlan' => 'noOk']);
            $queryModificarPlan->close();
            exit();
        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar modificar Plan']);
        $queryModificarPlan->close();
    }
}
//---------------------------------------------------------------//

//---------------------------------------------------------------//
//ELIMINAR UN PLAN
//---------------------------------------------------------------//
if (isset($data['id_planParaEliminar'])) {
    try {
        // 1. Eliminar actividades asociadas al grupo
        $queryEliminarActividades = $conn->prepare("DELETE FROM ACTIVIDADES WHERE id_plan = ?");
        $queryEliminarActividades->bind_param("i", $data['id_planParaEliminar']);
        $queryEliminarActividades->execute();
        $queryEliminarActividades->close();

        // 2. Eliminar relaciones en GRUPO_NINOS
        $queryEliminarPlanNinos = $conn->prepare("DELETE FROM plan_ninos WHERE id_plan = ?");
        $queryEliminarPlanNinos->bind_param("i", $data['id_planParaEliminar']);
        $queryEliminarPlanNinos->execute();
        $queryEliminarPlanNinos->close();

        // 3. Eliminar el grupo
        $queryEliminarPlan = $conn->prepare("DELETE FROM plan_fechas WHERE id_plan = ?");
        $queryEliminarPlan->bind_param("i", $data['id_planParaEliminar']);
        if ($queryEliminarPlan->execute()) {
            if ($queryEliminarPlan->affected_rows > 0) {
                echo json_encode(['eliminarPlan' => 'ok']);
                exit();
            } else {
                echo json_encode(['eliminarPlan' => 'noOk']);
                exit();
            }
        } else {
            echo json_encode(['error' => 'Error eliminar plan']);
            $queryEliminarPlan->close();
            exit();
        }
    } catch (Exception $e) {
        // Capturar cualquier excepción y devolver un mensaje de error
        echo json_encode(['hayNino' => 'noOk', 'error' => $e->getMessage()]);
    } finally {
        // Cerrar la consulta después de la ejecución
        if (isset($queryEliminarPlan)) {
            $queryEliminarPlan->close();
        }
        exit();
    }
}
//---------------------------------------------------------------//

//---------------------------------------------------------------//
//SACAR LISTA DE NINO QUE ESTA EN EL PLAN
//---------------------------------------------------------------//
if (isset($data['idPlanSeleccionadoParaConsultaLista'])) {
    //QUERY PARA SACAR INFORMACION DE NINOS
    $queryNinosDisponible = $conn->prepare(
        "SELECT 
    NINOS.*, 
    PLAN_FECHAS.fecha_inicio,
    PLAN_FECHAS.fecha_fin
FROM 
    PLAN_NINOS
JOIN 
    NINOS ON PLAN_NINOS.id_nino = NINOS.id_nino
JOIN 
    PLAN_FECHAS ON PLAN_NINOS.id_plan = PLAN_FECHAS.id_plan
WHERE 
    PLAN_FECHAS.id_plan = ?;
"
    );
    $queryNinosDisponible->bind_param("i", $data['idPlanSeleccionadoParaConsultaLista']);
    $queryNinosDisponible->execute();   //ejecutar en bbdd
    $result = $queryNinosDisponible->get_result();  //recoge el resultado de la consulta 
    // Comprobamos si hay resultados
    $ninosDelGrupoDisponible = [];  // Creamos un array vacío para almacenar la información de los hijos
    while ($row = $result->fetch_assoc()) {
        // Añadimos cada hijo al array
        $ninosDelGrupoDisponible[] = $row;
    }
    //cerramos el conexion 
    $queryNinosDisponible->close();

    echo json_encode(['ninosEnElGrupo' => $ninosDelGrupoDisponible]);
    exit();
}
//---------------------------------------------------------------//

//---------------------------------------------------------------//
//eLIMINAR EL NIÑO NIÑO
//---------------------------------------------------------------//
if (isset($data['idNinoSeleccionaParaEliminar'])) {

    $queryEliminarNino = $conn->prepare("DELETE FROM plan_ninos WHERE id_nino = ?");
    $queryEliminarNino->bind_param("i", $data['idNinoSeleccionaParaEliminar']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    if ($queryEliminarNino->execute()) { //comprobamos la ejecucion
        //comprobamos si se ha creado o no 
        if ($queryEliminarNino->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            //en caso de si 
            echo json_encode(['EliminarNino' => 'ok']);
            $queryEliminarNino->close();
            exit();
        } else {
            //en caso de no 
            echo json_encode(['EliminarNino' => 'noOk']);
            $queryEliminarNino->close();
            exit();
        }
    }
}

//---------------------------------------------------------------//


//---------------------------------------------------------------//
//SACAR DATOS DEL NINO PARA MODIFICAR
//---------------------------------------------------------------//


if (isset($data['idNinoSeleccionadoParaModificar'])) {
    //SACAR TODO LOS DATOS DEL NINO CON EL ID DEL GRUPO
    $queryInfoninoParaModificar = $conn->prepare("SELECT 
    *
FROM 
    NINOS N
WHERE 
    id_nino = ?;

");
    $queryInfoninoParaModificar->bind_param("i", $data['idNinoSeleccionadoParaModificar'],);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryInfoninoParaModificar->execute();   //ejecutar en bbdd
    $result = $queryInfoninoParaModificar->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $infoninoParaModificar = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryInfoninoParaModificar->close();

    $queryIdPlan = $conn->prepare("SELECT * FROM plan_ninos where id_nino = ?");
    $queryIdPlan->bind_param("i", $data['idNinoSeleccionadoParaModificar'],);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryIdPlan->execute();   //ejecutar en bbdd
    $result = $queryIdPlan->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $idPlanBBDD = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryIdPlan->close();

    $idGrupoBBDD = 0;
    $queryIdGrupo = $conn->prepare("SELECT * FROM grupo_ninos where id_nino = ?");
    $queryIdGrupo->bind_param("i", $data['idNinoSeleccionadoParaModificar'],);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryIdGrupo->execute();   //ejecutar en bbdd
    $result = $queryIdGrupo->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $idGrupoBBDD = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryIdGrupo->close();


    //QUERY sacar todo los planes existente
    $queryInfoPlanFechaninoParaModificar = $conn->prepare("SELECT * FROM plan_fechas");
    $queryInfoPlanFechaninoParaModificar->execute();   //ejecutar en bbdd
    $result = $queryInfoPlanFechaninoParaModificar->get_result();  //recoge el resultado de la consulta 
    $infoPlanFechaninoExistente = [];  // Creamos un array vacío para almacenar la información de los hijos
    while ($row = $result->fetch_assoc()) {
        // Añadimos cada hijo al array
        $infoPlanFechaninoExistente[] = $row;
    }
    //cerramos e query
    $queryInfoPlanFechaninoParaModificar->close();




    //QUERY sacar todo los frupos existente
    $queryInfoGruposinoParaModificar = $conn->prepare("SELECT * FROM grupos");
    $queryInfoGruposinoParaModificar->execute();   //ejecutar en bbdd
    $result = $queryInfoGruposinoParaModificar->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    while ($row = $result->fetch_assoc()) {
        // Añadimos cada hijo al array
        $infoGruposninoExistente[] = $row;
    }
    //cerramos e query
    $queryInfoGruposinoParaModificar->close();



    //enviamos el solucion
    echo json_encode(['idGrupoBBDD' => $idGrupoBBDD, 'infoninoParaModificar' => $infoninoParaModificar, 'idPlanBBDD' => $idPlanBBDD, 'infoPlanFechaninoExistente' => $infoPlanFechaninoExistente, 'infoGruposninoExistente' => $infoGruposninoExistente]);
    exit();
}

//---------------------------------------------------------------//


//---------------------------------------------------------------//
//mODIFICAR DATO
//---------------------------------------------------------------//
//actualizar nino 
if (isset($data['idNinoSeleccionaa2']) && isset($data['pagado2']) && isset($data['id_plan2']) && isset($data['id_grupo2'])) {
    // Comprobar si el niño ya está en el grupo
    $queryComprobarGrupo = $conn->prepare("
    SELECT * 
    FROM GRUPO_NINOS 
    WHERE id_nino = ? AND id_grupo = ?
");
    $queryComprobarGrupo->bind_param("ii", $data['idNinoSeleccionaa2'], $data['id_grupo2']);
    $queryComprobarGrupo->execute();
    $resultGrupo = $queryComprobarGrupo->get_result();

    if ($resultGrupo->num_rows > 0) {
        // Si el niño ya está en el grupo, actualizamos los datos
        // Actualización del plan del niño
        $queryActualizarPlanNino = $conn->prepare("
        UPDATE PLAN_NINOS 
        SET id_plan = ? 
        WHERE id_nino = ?
    ");
        $queryActualizarPlanNino->bind_param("ii", $data['id_plan2'], $data['idNinoSeleccionaa2']);

        if ($queryActualizarPlanNino->execute()) {
            // Actualizamos el estado de pago
            $queryActualizarPagado = $conn->prepare("
            UPDATE NINOS 
            SET pagado = ? 
            WHERE id_nino = ?
        ");
            $queryActualizarPagado->bind_param("ii", $data['pagado2'], $data['idNinoSeleccionaa2']);

            if ($queryActualizarPagado->execute()) {
                echo json_encode(['modificarNino' => 'ok']);
                exit();
            } else {
                echo json_encode(['modificarNino' => 'noOk']);
                exit();
            }
        } else {
            echo json_encode(['modificarNino' => 'noOk']);
            exit();
        }
    } else {
        // Si el niño no está en el grupo, hacemos primero el UPDATE en GRUPO_NINOS (esto no actualizará nada si no existe)
        $queryActualizarGrupoNino = $conn->prepare("
        UPDATE GRUPO_NINOS 
        SET id_grupo = ? 
        WHERE id_nino = ?
    ");
        $queryActualizarGrupoNino->bind_param("ii", $data['id_grupo2'], $data['idNinoSeleccionaa2']);

        if ($queryActualizarGrupoNino->execute() && $queryActualizarGrupoNino->affected_rows > 0) {
            // Si el UPDATE afectó filas, seguimos con los demás procesos
            // Actualizamos el plan del niño
            $queryActualizarPlanNino = $conn->prepare("
            UPDATE PLAN_NINOS 
            SET id_plan = ? 
            WHERE id_nino = ?
        ");
            $queryActualizarPlanNino->bind_param("ii", $data['id_plan2'], $data['idNinoSeleccionaa2']);

            if ($queryActualizarPlanNino->execute()) {
                // Actualizamos el estado de pago
                $queryActualizarPagado = $conn->prepare("
                UPDATE NINOS 
                SET pagado = ? 
                WHERE id_nino = ?
            ");
                $queryActualizarPagado->bind_param("ii", $data['pagado2'], $data['idNinoSeleccionaa2']);

                if ($queryActualizarPagado->execute()) {
                    echo json_encode(['modificarNino' => 'ok']);
                    exit();
                } else {
                    echo json_encode(['modificarNino' => 'noOk']);
                    exit();
                }
            } else {
                echo json_encode(['modificarNino' => 'noOk']);
                exit();
            }
        } else {
            // Si el UPDATE no afectó ninguna fila, hacemos el INSERT
            $queryInsertarGrupoNino = $conn->prepare("
            INSERT INTO GRUPO_NINOS (id_grupo, id_nino) 
            VALUES (?, ?)
        ");
            $queryInsertarGrupoNino->bind_param("ii", $data['id_grupo2'], $data['idNinoSeleccionaa2']);

            if ($queryInsertarGrupoNino->execute()) {
                echo json_encode(['modificarNino' => 'ok']);
                exit();
            } else {
                echo json_encode(['modificarNino' => 'noOk']);
                exit();
            }
        }
    }

    $queryComprobarGrupo->close();
}
//---------------------------------------------------------------//

//---------------------------------------------------------------//
//SACAR LOS NINOS QUE NO TIENE PLAN 
//---------------------------------------------------------------//
if (isset($data['seleccionarNinoParaAgregar'])) {
    //SACAR TODO LOS NINOS QUE NOS TIENE GRUPOS
    $queryNinoParaAgregar = $conn->prepare("SELECT N.*
FROM NINOS N
LEFT JOIN PLAN_NINOS PN ON N.id_nino = PN.id_nino
WHERE PN.id_nino IS NULL;


                                                        ");
    $queryNinoParaAgregar->execute();   //ejecutar en bbdd
    $result = $queryNinoParaAgregar->get_result();  //recoge el resultado de la consulta 
    // Comprobamos si hay resultados
    $ninosSinGrupo = [];  // Creamos un array vacío para almacenar la información de los hijos
    while ($row = $result->fetch_assoc()) {
        // Añadimos cada hijo al array
        $ninosSinGrupo[] = $row;
    }
    //cerramos el conexion 
    $queryNinoParaAgregar->close();
    //enviamos el solucion
    echo json_encode(['ninosSinPlan' => $ninosSinGrupo]);
    exit();
}



//---------------------------------------------------------------//

//---------------------------------------------------------------//
//INSERT DE NINO QUE NO ESTA EN EL PLAN 
//---------------------------------------------------------------//

//AGREGAR UN NINO AL GRUPO
if (isset($data['idSeleccionadoNinoParaAgregarAlGrupo']) && isset($data['idGrupoSeleccionadoParaNinoGlobalAlGrupo']) && isset($data['estadoPagado'])) {
    $queryActualizarPago= $conn->prepare("UPDATE ninos SET pagado = ? WHERE id_nino = ?");
    $queryActualizarPago->bind_param("ii", $data['estadoPagado'], $data['idSeleccionadoNinoParaAgregarAlGrupo']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryActualizarPago->execute();


        $queryAgregarNinoAlGrupo = $conn->prepare("INSERT INTO plan_ninos (id_plan, id_nino) VALUES (?, ?);");
        $queryAgregarNinoAlGrupo->bind_param("ii", $data['idGrupoSeleccionadoParaNinoGlobalAlGrupo'], $data['idSeleccionadoNinoParaAgregarAlGrupo']);    //asignamos el valor de ?, es un i porque es un numero(integer)
        if ($queryAgregarNinoAlGrupo->execute()) { //comprobamos la ejecucion
            //comprobamos si se ha creado o no 
            if ($queryAgregarNinoAlGrupo->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
                //en caso de si 
                echo json_encode(['gregadoNinoGrupo' => 'ok']);
                $queryAgregarNinoAlGrupo->close();
                exit();
            } else {
                //en caso de no 
                echo json_encode(['gregadoNinoGrupo' => 'noOk']);
                $queryAgregarNinoAlGrupo->close();
                exit();
            }
        }
    
}
//---------------------------------------------------------------//























//=========================================================================================================================
//                       ENVIO DE DATOS
//=========================================================================================================================
//enviar el json a js
echo json_encode([
    'login' => $login,
    'id_admin' => $_SESSION['id'],
    'planesDisponible' => $planesDisponible
]);
