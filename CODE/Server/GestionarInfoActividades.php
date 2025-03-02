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




//query pasa sacar todo los informaciones del actividad
$actividades = [];
$queryActividades = $conn->prepare("SELECT titulo, descripcion, imagen_src FROM ACTIVIDADES AS a WHERE id_actividad = ( SELECT MAX(id_actividad) FROM ACTIVIDADES WHERE titulo = a.titulo AND descripcion = a.descripcion ); ");   //obtener los títulos sin repetirlos, pero permitiendo que se repitan cuando la descripcion sea diferente, y que ordene por el id_actividad de forma descendente,
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

//este echo hay que estar abajo del todo SINO SE PETA
echo json_encode([
    'login' => $login,
    'id_Padre' => $_SESSION['id'], 
    'actividades' => $actividades

]);