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

//-----------------------------------------------------------------------------------------------//
//                          OBTENER LISTADO DE MONITORES DISPOIBLES
//-----------------------------------------------------------------------------------------------//

// Metodo POST para obtener los monitores disponibles
// Se realiza una consulta a la base de datos para obtener los monitores disponibles
// Se almacenan los monitores en un array
// Se cierra la conexion a la base de datos
// Se retorna el array de monitores en formato JSON
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


//-----------------------------------------------------------------------------------------------//
//                          OBTENER MENSAJES ENTRE PADRE Y MONITOR
//-----------------------------------------------------------------------------------------------//
    if ($_POST["accion"] == "obtener_mensajes" && isset($_POST["id_monitor"])) {
        $id_tutor = $_SESSION["id"];
        $id_monitor = intval($_POST["id_monitor"]);

        $sql = "SELECT mensaje, enviado_por, fecha 
                FROM MENSAJES
                WHERE id_tutor = ? AND id_monitor = ?
                ORDER BY fecha ASC";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $id_tutor, $id_monitor);
        $stmt->execute();
        $result = $stmt->get_result();

        $mensajes = [];
        while ($row = $result->fetch_assoc()) {
            $mensajes[] = $row;
        }

        $stmt->close();
        $conn->close();
        echo json_encode($mensajes);
        exit;
    }

    //-----------------------------------------------------------------------------------------------//
    //                          ENVIAR MENSAJE ENTRE PADRE Y MONITOR
    //-----------------------------------------------------------------------------------------------//
    if ($_POST["accion"] == "enviar_mensaje" && isset($_POST["id_monitor"], $_POST["mensaje"])) {
        $id_tutor = $_SESSION["id"];
        $id_monitor = intval($_POST["id_monitor"]);
        $mensaje = trim($_POST["mensaje"]);
        $enviado_por = "tutor";

        if (empty($mensaje)) {
            echo json_encode(["error" => "Mensaje vacío"]);
            exit;
        }

        $sql = "INSERT INTO MENSAJES (id_tutor, id_monitor, mensaje, enviado_por) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiss", $id_tutor, $id_monitor, $mensaje, $enviado_por);

        if ($stmt->execute()) {
            echo json_encode(["mensaje" => "Mensaje enviado"]);
        } else {
            echo json_encode(["error" => "Error al enviar mensaje"]);
        }

        $stmt->close();
        $conn->close();
        exit;
    }
}
?>
