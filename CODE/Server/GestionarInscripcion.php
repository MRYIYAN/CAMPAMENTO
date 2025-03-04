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
if (isset($_POST['nombre_nino']) && isset($_POST['nacimiento_nino']) && isset($_POST['id_plan']) && isset($_POST['alergia']) && isset($_POST['observaciones'])) {


    $directorio_subida_avatar = "../assets/avatar/uploads/";
    $rutaAvatar = "../assets/img/avatar.png";   //esta ruta se actualizara si el usuario ha introducido un avatar, y si el usuario no introduce avatar va a usar esta como default, este paso es para evitar insectar un null en avatar_src
    //comprobar si hemos asignado el avatar y si hay algun error
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] == 0 && $_POST['cambiarAvatar'] == true){    //aqui comprobamos si hay que cambiar el avatar

        $name_avatar = $_FILES['avatar']['name'];  //sacamos el nombre del archivo
        //sacamos los informaciones del archivo segun su nombre
        $array_avatar = pathinfo($name_avatar);

        //sacamos la ruta antigua del avatar
        $ruta_antiguo_avatar = $_FILES['avatar']['tmp_name'];

        //sacamos la ruta que tiene que estrar en uploads
        $ruta_destino_avatar = $directorio_subida_avatar . $name_avatar;

        //movemos
        move_uploaded_file($ruta_antiguo_avatar, $ruta_destino_avatar);
        $rutaAvatar = $ruta_destino_avatar;
    }else{
        //en caso de no cambiar el avatar se usa la ruta que ya esta en bbdd
        $rutaAvatar = $_POST['avatarBBDD'];
    }


    //RUPA DE AVATAR DEFAULT 
    $queryInsertNiño = $conn->prepare("INSERT INTO ninos (nombre, fecha_nacimiento, alergias, observaciones, id_tutor, avatar_src) VALUES (?, ?, ?, ?, ?, ?)");
    $queryInsertNiño->bind_param("ssssis", $_POST['nombre_nino'], $_POST['nacimiento_nino'], $_POST['alergia'], $_POST['observaciones'], $_SESSION['id'], $rutaAvatar);
    if ($queryInsertNiño->execute()) { //comprobamos la ejecucion
        if ($queryInsertNiño->affected_rows > 0) { // Si se inserta al menos un registro
            $id_ninoAutomatico = $conn->insert_id; // OBTENEMOS EL ID DEL NIÑO INSERTADO
            $queryInsertNiñoPlan = $conn->prepare("INSERT INTO plan_ninos (id_plan, id_nino) VALUES (?, ?)");
            $queryInsertNiñoPlan->bind_param("ii", $_POST['id_plan'], $id_ninoAutomatico);
            if ($queryInsertNiñoPlan->execute()) { //comprobamos la ejecucion
                echo json_encode(['registrado' => '../html/inscripcionNinoExitosa.html']);
                $queryInsertNiñoPlan->close();   
                exit();
            } else{
                echo json_encode(['noRegistrado' => '../html/inscripcionNinoFallada.html']);
                $queryInsertNiño->close();   
                exit(); 
            }
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


