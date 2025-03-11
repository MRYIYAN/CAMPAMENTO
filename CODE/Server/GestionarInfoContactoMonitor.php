<?php
ob_start(); // Inicia el buffer para eliminar salidas accidentales
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "conexion.php";
session_start();

if (!isset($_SESSION["login"]) || !isset($_SESSION["id"])) {
    echo json_encode(["error" => "No logueado"]);
    exit();
}

// Consulta para obtener los datos de los tutores
$query = $conn->prepare("SELECT id_tutor, nombre, telefono, email, avatar_src FROM TUTORES");
$query->execute();
$result = $query->get_result();

$tutores = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Si no hay avatar, asignar el predeterminado
        if (!isset($row["avatar_src"]) || trim($row["avatar_src"]) === "") {
            $row["avatar_src"] = "../assets/img/avatar.png";
        }
        $tutores[] = $row;
    }
}
ob_clean(); // Limpia cualquier salida anterior
echo json_encode($tutores);

// Cerrar la consulta y la conexión
$query->close();
$conn->close();
exit();
?>
