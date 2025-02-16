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
if (!isset($_SESSION['idNino'])) {
    //en caso si no se recoge bien el id
    echo json_encode(['error' => 'No se encontró la sesión del usuario.']);
    exit();
}
// Obtener el contenido JSON de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);



 //CONSULTA PARA SACAR TODO LOS DATOS DEL NIÑO
 $queryInfoNino = $conn->prepare("SELECT * FROM ninos WHERE id_nino = ?");   //sacamos todo los informaciones del actividad, dependiendo del monitor y el plan, por que no va a ser el mismo actividades en los diferentes plan 
 $queryInfoNino->bind_param("i", $_SESSION['idNino'] );    //asignamos el valor de ?, es un i porque es un numero(integer)
 $queryInfoNino->execute();   //ejecutar en bbdd
 $result = $queryInfoNino->get_result();  //recoge el resultado de la consulta 
 // Comprobamos la respuesta de la consulta
 if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
    $infoNino = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
} else {
    // echo json_encode(['error' => "No se encontraron datos para esta Hijo con el ID " . $id_nino]);
    // exit();
}
 //cerramos e query
 $queryInfoNino->close();





//INSERTS DE DATOS PARA NIÑO (MODIFICAR NIÑO)
if (isset($_POST['nombre_nino']) && isset($_POST['nacimiento_nino']) && isset($_POST['alergia']) && isset($_POST['observaciones'])) {
    if (empty($_POST['nombre_nino']) || empty($_POST['nacimiento_nino']) || empty($_POST['alergia']) || empty($_POST['observaciones'])) {
        echo json_encode(['error' => 'Faltan datos necesarios']);
        exit();
    }

    //ASIGNACION DE NUEVO AVATAR EN BBDD
    //----------------------------------------------------------------------------------------------------------------------------------//
    //definimos donde queremos que se guarde el archivo
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
    //----------------------------------------------------------------------------------------------------------------------------------//
    
    
    //UPDATES DE INFORMACION
    $queryModificacionNiño = $conn->prepare("UPDATE ninos SET nombre = ?, fecha_nacimiento = ?, alergias = ?, observaciones = ? , avatar_src = ? WHERE id_nino = ?");
    $queryModificacionNiño->bind_param("sssssi", $_POST['nombre_nino'], $_POST['nacimiento_nino'], $_POST['alergia'], $_POST['observaciones'], $rutaAvatar, $_SESSION['idNino']);
    if ($queryModificacionNiño->execute()) { //comprobamos la ejecucion
        
        if ($queryModificacionNiño->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['registrado' => '../html/modificacionNinoExitosa.html']);
            $queryModificacionNiño->close();   
            exit();
        } else {
            echo json_encode(['noRegistrado' => '../html/modificacionNinoFallada.html']);
            $queryModificacionNiño->close();   
            exit();

        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar Modificar de niño']);
        $queryModificacionNiño->close();   
        exit();
    }
    
    
}


echo json_encode([
    'login' => $login,
    'id_nino' => $_SESSION['idNino'],
    'infoNino' => $infoNino

]);