<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once("conexion.php");

session_start();
if (!isset($_SESSION["login"]) || !isset($_SESSION["id"])) {
    header("Location: ../html/noLogeado.html");
    exit();
}

// Consulta SQL preparada
$query = $conn->prepare("SELECT id_monitor, nombre, descripcion FROM MONITORES");
$query->execute();
$result = $query->get_result();

// Verificación de errores en la consulta
if (!$result) {
    die("Error en la consulta SQL: " . $conn->error);
}

$monitores = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $monitores[] = [
            'id'          => $row['id_monitor'],  
            'nombre'      => $row['nombre'],
            'descripcion' => $row['descripcion']
        ];
    }
} else {
    $monitores = []; // Si no hay registros
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($monitores);

// Cerrar la consulta y la conexión
$query->close();
$conn->close();
?>
