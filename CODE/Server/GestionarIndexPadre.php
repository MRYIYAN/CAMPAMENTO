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
//el comprobar login tiene que estar arriba del todo, porque si cae en el condicion, se encia al js y se para todo
$login = "no";
//comprobar si ha logueado o no 
if (!isset($_SESSION["login"])){
    echo json_encode(['noLogin' => '../html/noLogeado.html']);
    exit(); //detenerse
}else{
    $login= "ok";
}


//comprobamos si recoge el id
if (!isset($_SESSION['id'])) {
    //en caso si no se recoge bien el id
    echo json_encode(['error' => 'No se encontró la sesión del usuario.']);
    exit();
}


// Obtener el contenido JSON de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

// Preparar la consulta para evitar inyección SQL
//SACAR TODOS INFORMACION DEL PADRE
$queryInfoPadre = $conn->prepare("SELECT * FROM TUTORES WHERE id_tutor = ?");
$queryInfoPadre->bind_param("i", $_SESSION['id']);    //asignamos el valor de ?, es un i porque es un numero(integer)
$queryInfoPadre->execute();   //ejecutar en bbdd
$result = $queryInfoPadre->get_result();  //recoge el resultado de la consulta 
// Comprobamos la respuesta de la consulta
if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
    $infoPadre = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
}
//cerramos e query
$queryInfoPadre->close();

//-------------------------------------------------------------------------------------------------------------------------
//SACAR TODO LOS HIJOS DE UN PADRE
$queryInfoHijo = $conn->prepare("SELECT * FROM NINOS WHERE id_tutor = ?");
$queryInfoHijo->bind_param("i", $_SESSION['id']);    //asignamos el valor de ?, es un i porque es un numero(integer)
$queryInfoHijo->execute();   //ejecutar en bbdd
$result = $queryInfoHijo->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$infoHijos = [];  // Creamos un array vacío para almacenar la información de los hijos
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $infoHijos[] = $row;
}

//-------------------------------------------------------------------------------------------------------------------------
//SACAR LOS INFOS DE UN HIJO
$datoHijo = [];
$nombreGrupo = [];
$profesorNino = [];
$idProfesorNino = [];
$actividades = [];  // Creamos un array vacío para almacenar los actividades
$datoInfoPlan=[];
if (isset($data['id_nino'])) {
    //SACAR INFORMACION BASICO DEL NIÑO
    //guardamos el id de niño al server
    $_SESSION["idNino"] = $data['id_nino'];
    $id_nino = $data['id_nino'];
    $querydatoHijo = $conn->prepare("SELECT * FROM NINOS WHERE id_nino = ?");
    $querydatoHijo->bind_param("i", $id_nino);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $querydatoHijo->execute();   //ejecutar en bbdd
    $result = $querydatoHijo->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $datoHijo = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    } else {
        // echo json_encode(['error' => "No se encontraron datos para esta Hijo con el ID " . $id_nino]);
        // exit();
    }
    //cerramos e query
    $querydatoHijo->close();

    
    //SACAR EL LAS FECHA DE INICIO Y FIN DEL PLAN QUE ENCUENTRA EL NIÑO
    $queryInfoPlan = $conn->prepare("SELECT * FROM plan_fechas WHERE id_plan = ?");
    $queryInfoPlan->bind_param("i", $datoHijo['id_plan']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryInfoPlan->execute();   //ejecutar en bbdd
    $result = $queryInfoPlan->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $datoInfoPlan = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    } else {
        // echo json_encode(['error' => "No se encontraron datos para esta Hijo con el ID " . $id_nino]);
        // exit();
    }
    //cerramos e query
    $queryInfoPlan->close();

    //SACAR EL NOMBRE DEL GRUPO QUE PERTENECE EL NIÑO
    $querygrupoNino = $conn->prepare("SELECT G.nombre, G.id_grupo
                                                FROM GRUPOS G
                                                JOIN GRUPO_NINOS GN ON G.id_grupo = GN.id_grupo
                                                WHERE GN.id_nino = ?;
                                                "); //Es una consulta doble: primero, obtenemos el id_grupo al que pertenece el niño desde la tabla GRUPO_NINOS. Luego, utilizamos ese id_grupo para consultar la tabla GRUPOS y obtener el nombre del grupo correspondiente
    
    $querygrupoNino->bind_param("i", $id_nino);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $querygrupoNino->execute();   //ejecutar en bbdd
    $result = $querygrupoNino->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $grupoHijo = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
        $nombreGrupo = $grupoHijo['nombre'];
        $id_grupo = $grupoHijo['id_grupo']; //aqui sacamos el id del grupo que pertenece el nino
    } else {
        // echo json_encode(['error' => "No se encontraron datos de nombre del grupo para esta persona con el ID " . $id_nino]);
        // exit();
    }
    //var_dump($datoHijo);  // Puedes dejar esta línea si es necesario para debugging.
    //cerramos e query
    $querygrupoNino->close();

    //SACAR EL NOMBRE Y EL ID DEL MONITOR DEL GRUPO DEL NIÑO QUE PERTENECE
    $queryprofesorgrupoNino = $conn->prepare("SELECT M.nombre AS monitor_nombre, M.id_monitor AS monitor_id
                                                FROM MONITORES M
                                                JOIN GRUPOS G ON M.id_monitor = G.id_monitor
                                                JOIN GRUPO_NINOS GN ON G.id_grupo = GN.id_grupo
                                                WHERE GN.id_nino = ?;
                                                "); //Primero, obtenemos el id_grupo al que pertenece el id_nino desde la tabla GRUPO_NINOS. Luego, usamos ese id_grupo para obtener el id_monitor desde la tabla GRUPOS. Finalmente, con el id_monitor, obtenemos la información del monitor del niño desde la tabla MONITORES
    $queryprofesorgrupoNino->bind_param("i", $id_nino);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryprofesorgrupoNino->execute();   //ejecutar en bbdd
    $result = $queryprofesorgrupoNino->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $profesor = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
        $profesorNino = $profesor['monitor_nombre'];
        $idProfesorNino =  $profesor['monitor_id']; //aqui sacamos el id del monitor corespondiente del niño
    } else {
        // echo json_encode(['error' => "No se encontraron datos para sacar el monitor y el id del monitor para esta persona con el ID " . $id_nino]);
        // exit();
    }
    //cerramos e query
    $queryprofesorgrupoNino->close();


    //HACEMOS LA CONSULTA PARA VER TODO LOS ACTIVIDADES PENDIENTES(HOY O FUTURAS) QUE HAY CON EL MONITOR Y CON EL PLAN QUE PERTENECE EL NIÑO
    $queryActividades = $conn->prepare("SELECT * FROM ACTIVIDADES WHERE id_grupo = ? AND id_plan = ? AND dia >= CURDATE()");   //sacamos todo los informaciones del actividad, dependiendo del monitor y el plan, por que no va a ser el mismo actividades en los diferentes plan 
    $queryActividades->bind_param("ii", $id_grupo, $datoHijo['id_plan']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryActividades->execute();   //ejecutar en bbdd
    $result = $queryActividades->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        // Comprobamos si hay resultados
        while ($row = $result->fetch_assoc()) {
            // Añadimos cada hijo al array
            $actividades[] = $row;
        }
    } else {
        // echo json_encode(['error' => "No se encontraron datos para esta persona con el ID " . $id_nino]);
        // exit();
    }
    //cerramos e query
    $queryActividades->close();
}


// if (isset($data['inscribirse'])) {
//     echo json_encode(["redirect" => "../html/IndexPadre.html"]);
// }



echo json_encode([
    'login' => $login,
    'id_Padre' => $_SESSION['id'],
    'infoPadre' => $infoPadre,
    'infoHijos' => $infoHijos,
    'datoHijo' => $datoHijo,
    'nombreGrupo' => $nombreGrupo,
    'profesorHijo' => $profesorNino,
    'idProfesorHijo' => $idProfesorNino,
    'actividades' => $actividades,
    'datoInfoPlan' => $datoInfoPlan
]);
