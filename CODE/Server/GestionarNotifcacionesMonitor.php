<?php
file_put_contents("log.txt", print_r($_POST, true), FILE_APPEND);

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
    if ($_POST["accion"] == "obtener_padres") {
        // Consulta: obtenemos los padres (tutores) de la base de datos
        $sql = "SELECT id_tutor, nombre, avatar_src FROM TUTORES";
        $result = $conn->query($sql);

        if (!$result) {
            echo json_encode(["error" => "Error en la consulta: " . $conn->error]);
            exit;
        }


        $padres = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $padres[] = $row;
            }
        }
        $conn->close();
        echo json_encode($padres);
        var_dump($padres);
        exit;
    }

}
?>
