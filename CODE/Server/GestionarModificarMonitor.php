<?php
ob_start();
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
if (!isset($_SESSION["login"]) || !isset($_SESSION["id"])) {
    echo json_encode(["error" => "No logueado"]);
    exit();
}
require_once "conexion.php";

// Recibir datos POST
if (!isset($_POST['contrasenia_actual']) || !isset($_POST['nueva_contrasenia'])) {
    echo json_encode(["error" => "Faltan datos"]);
    exit();
}

$contrasenia_actual = $_POST['contrasenia_actual'];
$nueva_contrasenia = $_POST['nueva_contrasenia'];
$id_monitor = $_SESSION["id"];

// Primero, obtener la contraseña actual del monitor
$sql = "SELECT contrasenia FROM MONITORES WHERE id_monitor = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_monitor);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $hash_actual = $row['contrasenia'];
    // Verificar si la contraseña actual ingresada coincide con el hash almacenado
    if (!password_verify($contrasenia_actual, $hash_actual)) {
        echo json_encode(["error" => "La contraseña actual es incorrecta"]);
        $stmt->close();
        $conn->close();
        exit();
    }
} else {
    echo json_encode(["error" => "Monitor no encontrado"]);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Generar el hash de la nueva contraseña
$nuevo_hash = password_hash($nueva_contrasenia, PASSWORD_DEFAULT);

// Actualizar la contraseña
$sql_update = "UPDATE MONITORES SET contrasenia = ? WHERE id_monitor = ?";
$stmt_update = $conn->prepare($sql_update);
$stmt_update->bind_param("si", $nuevo_hash, $id_monitor);

if ($stmt_update->execute()) {
    echo json_encode(["mensaje" => "Contraseña actualizada con éxito 🎉"]);
} else {
    echo json_encode(["error" => "Error al actualizar la contraseña"]);
}

$stmt_update->close();
$conn->close();
ob_end_flush(); // En lugar de ob_end_clean(), vacía el buffer y envía la salida.
exit();
?>
