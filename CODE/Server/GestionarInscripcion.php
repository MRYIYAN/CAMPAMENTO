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

$login = "no";
//comprobar si ha logueado o no 
if (!isset($_SESSION["login"])){
    echo json_encode(['noLogin' => '../html/noLogeado.html']);
    exit();
}else{
    $login= "ok";
}

//comprobamos si recoge el id
if (!isset($_SESSION['id'])) {
    //en caso si no se recoge bien el id
    echo json_encode(['error' => 'No se encontró la sesión del usuario.']);
    exit(); //salir de ejecucion en caso si ho tiene aignado el id
}
// Obtener el contenido JSON de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);


// Obtener el contenido JSON de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);

// Preparar la consulta para evitar inyección SQL
//SACAR TODOS INFORMACION DEL PADRE
$queryInfoPadre = $conn->prepare("SELECT nombre, dni, telefono, email FROM TUTORES WHERE id_tutor = ?");
$queryInfoPadre->bind_param("i", $_SESSION['id']);    //asignamos el valor de ?, es un i porque es un numero(integer)
$queryInfoPadre->execute();   //ejecutar en bbdd
$result = $queryInfoPadre->get_result();  //recoge el resultado de la consulta 
// Comprobamos la respuesta de la consulta
if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
    $infoPadre = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
}
//cerramos e query
$queryInfoPadre->close();

//SACAMOS TODO LOS PLANES QUE HAY PARA QUE EL PADRE PUEDA SELECCIONAR SIEMPLE LOS PLANES QUE NO HA PASADO EL LIMITE DEL DIA DE INSCRIPCION
$queryInfoPlan = $conn->prepare(" SELECT * FROM PLAN_FECHAS 
                                    WHERE (fecha_maxInscripcion > CURDATE()) 
                                    OR (fecha_maxInscripcion = CURDATE() AND hora_maximaInscripcion >= CURTIME())
                                "); //seleccionar los que tiene fecha de fecha_maxInscripcion mayor que hoy o fecha_maxInscripcion igual q hoy pero la hora tiene que ser mayor o igual la de 
$queryInfoPlan->execute();   //ejecutar en bbdd
$result = $queryInfoPlan->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$infoPlan = [];  // Creamos un array vacío para almacenar la información de los planes
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $infoPlan[] = $row;
}


//INSERTS DE DATOS PARA NIÑO (CREAR NIÑO)
if (isset($data['nombre_nino']) && isset($data['nacimiento_nino']) && isset($data['id_plan']) && isset($data['alergia']) && isset($data['observaciones'])) {
    //RUPA DE AVATAR DEFAULT 
    $avatar_default_src="../assets/img/avatar.png"; //cuando creamos el niño hay que asignar un avatar default sino sale blanco
    $queryInsertNiño = $conn->prepare("INSERT INTO ninos (nombre, fecha_nacimiento, id_plan, alergias, observaciones, id_tutor, avatar_src) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $queryInsertNiño->bind_param("sssssis", $data['nombre_nino'], $data['nacimiento_nino'], $data['id_plan'], $data['alergia'], $data['observaciones'], $_SESSION['id'], $avatar_default_src);
    if ($queryInsertNiño->execute()) { //comprobamos la ejecucion
        if ($queryInsertNiño->affected_rows > 0) { // Si se inserta al menos un registro
            echo json_encode(['registrado' => '../html/inscripcionNinoExitosa.html']);
            $queryInsertNiño->close();   
            exit();
        } else {
            echo json_encode(['noRegistrado' => '../html/inscripcionNinoFallada.html']);
            $queryInsertNiño->close();   
            exit();

        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar inserts de niño']);
        $queryInsertNiño->close();   
        exit();
    }
    
    
}


////SACAMOS TODO LOS INFORMACIONES DEL PLAN SELECCIONADO POR EL PADRE
if (isset($data['id_planPatabuscarEnBBDD'])) { // Verificar que el ID está definido
    $queryInfoDataPlan = $conn->prepare("SELECT * FROM PLAN_FECHAS WHERE id_plan = ?");
    $queryInfoDataPlan->bind_param("i", $data['id_planPatabuscarEnBBDD']);

    if ($queryInfoDataPlan->execute()) {
        $result = $queryInfoDataPlan->get_result(); // Obtener resultados
        if ($result->num_rows > 0) {
            echo json_encode(['infoPlan' => $result->fetch_assoc()]);
            exit();
        } else {
            echo json_encode(['error' => 'No se encontró el plan.']);
            exit();
        }
    } else {
        echo json_encode(['error' => 'Error al ejecutar la consulta.']);

    }
    $queryInfoDataPlan->close();
    exit();
}






//este echo hay que estar abajo del todo SINO SE PETA
echo json_encode([
    'login' => $login,
    'id_Padre' => $_SESSION['id'],
    'infoPadre' => $infoPadre,
    'infoPlan' => $infoPlan

]);


