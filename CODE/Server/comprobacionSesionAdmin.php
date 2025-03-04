<?php

//PHP SOLO PARA COMPROBAR SI HA HECHO LOGIN PARA MONITOR



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
if (!isset($_SESSION["login"])){
    echo json_encode(['noLogin' => '../html/noLogeado.html']);
    exit(); //detenerse
}else{
    //comprobar si es perfil del admin o no 
    if ($_SESSION["tipo"] !== "ADMIN"){
        echo json_encode(['noLogin' => '../html/noLogeado.html']);
        exit();
    }else{
        $login= "ok"; 
    }
   
}
$id = 0;
//comprobamos si recoge el id
if (!isset($_SESSION['id'])) {
    //en caso si no se recoge bien el id
    echo json_encode(['error' => 'No se encontró la sesión del usuario.']);
    exit();
}else{
    $id = $_SESSION['id'];
}
//=========================================================================================================================
//                       FIN DE COMPROBAR LOGIN Y EXTRAER EL ID 
//=========================================================================================================================



//=========================================================================================================================
//                       ENVIO DE DATOS
//=========================================================================================================================
//enviar el json a js
echo json_encode([
    'login' => $login,
    'id' => $id
]);