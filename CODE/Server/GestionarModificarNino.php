<?php
//----------------------------------------------------------------------------------------//
// Configuración de cabecera para que el servidor envíe la respuesta en formato JSON
//----------------------------------------------------------------------------------------//
header('Content-Type: application/json');

//----------------------------------------------------------------------------------------//
// Incluir archivo de conexión
//----------------------------------------------------------------------------------------//
require_once 'conexion.php';

//----------------------------------------------------------------------------------------//
// Comprobación de conexión a la base de datos
//----------------------------------------------------------------------------------------//
if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit();
}

//----------------------------------------------------------------------------------------//
// Iniciar sesión y verificar si el usuario está logueado
//----------------------------------------------------------------------------------------//
session_start(); // Reanuda/recupera la sesión que teníamos creada

$login = "no";
// Comprobar si el usuario ha iniciado sesión
if (!isset($_SESSION["login"])) {
    echo json_encode(['noLogin' => '../html/noLogeado.html']);
    exit();
} else {
    $login = "ok";
}

//----------------------------------------------------------------------------------------//
// Comprobar si se ha recogido el ID del niño
//----------------------------------------------------------------------------------------//
if (!isset($_SESSION['idNino'])) {
    echo json_encode(['error' => 'No se encontró la sesión del usuario.']);
    exit();
}

//----------------------------------------------------------------------------------------//
// Obtener el contenido JSON de la solicitud POST
//----------------------------------------------------------------------------------------//
$data = json_decode(file_get_contents('php://input'), true);

//----------------------------------------------------------------------------------------//
// Consulta para obtener todos los datos del niño
//----------------------------------------------------------------------------------------//
$queryInfoNino = $conn->prepare("SELECT * FROM ninos WHERE id_nino = ?");
$queryInfoNino->bind_param("i", $_SESSION['idNino']);
$queryInfoNino->execute();
$result = $queryInfoNino->get_result();

//----------------------------------------------------------------------------------------//
// Comprobar la respuesta de la consulta
//----------------------------------------------------------------------------------------//
if ($result->num_rows > 0) {
    $infoNino = $result->fetch_assoc();
} else {
    // echo json_encode(['error' => "No se encontraron datos para este niño con el ID " . $id_nino]);
    // exit();
}

//----------------------------------------------------------------------------------------//
// Cerrar la consulta
//----------------------------------------------------------------------------------------//
$queryInfoNino->close();

//----------------------------------------------------------------------------------------//
// Insertar datos para modificar la información del niño
//----------------------------------------------------------------------------------------//
if (isset($_POST['nombre_nino']) && isset($_POST['nacimiento_nino']) && isset($_POST['alergia']) && isset($_POST['observaciones'])) {
    if (empty($_POST['nombre_nino']) || empty($_POST['nacimiento_nino']) || empty($_POST['alergia']) || empty($_POST['observaciones'])) {
        echo json_encode(['error' => 'Faltan datos necesarios']);
        exit();
    }

    //----------------------------------------------------------------------------------------//
    // Asignación de nuevo avatar en la base de datos
    //----------------------------------------------------------------------------------------//
    $directorio_subida_avatar = "../assets/avatar/uploads/";
    $rutaAvatar = "../assets/img/avatar.png"; // Ruta por defecto si no se introduce un avatar

    // Comprobar si se ha asignado un nuevo avatar y si hay algún error
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] == 0 && $_POST['cambiarAvatar'] == true) {
        $name_avatar = $_FILES['avatar']['name']; // Obtener el nombre del archivo
        $array_avatar = pathinfo($name_avatar); // Obtener información del archivo según su nombre
        $ruta_antiguo_avatar = $_FILES['avatar']['tmp_name']; // Obtener la ruta temporal del avatar
        $ruta_destino_avatar = $directorio_subida_avatar . $name_avatar; // Definir la ruta de destino del avatar
        move_uploaded_file($ruta_antiguo_avatar, $ruta_destino_avatar); // Mover el archivo a la ruta de destino
        $rutaAvatar = $ruta_destino_avatar; // Actualizar la ruta del avatar
    } else {
        // En caso de no cambiar el avatar, se usa la ruta que ya está en la base de datos
        $rutaAvatar = $_POST['avatarBBDD'];
    }

    //----------------------------------------------------------------------------------------//
    // Actualizar la información del niño
    //----------------------------------------------------------------------------------------//
    $queryModificacionNiño = $conn->prepare("UPDATE ninos SET nombre = ?, fecha_nacimiento = ?, alergias = ?, observaciones = ?, avatar_src = ? WHERE id_nino = ?");
    $queryModificacionNiño->bind_param("sssssi", $_POST['nombre_nino'], $_POST['nacimiento_nino'], $_POST['alergia'], $_POST['observaciones'], $rutaAvatar, $_SESSION['idNino']);
    
    // Comprobar la ejecución de la consulta
    if ($queryModificacionNiño->execute()) {
        // Comprobar si se ha modificado al menos un registro
        if ($queryModificacionNiño->affected_rows >= 0) {
            echo json_encode(['registrado' => '../html/modificacionNinoExitosa.html']);
            $queryModificacionNiño->close();
            exit();
        } else {
            echo json_encode(['noRegistrado' => '../html/modificacionNinoFallada.html']);
            $queryModificacionNiño->close();
            exit();
        }
    } else {
        // En caso de error en la ejecución de la consulta
        echo json_encode(['error' => 'Error al ejecutar la modificación del niño']);
        $queryModificacionNiño->close();
        exit();
    }
}

//----------------------------------------------------------------------------------------//
// Devolver la información del niño en formato JSON
//----------------------------------------------------------------------------------------//
echo json_encode([
    'login' => $login,
    'id_nino' => $_SESSION['idNino'],
    'infoNino' => $infoNino
]);
?>