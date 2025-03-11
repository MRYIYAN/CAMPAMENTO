<?php
ob_start(); // Inicia buffer para evitar salida accidental
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

// Consulta incluyendo el campo imagenComida_src
$query = $conn->prepare("SELECT id_plan_comedor, nombre_plan, descripcion, precio, imagenComida_src FROM PLAN_COMEDOR");
$query->execute();
$result = $query->get_result();

$planes = [];
if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        $planes[] = $row;
    }
}
ob_clean(); // Limpia cualquier salida previa
echo json_encode($planes);

// Cerrar la consulta y la conexión
$query->close();
$conn->close();
exit();
?>
