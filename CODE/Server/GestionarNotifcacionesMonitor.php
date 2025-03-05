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
//                          OBTENER LISTADO DE PADRES DISPONIBLES
//-----------------------------------------------------------------------------------------------//

// Metodo POST para obtener los padres disponibles
// Se realiza una consulta a la base de datos para obtener los padres disponibles
// Se almacenan los padres en un array
// Se cierra la conexion a la base de datos
// Se retorna el array de padres en formato JSON
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["accion"])) {
    if ($_POST["accion"] == "obtener_monitor") {
        $id_monitor = $_SESSION["id"];
        $sql = "SELECT avatar_src FROM MONITORES WHERE id_monitor = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id_monitor);
        $stmt->execute();
        $result = $stmt->get_result();
        $monitorData = $result->fetch_assoc();
        $stmt->close();
        $conn->close();
        echo json_encode($monitorData);
        exit;
    }

    // Acción para obtener a los padres
    if ($_POST["accion"] == "obtener_padres") {
        $sql = "SELECT id_tutor, nombre, avatar_src FROM TUTORES";
        $result = $conn->query($sql);
        $padres = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $padres[] = $row;
            }
        }
        $conn->close();
        echo json_encode($padres);
        exit;
    }

    //-----------------------------------------------------------------------------------------------//
    //                          OBTENER MENSAJES ENTRE MONITOR Y PADRE
    //-----------------------------------------------------------------------------------------------//
    if ($_POST["accion"] == "obtener_mensajes" && isset($_POST["id_tutor"])) {
        $id_monitor = $_SESSION["id"];
        $id_tutor = intval($_POST["id_tutor"]);

        $sql = "SELECT mensaje, enviado_por, fecha 
                FROM MENSAJES
                WHERE id_monitor = ? AND id_tutor = ?
                ORDER BY fecha ASC";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ii", $id_monitor, $id_tutor);
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
    //                          ENVIAR MENSAJE ENTRE MONITOR Y PADRE
    //-----------------------------------------------------------------------------------------------//
    if ($_POST["accion"] == "enviar_mensaje" && isset($_POST["id_tutor"], $_POST["mensaje"])) {
        $id_monitor = $_SESSION["id"];
        $id_tutor = intval($_POST["id_tutor"]);
        $mensaje = trim($_POST["mensaje"]);
        $enviado_por = "monitor";

        if (empty($mensaje)) {
            echo json_encode(["error" => "Mensaje vacío"]);
            exit;
        }

        $sql = "INSERT INTO MENSAJES (id_monitor, id_tutor, mensaje, enviado_por) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iiss", $id_monitor, $id_tutor, $mensaje, $enviado_por);

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
