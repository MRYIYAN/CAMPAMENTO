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
    exit();
}

// Obtener el contenido JSON de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);






 //CONSULTA PARA SACAR TODO LOS DATOS DEL TUTOR
 $queryInfoTutor = $conn->prepare("SELECT * FROM tutores WHERE id_tutor = ?");   //sacamos todo los informaciones del actividad, dependiendo del monitor y el plan, por que no va a ser el mismo actividades en los diferentes plan 
 $queryInfoTutor->bind_param("i", $_SESSION['id'] );    //asignamos el valor de ?, es un i porque es un numero(integer)
 $queryInfoTutor->execute();   //ejecutar en bbdd
 $result = $queryInfoTutor->get_result();  //recoge el resultado de la consulta 
 // Comprobamos la respuesta de la consulta
 if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
    $infoTutor = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
} else {
    // echo json_encode(['error' => "No se encontraron datos para esta Hijo con el ID " . $id_nino]);
    // exit();
}
 //cerramos e query
 $queryInfoTutor->close();



 //para cifrar contraseña, por que se cifra en php
if (isset($data['contraseniaComprobacion'])){

if (password_verify($data['contraseniaComprobacion'], $infoTutor['contrasenia'])){
    echo json_encode(['contraseñaCorecta' => true]);
    exit();
        }else{
            //en caso si no ha coincididdo la contraseña
            echo json_encode(['contraseñaCorecta' => false]);
            exit();
        }
}





//INSERTS DE DATOS PARA tutor (MODIFICAR TUTOR)
if (isset($_POST['nombre_tutor']) && isset($_POST['dni']) && isset($_POST['telefono'])&& isset($_POST['contraseniaNuevaContenido'])) {



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
    
    //sacamos la contraseña
    $contraseniaNueva = $infoTutor['contrasenia'];
    //comprobamos si la contraseña recibida es 0 o no 
    if ($_POST['contraseniaNuevaContenido'] !== "0"){
        //distinto que 0 
        //eso significa que el usuario ha cambiado la contraseña
        //hasheamos o ciframos el contraseña
        $contraseniaNueva = password_hash($_POST['contraseniaNuevaContenido'], PASSWORD_DEFAULT);
    }


    
    //UPDATES DE INFORMACION
    $queryModificacionPadre = $conn->prepare("UPDATE tutores SET nombre = ?, dni = ?, telefono = ?, contrasenia = ?,  avatar_src = ? WHERE id_tutor = ?");
    $queryModificacionPadre->bind_param("sssssi", $_POST['nombre_tutor'], $_POST['dni'], $_POST['telefono'],  $contraseniaNueva, $rutaAvatar, $_SESSION['id']);
    if ($queryModificacionPadre->execute()) { //comprobamos la ejecucion
        
        if ($queryModificacionPadre->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['registrado' => '../html/modificacionPadreExitosa.html']);
            $queryModificacionPadre->close();   
            exit();
        } else {
            echo json_encode(['noRegistrado' => '../html/modificacionPadreFallada.html']);
            $queryModificacionPadre->close();   
            exit();

        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar Modificar de padre']);
        $queryModificacionPadre->close();   
        exit();
    }
    
    
}


echo json_encode([
    'login' => $login,
    'id_tutor' => $_SESSION['id'],
    'infoTutor' => $infoTutor

]);