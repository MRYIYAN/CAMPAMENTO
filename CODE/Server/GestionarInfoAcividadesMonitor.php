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

if (!isset($_POST["accion"])) {
    echo json_encode(["error" => "No se ha especificado acción"]);
    exit();
}

$accion = $_POST["accion"];

switch($accion) {

    case "info_monitor":
        // Devuelve el nombre y avatar del monitor
        $id_monitor = $_SESSION["id"];
        $sql = "SELECT nombre, avatar_src FROM MONITORES WHERE id_monitor = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id_monitor);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            if (!isset($row["avatar_src"]) || trim($row["avatar_src"]) === "") {
                $row["avatar_src"] = "../assets/img/avatar.png";
            }
            echo json_encode($row);
        } else {
            echo json_encode(["nombre" => "Monitor", "avatar_src" => "../assets/img/avatar.png"]);
        }
        $stmt->close();
        break;

    case "obtener_grupos":
        // Devuelve los grupos asociados al monitor
        $id_monitor = $_SESSION["id"];
        $sql = "SELECT id_grupo, nombre FROM GRUPOS WHERE id_monitor = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id_monitor);
        $stmt->execute();
        $result = $stmt->get_result();
        $grupos = [];
        while($row = $result->fetch_assoc()){
            $grupos[] = $row;
        }
        echo json_encode($grupos);
        $stmt->close();
        break;

    case "obtener_planes":
        // Este caso se elimina si ya no lo necesitas, o puedes conservarlo si se utiliza en otra parte
        $sql = "SELECT id_plan, nombre FROM PLAN_FECHAS";
        $result = $conn->query($sql);
        $planes = [];
        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()){
                $planes[] = $row;
            }
        }
        echo json_encode($planes);
        break;

    case "buscar_ninos_por_grupo":
        // Se espera recibir el parámetro 'id_grupo'
        if (!isset($_POST['id_grupo'])) {
            echo json_encode(["error" => "Falta el parámetro id_grupo"]);
            exit();
        }
        $id_grupo = intval($_POST['id_grupo']);
        $sql = "SELECT N.nombre, N.id_nino, N.avatar_src 
                FROM NINOS N 
                JOIN GRUPO_NINOS GN ON N.id_nino = GN.id_nino 
                WHERE GN.id_grupo = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id_grupo);
        $stmt->execute();
        $result = $stmt->get_result();
        $ninos = [];
        while ($row = $result->fetch_assoc()){
            $ninos[] = $row;
        }
        echo json_encode($ninos);
        $stmt->close();
        break;

        case "guardar_asistencia":
            if (!isset($_POST['id_nino']) || !isset($_POST['estado'])) {
                echo json_encode(["error" => "Faltan parámetros"]);
                exit();
            }
            $id_nino = intval($_POST['id_nino']);
            $estado = $_POST['estado'];
            if ($estado === 'si') {
                $sql = "UPDATE NINOS SET asistencia = CURDATE(), inasistencia = NULL WHERE id_nino = ?";
            } else if ($estado === 'no') {
                $sql = "UPDATE NINOS SET inasistencia = CURDATE(), asistencia = NULL WHERE id_nino = ?";
            } else {
                echo json_encode(["error" => "Estado no válido"]);
                exit();
            }
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $id_nino);
            if ($stmt->execute()) {
                echo json_encode(["mensaje" => "Asistencia guardada correctamente"]);
            } else {
                echo json_encode(["error" => "Error al guardar asistencia"]);
            }
            $stmt->close();
            break;
}

$conn->close();
exit();
?>
