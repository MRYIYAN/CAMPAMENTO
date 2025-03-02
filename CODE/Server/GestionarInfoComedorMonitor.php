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

// Consulta sin fecha_inicio y fecha_fin
$sql = "SELECT id_plan_comedor, nombre_plan, descripcion, precio 
        FROM PLAN_COMEDOR";
$result = $conn->query($sql);

$planes = [];
if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        $planes[] = $row;
    }
}
ob_clean(); // Limpia cualquier salida previa
echo json_encode($planes);
$conn->close();
exit();
?>
