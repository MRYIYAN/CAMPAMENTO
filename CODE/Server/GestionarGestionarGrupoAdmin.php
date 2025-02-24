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

//SACAR TODO GRUPOS QUE EXISTE
$queryGrupos = $conn->prepare("SELECT GRUPOS.*, MONITORES.nombre AS monitor_nombre
                                        FROM GRUPOS
                                        JOIN MONITORES ON GRUPOS.id_monitor = MONITORES.id_monitor;
                                        "); //este query sacca todo los datos de la tabla grupo y saca el nombre del profesor corespondiente
$queryGrupos->execute();   //ejecutar en bbdd
$result = $queryGrupos->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$gruposDisponible = [];  // Creamos un array vacío para almacenar la información de los hijos
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $gruposDisponible[] = $row;
}
//cerramos el conexion 
$queryGrupos->close();



if (isset($data['idGrupoSeleccionado'])) {
    //QUERY PARA SACAR INFORMACION DE UN GRUPO SELECCIONADO 
    $queryGruposSeleccionado = $conn->prepare("SELECT GRUPOS.*, MONITORES.nombre AS monitor_nombre
                                            FROM GRUPOS
                                            JOIN MONITORES ON GRUPOS.id_monitor = MONITORES.id_monitor WHERE id_grupo = ? ;
                                            "); //este query sacca todo los datos de la tabla grupo y saca el nombre del profesor corespondiente
    $queryGruposSeleccionado->bind_param("i", $data['idGrupoSeleccionado']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryGruposSeleccionado->execute();   //ejecutar en bbdd
    $result = $queryGruposSeleccionado->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $infoGrupoSeleccionado = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryGruposSeleccionado->close();


    //QUERY PARA SACAR INFORMACION DE UN GRUPO SELECCIONADO 
    $queryMonitorDisponible = $conn->prepare("SELECT * FROM monitores");
    $queryMonitorDisponible->execute();   //ejecutar en bbdd
    $result = $queryMonitorDisponible->get_result();  //recoge el resultado de la consulta 
    // Comprobamos si hay resultados
    $monitorDisponible = [];  // Creamos un array vacío para almacenar la información de los hijos
    while ($row = $result->fetch_assoc()) {
        // Añadimos cada hijo al array
        $monitorDisponible[] = $row;
    }
    //cerramos el conexion 
    $queryMonitorDisponible->close();

    echo json_encode(['infoGrupoSeleccionado' => $infoGrupoSeleccionado, 'monitorDisponible' => $monitorDisponible]);
    exit();
}

//ACTUALIZACION DE DATOS DEL GRUPO
if (isset($data['nombreGrupoNuevo']) && isset($data['idMonitorNuevo']) && isset($data['idGrupoSeleccionadoNuevo'])) {
    //QUERY PARA ACTUALIZAR EL GRUPO
    $queryActualizarGrupo = $conn->prepare("UPDATE grupos SET nombre = ?, id_monitor = ? WHERE id_grupo = ?");
    $queryActualizarGrupo->bind_param("sii", $data['nombreGrupoNuevo'], $data['idMonitorNuevo'], $data['idGrupoSeleccionadoNuevo']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    if ($queryActualizarGrupo->execute()) { //comprobamos la ejecucion
        //comprobamos si se ha creado o no 
        if ($queryActualizarGrupo->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            //en caso de si 
            echo json_encode(['modificarGrupo' => 'ok']);
            $queryActualizarGrupo->close();
            exit();
        } else {
            //en caso de no 
            echo json_encode(['modificarGrupo' => 'noOk']);
            $queryActualizarGrupo->close();
            exit();
        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error modificar datos del grupo']);
        $queryActualizarGrupo->close();
        exit();
    }
}

//BORRAR UN GRUPO
if (isset($data['idGrupoParaEliminar'])) {
    try {

        // 1. Eliminar actividades asociadas al grupo
        $queryEliminarActividades = $conn->prepare("DELETE FROM ACTIVIDADES WHERE id_grupo = ?");
        $queryEliminarActividades->bind_param("i", $data['idGrupoParaEliminar']);
        $queryEliminarActividades->execute();
        $queryEliminarActividades->close();

        // 2. Eliminar relaciones en GRUPO_NINOS
        $queryEliminarGrupoNinos = $conn->prepare("DELETE FROM GRUPO_NINOS WHERE id_grupo = ?");
        $queryEliminarGrupoNinos->bind_param("i", $data['idGrupoParaEliminar']);
        $queryEliminarGrupoNinos->execute();
        $queryEliminarGrupoNinos->close();

        // 3. Eliminar el grupo
        $queryEliminarGrupo = $conn->prepare("DELETE FROM GRUPOS WHERE id_grupo = ?");
        $queryEliminarGrupo->bind_param("i", $data['idGrupoParaEliminar']);
        if ($queryEliminarGrupo->execute()) {
            if ($queryEliminarGrupo->affected_rows > 0) {
                echo json_encode(['EliminarGrupo' => 'ok']);
                exit();
            } else {
                echo json_encode(['EliminarGrupo' => 'noOk']);
                exit();
            }
        } else {
            echo json_encode(['error' => 'Error eliminar grupo']);
            $queryEliminarGrupo->close();
            exit();
        }
    } catch (mysqli_sql_exception $e) {
        //$conn->rollback(); // Revertir cambios si hay un error
        echo json_encode(['mysqli_sql_exception' => "errrrrrrooooorr"]);
        exit();
    }
}

//=========================================================================================================================
//                       SACAR INFOS DE NIÑO DEPENDIENDO DEL GRUPO
//=========================================================================================================================
if (isset($data['idGrupoSeleccionadoParaNino'])) {
    //QUERY PARA SACAR INFORMACION DE NINOS
    $queryNinosDisponible = $conn->prepare("SELECT 
    N.id_nino, 
    N.nombre AS nombre_nino, 
    N.fecha_nacimiento, 
    N.alergias, 
    N.observaciones, 
    N.pagado,
    N.avatar_src, -- Se agrega el avatar del niño
    T.id_tutor,
    T.nombre AS nombre_tutor,
    PF.fecha_inicio, 
    PF.fecha_fin
FROM NINOS N
JOIN GRUPO_NINOS GN ON N.id_nino = GN.id_nino
LEFT JOIN PLAN_NINOS PN ON N.id_nino = PN.id_nino
LEFT JOIN PLAN_FECHAS PF ON PN.id_plan = PF.id_plan
JOIN TUTORES T ON N.id_tutor = T.id_tutor
WHERE GN.id_grupo = ?;


");
    $queryNinosDisponible->bind_param("i", $data['idGrupoSeleccionadoParaNino']);
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

    echo json_encode(['ninosDelGrupoDisponible' => $ninosDelGrupoDisponible]);
    exit();
}


//===============================================================================================================================================================================================================
//                                                    MODIFICAR LOS DATOS DEL NIÑO EN LALISTA DE GRUPO
//===============================================================================================================================================================================================================

if (isset($data['idNinoSeleccionadoParaModificar'])) {
    //QUERY PARA ACTUALIZAR EL GRUPO
    $queryInfoninoParaModificar = $conn->prepare("SELECT 
    N.*, 
    GN.id_grupo
FROM 
    NINOS N
JOIN 
    GRUPO_NINOS GN ON N.id_nino = GN.id_nino
WHERE 
    N.id_nino = ?;");
    $queryInfoninoParaModificar->bind_param("i", $data['idNinoSeleccionadoParaModificar'],);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryInfoninoParaModificar->execute();   //ejecutar en bbdd
    $result = $queryInfoninoParaModificar->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $infoninoParaModificar = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryInfoninoParaModificar->close();

    $idPlanBBDD = 0; 
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
    echo json_encode(['infoninoParaModificar' => $infoninoParaModificar, 'idPlanBBDD' => $idPlanBBDD, 'infoPlanFechaninoExistente' => $infoPlanFechaninoExistente, 'infoGruposninoExistente' => $infoGruposninoExistente]);
    exit();
}
//===============================================================================================================================================================================================================
//                                                    FIN MODIFICAR LOS DATOS DEL NIÑO EN LALISTA DE GRUPO
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                     MODIFICAR DE FURZA BRUTA UN GRUPO
//===============================================================================================================================================================================================================

//actualizar nino 
if (isset($data['idNinoSeleccionaa2']) && isset($data['pagado2']) && isset($data['id_plan2']) && isset($data['id_grupo2'])) {
// Comprobar si el id_nino existe en PLAN_NINOS
$queryComprobarExistencia = $conn->prepare("
    SELECT * 
    FROM PLAN_NINOS 
    WHERE id_nino = ?
");
$queryComprobarExistencia->bind_param("i", $data['idNinoSeleccionaa2']);
$queryComprobarExistencia->execute();
$result = $queryComprobarExistencia->get_result();

if ($result->num_rows > 0) {
    // Si el niño ya tiene un plan, actualizar el id_plan
    $queryActualizarPlanNino = $conn->prepare("
        UPDATE PLAN_NINOS 
        SET id_plan = ? 
        WHERE id_nino = ?;
    ");
    $queryActualizarPlanNino->bind_param("ii", $data['id_plan2'], $data['idNinoSeleccionaa2']);
    
    if ($queryActualizarPlanNino->execute()) {
        if ($queryActualizarPlanNino->affected_rows >= 0) {
            $queryActualizarPlanNino->close();
            
            // Actualizar el estado de pago
            $queryActualizarPagado = $conn->prepare("
                UPDATE NINOS 
                SET pagado = ? 
                WHERE id_nino = ?;
            ");
            $queryActualizarPagado->bind_param("ii", $data['pagado2'], $data['idNinoSeleccionaa2']);
            
            if ($queryActualizarPagado->execute()) {
                if ($queryActualizarPagado->affected_rows >= 0) {
                    $queryActualizarPagado->close();

                    // Actualizar el grupo del niño
                    $queryActualizarNinoGrupo = $conn->prepare("
                        UPDATE GRUPO_NINOS 
                        SET id_grupo = ? 
                        WHERE id_nino = ?;
                    ");
                    $queryActualizarNinoGrupo->bind_param("ii", $data['id_grupo2'], $data['idNinoSeleccionaa2']);
                    
                    if ($queryActualizarNinoGrupo->execute()) {
                        if ($queryActualizarNinoGrupo->affected_rows >= 0) {
                            echo json_encode(['modificarNino' => 'ok']);
                            $queryActualizarNinoGrupo->close();
                            exit();
                        } else {
                            echo json_encode(['modificarNino' => 'noOk']);
                            $queryActualizarNinoGrupo->close();
                            exit();
                        }
                    } else {
                        echo json_encode(['error' => 'Error al modificar los datos del grupo']);
                        $queryActualizarNinoGrupo->close();
                        exit();
                    }
                } else {
                    echo json_encode(['modificarNino' => 'noOk']);
                    $queryActualizarPagado->close();
                    exit();
                }
            } else {
                echo json_encode(['error' => 'Error al modificar el estado de pago']);
                $queryActualizarPagado->close();
                exit();
            }
        } else {
            echo json_encode(['modificarNino' => 'noOk']);
            $queryActualizarPlanNino->close();
            exit();
        }
    } else {
        echo json_encode(['error' => 'Error al modificar el plan del niño']);
        $queryActualizarPlanNino->close();
        exit();
    }
} else {
    // Si el niño no existe en PLAN_NINOS, insertamos un nuevo registro
    $queryInsertarPlanNino = $conn->prepare("
        INSERT INTO PLAN_NINOS (id_plan, id_nino) 
        VALUES (?, ?)
    ");
    $queryInsertarPlanNino->bind_param("ii", $data['id_plan2'], $data['idNinoSeleccionaa2']);
    
    if ($queryInsertarPlanNino->execute()) {
        // Ahora que hemos insertado el plan, actualizamos el estado de pago
        $queryActualizarPagado = $conn->prepare("
            UPDATE NINOS 
            SET pagado = ? 
            WHERE id_nino = ?;
        ");
        $queryActualizarPagado->bind_param("ii", $data['pagado2'], $data['idNinoSeleccionaa2']);
        
        if ($queryActualizarPagado->execute()) {
            // Actualizamos el grupo del niño
            $queryActualizarNinoGrupo = $conn->prepare("
                UPDATE GRUPO_NINOS 
                SET id_grupo = ? 
                WHERE id_nino = ?;
            ");
            $queryActualizarNinoGrupo->bind_param("ii", $data['id_grupo2'], $data['idNinoSeleccionaa2']);
            
            if ($queryActualizarNinoGrupo->execute()) {
                echo json_encode(['modificarNino' => 'ok']);
                $queryActualizarNinoGrupo->close();
                exit();
            } else {
                echo json_encode(['error' => 'Error al modificar los datos del grupo']);
                $queryActualizarNinoGrupo->close();
                exit();
            }
        } else {
            echo json_encode(['error' => 'Error al modificar el estado de pago']);
            $queryActualizarPagado->close();
            exit();
        }
    } else {
        echo json_encode(['error' => 'Error al insertar el plan del niño']);
        $queryInsertarPlanNino->close();
        exit();
    }
}
$queryComprobarExistencia->close();


}

//===============================================================================================================================================================================================================
//                                                     FIN BORRAR DE FURZA BRUTA UN GRUPO
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                      DESASIGNAR UN GRUPO DE UN NINO
//===============================================================================================================================================================================================================

//ELIMINAR EL NINO EN LA LISTA
if (isset($data['idNinoSeleccionaParaEliminar'])) {
        $queryEliminarNino = $conn->prepare("DELETE FROM grupo_ninos WHERE id_nino = ?");
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
//===============================================================================================================================================================================================================
//                                                      FIN DESASIGNAR UN GRUPO DE UN NINO
//===============================================================================================================================================================================================================



//===============================================================================================================================================================================================================
//                                                      CONSULTA PARA SACAR MONITORES DISPONIBLES
//===============================================================================================================================================================================================================
//query para sacar 
if (isset($data['consultarMonitorDisponible'])) {
    //SACAR TODO LOS MONITORES QUE EXISTE 
    $queryMonitores = $conn->prepare("SELECT * FROM monitores");
    $queryMonitores->execute();   //ejecutar en bbdd
    $result = $queryMonitores->get_result();  //recoge el resultado de la consulta 
    // Comprobamos si hay resultados
    $monitoresDisponible = [];  // Creamos un array vacío para almacenar la información de los hijos
    while ($row = $result->fetch_assoc()) {
        // Añadimos cada hijo al array
        $monitoresDisponible[] = $row;
    }
    //cerramos el conexion 
    $queryMonitores->close();
    //enviamos el solucion
    echo json_encode(['monitoresDisponible' => $monitoresDisponible]);
    exit();
}
//===============================================================================================================================================================================================================
//                                                      FIN DE CONSULTA PARA SACAR MONITORES DISPONIBLES
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                      SACAR TODO LOS NINOS QUE NO ESTA ASIGNADO A UM GRIUPO 
//===============================================================================================================================================================================================================
if (isset($data['seleccionarNinoParaAgregar'])) {
    //SACAR TODO LOS NINOS QUE NOS TIENE GRUPOS
    $queryNinoParaAgregar = $conn->prepare("SELECT N.*
                                                    FROM NINOS N
                                                    LEFT JOIN GRUPO_NINOS GN ON N.id_nino = GN.id_nino
                                                    WHERE GN.id_nino IS NULL;
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
    echo json_encode(['ninosSinGrupo' => $ninosSinGrupo]);
    exit();
}
//===============================================================================================================================================================================================================
//                                                      SACAR TODO LOS NINOS QUE NO ESTA ASIGNADO A UM GRIUPO 
//===============================================================================================================================================================================================================

//===============================================================================================================================================================================================================
//                                                     AGREGAR UN NINO AL GRUPIO
//===============================================================================================================================================================================================================

//AGREGAR UN NINO AL GRUPO
if (isset($data['idSeleccionadoNinoParaAgregarAlGrupo']) && isset($data['idGrupoSeleccionadoParaNinoGlobalAlGrupo']) && isset($data['estadoPagado'])) {
    $queryActualizarPago= $conn->prepare("UPDATE ninos SET pagado = ? WHERE id_nino = ?");
    $queryActualizarPago->bind_param("ii", $data['estadoPagado'], $data['idSeleccionadoNinoParaAgregarAlGrupo']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryActualizarPago->execute();


        $queryAgregarNinoAlGrupo = $conn->prepare("INSERT INTO grupo_ninos (id_grupo, id_nino) VALUES (?, ?);");
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
//===============================================================================================================================================================================================================
//                                                     FIN DE AGREGAR UN NINO AL GRUPIO
//===============================================================================================================================================================================================================





//=========================================================================================================================
//                       ENVIO DE DATOS
//=========================================================================================================================
//enviar el json a js
echo json_encode([
    'login' => $login,
    'id_admin' => $_SESSION['id'],
    'gruposDisponible' => $gruposDisponible
]);
