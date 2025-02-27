<?php
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

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["accion"])) {
    if ($_POST["accion"] == "obtener_monitores") {
        $sql = "SELECT id_monitor, nombre FROM MONITORES";
        $result = $conn->query($sql);

        $monitores = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $monitores[] = $row;
            }
        }

        $conn->close();
        echo json_encode($monitores);
        exit;
    }
}
?>
