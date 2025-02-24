<?php
//----------------------------------------------------------------------------------------//
// Activar errores para depuración (puedes desactivar en producción)
//----------------------------------------------------------------------------------------//
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//----------------------------------------------------------------------------------------//
// Incluir archivo de conexión
//----------------------------------------------------------------------------------------//
require_once("conexion.php");

//----------------------------------------------------------------------------------------//
// Iniciar sesión y verificar si el usuario está logueado
//----------------------------------------------------------------------------------------//
session_start();
if (!isset($_SESSION["login"]) || !isset($_SESSION["id"])) {
    header("Location: ../html/noLogeado.html");
    exit();
}

//----------------------------------------------------------------------------------------//
// Consultar datos de los monitores
//----------------------------------------------------------------------------------------//
$sql = "SELECT id_monitor, nombre, descripcion FROM MONITORES";
$result = $conn->query($sql);

$monitores = [];

//----------------------------------------------------------------------------------------//
// Procesar resultados de la consulta
//----------------------------------------------------------------------------------------//
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $monitores[] = [
            'id'          => $row['id_monitor'],  
            'nombre'      => $row['nombre'],
            'descripcion' => $row['descripcion']
        ];
    }
} else {
    $monitores = [];
}

//----------------------------------------------------------------------------------------//
// Devolver los datos en formato JSON
//----------------------------------------------------------------------------------------//
header('Content-Type: application/json; charset=utf-8');
echo json_encode($monitores);

//----------------------------------------------------------------------------------------//
// Cerrar la conexión
//----------------------------------------------------------------------------------------//
$conn->close();
?>
