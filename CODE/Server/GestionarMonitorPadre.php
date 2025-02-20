<?php
session_start();
if (!isset($_SESSION["login"]) || !isset($_SESSION["id"])) {
    header("Location: ../html/noLogeado.html");
    exit();
}

header('Content-Type: application/json');

require_once 'Conexion.php'; // Asegúrate de que este archivo existe y está correcto

try {
    // Crear conexión PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Consulta para obtener los datos de LISTA_MONITORES
    $stmt = $pdo->prepare("SELECT nombre_monitor, descripcion_monitor FROM LISTA_MONITORES");
    $stmt->execute();
    $listas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($listas);
} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la conexión: " . $e->getMessage()]);
}
exit();
?>
