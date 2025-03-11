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



//SACAR TODO LOS GRUPOS QUE HAY EN BBDD
$queryGrupos = $conn->prepare("SELECT * FROM GRUPOS");
$queryGrupos->execute();   //ejecutar en bbdd
$result = $queryGrupos->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$grupos = [];  // Creamos un array vacío para almacenar la información de los hijos
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $grupos[] = $row;
}
$queryGrupos -> close();

//SACAR TODO LOS PLAN DE FECHA QUE HAY EN BBDD
$queryPlanFecha = $conn->prepare("SELECT * FROM plan_fechas");
$queryPlanFecha->execute();   //ejecutar en bbdd
$result = $queryPlanFecha->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$planFecha = [];  // Creamos un array vacío para almacenar la información de los hijos
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $planFecha[] = $row;
}
$queryPlanFecha -> close();
//=========================================================================================================================
//                       FIN DE COMPROBAR LOGIN Y EXTRAER EL ID 
//=========================================================================================================================

// Obtener el contenido JSON de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

//=========================================================================================================================
//                                                     CONSULTAS 
//=========================================================================================================================

//---------------------------------------------------------------//
//SACAR TODO NINO QUE EXISTE
//---------------------------------------------------------------//
$queryNinosDisponibles = $conn->prepare("SELECT 
    NINOS.id_nino,
    NINOS.nombre AS nombre_nino,
    NINOS.alergias,
    NINOS.observaciones,
    NINOS.fecha_nacimiento,
    NINOS.pagado,
    NINOS.avatar_src AS avatar_nino,
    GRUPOS.id_grupo,
    GRUPOS.nombre AS nombre_grupo,
    GRUPOS.id_monitor,
    MONITORES.nombre AS nombre_monitor,
    MONITORES.email AS email_monitor,
    PLAN_FECHAS.id_plan,
    PLAN_FECHAS.nombre AS nombre_plan,
    PLAN_FECHAS.fecha_inicio,
    PLAN_FECHAS.fecha_fin,
    PLAN_FECHAS.fecha_maxInscripcion,
    PLAN_FECHAS.hora_maximaInscripcion,
    PLAN_FECHAS.precio,
    PLAN_FECHAS.definicion
FROM 
    NINOS
LEFT JOIN 
    GRUPO_NINOS ON NINOS.id_nino = GRUPO_NINOS.id_nino
LEFT JOIN 
    GRUPOS ON GRUPO_NINOS.id_grupo = GRUPOS.id_grupo
LEFT JOIN 
    MONITORES ON GRUPOS.id_monitor = MONITORES.id_monitor
LEFT JOIN 
    PLAN_NINOS ON NINOS.id_nino = PLAN_NINOS.id_nino
LEFT JOIN 
    PLAN_FECHAS ON PLAN_NINOS.id_plan = PLAN_FECHAS.id_plan;
");
$queryNinosDisponibles->execute();   //ejecutar en bbdd
$result = $queryNinosDisponibles->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$ninosDisponible = [];  // Creamos un array vacío para almacenar la información de los hijos
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $ninosDisponible[] = $row;
}
//cerramos el conexion 
$queryNinosDisponibles->close();
//---------------------------------------------------------------//

if (isset($data['idNinoSeleccionaParaEliminar'])){
    
    //eliminamos la relacion que tiene con el gruponino
    $queryEliminarGrupoNino = $conn->prepare("DELETE FROM grupo_ninos WHERE id_nino = ?");
    $queryEliminarGrupoNino->bind_param("i", $data['idNinoSeleccionaParaEliminar']);
    $queryEliminarGrupoNino->execute();   //ejecutar en bbdd

    //eliminamos la relacion que tiene con el plan_nino
    $queryEliminarPlanNino = $conn->prepare("DELETE FROM plan_ninos WHERE id_nino = ?");
    $queryEliminarPlanNino->bind_param("i", $data['idNinoSeleccionaParaEliminar']);
    $queryEliminarPlanNino->execute();   //ejecutar en bbdd

    //eliminamos el nino
    $queryEliminarPlanNino = $conn->prepare("DELETE FROM ninos WHERE id_nino = ?");
    $queryEliminarPlanNino->bind_param("i", $data['idNinoSeleccionaParaEliminar']);
    if ($queryEliminarPlanNino->execute()) { //comprobamos la ejecucion
        //comprobamos si se ha creado o no 
        if ($queryEliminarPlanNino->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            //en caso de si 
            echo json_encode(['eliminadoNino' => 'ok']);
            $queryEliminarPlanNino->close();
            exit();
        } else {
            //en caso de no 
            echo json_encode(['eliminadoNino' => 'noOk']);
            $queryEliminarPlanNino->close();
            exit();
        }
    }
}

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

    $idPlanBBDD= 0;
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
$queryActualizarPlanNino->execute();

if ($queryActualizarPlanNino->affected_rows == 0) {
    // Comprobamos si ya existe el registro en PLAN_NINOS antes de insertar
    $queryComprobarPlanNino = $conn->prepare("
        SELECT * FROM PLAN_NINOS WHERE id_nino = ?
    ");
    $queryComprobarPlanNino->bind_param("i", $data['idNinoSeleccionaa2']);
    $queryComprobarPlanNino->execute();
    $resultPlanNino = $queryComprobarPlanNino->get_result();

    if ($resultPlanNino->num_rows == 0) {
        // Si no existe, insertamos
        $queryInsertarPlanNino = $conn->prepare("
            INSERT INTO PLAN_NINOS (id_nino, id_plan) 
            VALUES (?, ?)
        ");
        $queryInsertarPlanNino->bind_param("ii", $data['idNinoSeleccionaa2'], $data['id_plan2']);

        if (!$queryInsertarPlanNino->execute()) {
            echo json_encode(['modificarNino' => 'noOk']);
            exit();
        }
    }
}

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
// Si el niño no está en el grupo, intentamos actualizarlo en GRUPO_NINOS
$queryActualizarGrupoNino = $conn->prepare("
    UPDATE GRUPO_NINOS 
    SET id_grupo = ? 
    WHERE id_nino = ?
");
$queryActualizarGrupoNino->bind_param("ii", $data['id_grupo2'], $data['idNinoSeleccionaa2']);
$queryActualizarGrupoNino->execute();

if ($queryActualizarGrupoNino->affected_rows == 0) {
    // Si el UPDATE no afectó ninguna fila, insertamos en GRUPO_NINOS
    $queryInsertarGrupoNino = $conn->prepare("
        INSERT INTO GRUPO_NINOS (id_grupo, id_nino) 
        VALUES (?, ?)
    ");
    $queryInsertarGrupoNino->bind_param("ii", $data['id_grupo2'], $data['idNinoSeleccionaa2']);

    if (!$queryInsertarGrupoNino->execute()) {
        echo json_encode(['modificarNino' => 'noOk']);
        exit();
    }
}

// Ahora intentamos actualizar PLAN_NINOS
$queryActualizarPlanNino = $conn->prepare("
    UPDATE PLAN_NINOS 
    SET id_plan = ? 
    WHERE id_nino = ?
");
$queryActualizarPlanNino->bind_param("ii", $data['id_plan2'], $data['idNinoSeleccionaa2']);
$queryActualizarPlanNino->execute();

if ($queryActualizarPlanNino->affected_rows == 0) {
    // Comprobamos si ya existe el registro en PLAN_NINOS antes de insertar
    $queryComprobarPlanNino = $conn->prepare("
        SELECT * FROM PLAN_NINOS WHERE id_nino = ?
    ");
    $queryComprobarPlanNino->bind_param("i", $data['idNinoSeleccionaa2']);
    $queryComprobarPlanNino->execute();
    $resultPlanNino = $queryComprobarPlanNino->get_result();

    if ($resultPlanNino->num_rows == 0) {
        // Si no existe, insertamos
        $queryInsertarPlanNino = $conn->prepare("
            INSERT INTO PLAN_NINOS (id_nino, id_plan) 
            VALUES (?, ?)
        ");
        $queryInsertarPlanNino->bind_param("ii", $data['idNinoSeleccionaa2'], $data['id_plan2']);

        if (!$queryInsertarPlanNino->execute()) {
            echo json_encode(['modificarNino' => 'noOk']);
            exit();
        }
    }
}

// Finalmente, actualizamos el estado de pago
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
}

$queryComprobarGrupo->close();


}
//---------------------------------------------------------------//


//==========================================================================================================================================================//
//CONSULTA PARA SACER DATOS DE LA TABLA
//==========================================================================================================================================================//

//COMPROBAMOS SI HAN ASIGNADO LOS VALORES PAR LA CONSULTA DE TABLA
if (isset($data['id_grupoParaActividades']) &&isset($data['id_planParaActividades'])){
    //SACAR TODO LOS ACTIVIDADES QUE HAY EN BBDD DEOPENDIENDO DEL GRUPO Y PLAN 
    $queryActividadesTabla = $conn->prepare("SELECT * FROM actividades WHERE id_grupo = ? AND id_plan = ?");
    $queryActividadesTabla->bind_param("ii", $data['id_grupoParaActividades'], $data['id_planParaActividades']); 
    $queryActividadesTabla->execute();   //ejecutar en bbdd
    $result = $queryActividadesTabla->get_result();  //recoge el resultado de la consulta 
    // Comprobamos si hay resultados
    $infoActividadNinoSeleccionado = [];  // Creamos un array vacío para almacenar la información de los hijos
    while ($row = $result->fetch_assoc()) {
        // Añadimos cada hijo al array
        $infoActividadNinoSeleccionado[] = $row;
    }
    //cerramos el conexion 
    $queryActividadesTabla -> close();
    //enviamos el solucion
    echo json_encode(['infoActividadNinoSeleccionado' => $infoActividadNinoSeleccionado]);
    exit();
    
}



//==========================================================================================================================================================//
//CONSULTA PARA PODER OPERAR INFORMACION DEL ACTIVIDAD
//==========================================================================================================================================================//
if (isset($data['id_actividad'])){
    //SACAR TODOS INFORMACION DEL ACTIVIDAD DEPENDIENTO DEL ID_ACTIVIDAD
    $queryInfoActiviad = $conn->prepare("SELECT * FROM actividades WHERE id_actividad = ?");
    $queryInfoActiviad->bind_param("i", $data['id_actividad']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryInfoActiviad->execute();   //ejecutar en bbdd
    $result = $queryInfoActiviad->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $infoActiviad = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryInfoActiviad->close();



    //SACAR EL FECHA DE INICIO Y FIN DE UN ACTIVIDAD EN UN PLAN 
    $queryFechaActiviad = $conn->prepare("SELECT 
                                                P.fecha_inicio,
                                                P.fecha_fin
                                            FROM ACTIVIDADES A
                                            JOIN PLAN_FECHAS P ON A.id_plan = P.id_plan
                                            WHERE A.id_actividad = ?;");
    $queryFechaActiviad->bind_param("i", $data['id_actividad']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryFechaActiviad->execute();   //ejecutar en bbdd
    $result = $queryFechaActiviad->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $fechaActiviad = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryFechaActiviad->close();
    //enviamos el solucion
    echo json_encode(['infoActividad' => $infoActiviad, 'fechaActiviad' => $fechaActiviad]);
    exit();
}


//===============================================================================================================================================================================================================
//                                                      INSERT DE ACTIVIDAD EN BBDD
//===============================================================================================================================================================================================================
if (isset($_POST['titulo']) && isset($_POST['hora_inicio']) && isset($_POST['hora_fin']) && isset($_POST['descripcion']) && isset($_POST['fecha'])&& isset($_POST['planSeleccionado']) && isset($_POST['grupoSeleccionado'])){
    //ASIGNACION DE NUEVO FOTO DE FONDE EN ACTIVIDADES 
        //definimos donde queremos que se guarde el archivo
        $directorio_subida_avatar = "../assets/actividad/uploads/";
        //comprobar si hemos asignado el avatar y si hay algun error
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0 && $_POST['cambiarfoto'] == true){    //aqui comprobamos si hay que cambiar el avatar

        $name_avatar = $_FILES['foto']['name'];  //sacamos el nombre del archivo
        //sacamos los informaciones del archivo segun su nombre
        $array_avatar = pathinfo($name_avatar);

        //sacamos la ruta antigua del avatar
        $ruta_antiguo_avatar = $_FILES['foto']['tmp_name'];

        //sacamos la ruta que tiene que estrar en uploads
        $ruta_destino_avatar = $directorio_subida_avatar . $name_avatar;

        //movemos
        move_uploaded_file($ruta_antiguo_avatar, $ruta_destino_avatar);
        $rutaAvatar = $ruta_destino_avatar;
    }else{
        //en caso de no cambiar el avatar se usa la ruta que ya esta en bbdd
        $rutaAvatar = $_POST['fodoActividad'];
    }

    $queryAniadirActividad = $conn->prepare("INSERT INTO actividades (titulo, descripcion, hora, hora_fin, dia, id_grupo, id_plan, imagen_src) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $queryAniadirActividad->bind_param("sssssiis",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $_POST['grupoSeleccionado'], $_POST['planSeleccionado'],  $rutaAvatar);
    if ($queryAniadirActividad->execute()) { //comprobamos la ejecucion
        
        if ($queryAniadirActividad->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['insertado' => 'ok']);
            $queryAniadirActividad->close();   
            exit();
        } else {
            echo json_encode(['insertado' => 'noOk']);
            $queryAniadirActividad->close();   
            exit();

        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar Modificar de padre']);
        $queryAniadirActividad->close();   
        exit();
    }
}


//===============================================================================================================================================================================================================
//                                                      FIN DE INSERT DE ACTIVIDAD EN BBDD
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                      BSACAR FECHA INICIO Y FECHA FIN DEL PLAN PARA INSERT
//===============================================================================================================================================================================================================
if (isset($data['planSeleccionadoParaInsert'])){
    $queryFechaPlanInserts = $conn->prepare("SELECT fecha_inicio, fecha_fin FROM plan_fechas WHERE id_plan = ?");
    $queryFechaPlanInserts->bind_param("i", $data['planSeleccionadoParaInsert'] );
    $queryFechaPlanInserts->execute();   //ejecutar en bbdd
    $result = $queryFechaPlanInserts->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $fechaPlanInserts = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryFechaPlanInserts->close();
    //enviamos el solucion
    echo json_encode(['fechaPlanInserts' => $fechaPlanInserts]);
    exit();
}

//===============================================================================================================================================================================================================
//                                                      FIN BSACAR FECHA INICIO Y FECHA FIN DEL PLAN PARA INSERT
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                      CONSULTA PARA SACAR MONITORES DISPONIBLES
//===============================================================================================================================================================================================================
//query para sacar 
if (isset($data['consultarMonitorDisponible'])){
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
    $queryMonitores -> close();
    //enviamos el solucion
    echo json_encode(['monitoresDisponible' => $monitoresDisponible]);
    exit();

}
//===============================================================================================================================================================================================================
//                                                      FIN DE CONSULTA PARA SACAR MONITORES DISPONIBLES
//===============================================================================================================================================================================================================


if (isset($_POST['id_actividadSeleccionado']) && isset($_POST['titulo']) && isset($_POST['hora_inicio']) && isset($_POST['hora_fin']) && isset($_POST['descripcion']) && isset($_POST['fecha'])){

    //ASIGNACION DE NUEVO FOTO DE FONDE EN ACTIVIDADES 
        //definimos donde queremos que se guarde el archivo
        $directorio_subida_avatar = "../assets/actividad/uploads/";
        //comprobar si hemos asignado el avatar y si hay algun error
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0 && $_POST['cambiarfoto'] == true){    //aqui comprobamos si hay que cambiar el avatar

        $name_avatar = $_FILES['foto']['name'];  //sacamos el nombre del archivo
        //sacamos los informaciones del archivo segun su nombre
        $array_avatar = pathinfo($name_avatar);

        //sacamos la ruta antigua del avatar
        $ruta_antiguo_avatar = $_FILES['foto']['tmp_name'];

        //sacamos la ruta que tiene que estrar en uploads
        $ruta_destino_avatar = $directorio_subida_avatar . $name_avatar;

        //movemos
        move_uploaded_file($ruta_antiguo_avatar, $ruta_destino_avatar);
        $rutaAvatar = $ruta_destino_avatar;
    }else{
        //en caso de no cambiar el avatar se usa la ruta que ya esta en bbdd
        $rutaAvatar = $_POST['fodoActividad'];
    }

    //creamos los querys y dependemos en que situacion lo usamos cada uno 
    if ($_POST['cambiarGrupo'] !== "si" && $_POST['cambiarPlan'] !== "si"){
        $queryModificacionActividad = $conn->prepare("UPDATE actividades SET titulo = ?, descripcion = ?, hora = ?, hora_fin = ?,  dia = ? , imagen_src = ? WHERE id_actividad = ?");
        $queryModificacionActividad->bind_param("ssssssi",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $rutaAvatar, $_POST['id_actividadSeleccionado'] );
    }else if ($_POST['cambiarGrupo'] == "si" && $_POST['cambiarPlan'] !== "si"){
        $queryModificacionActividad = $conn->prepare("UPDATE actividades SET titulo = ?, descripcion = ?, hora = ?, hora_fin = ?,  dia = ? , imagen_src = ?, id_grupo = ? WHERE id_actividad = ?");
        $queryModificacionActividad->bind_param("ssssssii",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $rutaAvatar, $_POST['grupoSeleccionadoOperar'],  $_POST['id_actividadSeleccionado'] );
    }
    else if ($_POST['cambiarGrupo'] !== "si" && $_POST['cambiarPlan'] == "si"){
        $queryModificacionActividad = $conn->prepare("UPDATE actividades SET titulo = ?, descripcion = ?, hora = ?, hora_fin = ?,  dia = ? , imagen_src = ?, id_plan = ? WHERE id_actividad = ?");
        $queryModificacionActividad->bind_param("ssssssii",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $rutaAvatar, $_POST['planSeleccionadoOperar'],  $_POST['id_actividadSeleccionado'] );
    }
    else if ($_POST['cambiarGrupo'] == "si" && $_POST['cambiarPlan'] == "si"){
        $queryModificacionActividad = $conn->prepare("UPDATE actividades SET titulo = ?, descripcion = ?, hora = ?, hora_fin = ?,  dia = ? , imagen_src = ?, id_plan = ?, id_grupo = ? WHERE id_actividad = ?");
        $queryModificacionActividad->bind_param("ssssssiii",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $rutaAvatar, $_POST['planSeleccionadoOperar'], $_POST['grupoSeleccionadoOperar'],  $_POST['id_actividadSeleccionado'] );
    }

    if ($queryModificacionActividad->execute()) { //comprobamos la ejecucion
        
        if ($queryModificacionActividad->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['modificado' => 'ok']);
            $queryModificacionActividad->close();   
            exit();
        } else {
            echo json_encode(['modificado' => 'noOk']);
            $queryModificacionActividad->close();   
            exit();

        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar Modificar de padre']);
        $queryModificacionActividad->close();   
        exit();
    }




}
//===============================================================================================================================================================================================================
//                                                      FIN DE ACTUALIZAR TABLA
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                      BORRAR UN ACTIVIDAD
//===============================================================================================================================================================================================================
if (isset($data['id_actividadSeleccionadaParaBorrar'])){
    $queryBorrarActividad = $conn->prepare("DELETE FROM actividades WHERE id_actividad = ?");
    $queryBorrarActividad->bind_param("i", $data['id_actividadSeleccionadaParaBorrar'] );
    if ($queryBorrarActividad->execute()) { //comprobamos la ejecucion
        
        if ($queryBorrarActividad->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['borrado' => 'ok']);
            $queryBorrarActividad->close();   
            exit();
        } else {
            echo json_encode(['borrado' => 'noOk']);
            $queryBorrarActividad->close();   
            exit();

        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar Modificar de padre']);
        $queryBorrarActividad->close();   
        exit();
    }
}
//===============================================================================================================================================================================================================
//                                                      fin BORRAR UN ACTIVIDAD
//===============================================================================================================================================================================================================





//=========================================================================================================================
//                       ENVIO DE DATOS
//=========================================================================================================================
//enviar el json a js
echo json_encode([
    'login' => $login,
    'id_admin' => $_SESSION['id'],
    'ninosDisponible' => $ninosDisponible,
    'grupos' => $grupos,
    'planFecha' => $planFecha
]);
