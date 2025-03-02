<?php
//----------------------------------------------------------------------------------------//
// Iniciar sesión y configurar respuesta JSON para el login (con hasheo de contraseñas)
//----------------------------------------------------------------------------------------//
session_start();
require 'Conexion.php';

header('Content-Type: application/json');  // Indicamos que la respuesta es JSON para AJAX

// Función para manejar errores y devolver una respuesta JSON
function manejarError($mensaje) {
    error_log($mensaje);  // Registrar el error en el log del servidor
    echo json_encode(["error" => $mensaje]);
    exit();
}

//----------------------------------------------------------------------------------------//
// Verificar que se envíen datos mediante método POST
//----------------------------------------------------------------------------------------//
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["pswd"];

    //------------------------------------------------------------------------------------//
    // Validar que los campos no estén vacíos
    //------------------------------------------------------------------------------------//
    if (empty($email) || empty($password)) {
        manejarError("Todos los campos son obligatorios.");
    }

    //------------------------------------------------------------------------------------//
    // Escapar los datos para prevenir SQL Injection
    //------------------------------------------------------------------------------------//
    $email = $conn->real_escape_string($email);
    $password = $conn->real_escape_string($password);

    //------------------------------------------------------------------------------------//
    // Verificar en la tabla TUTORES (Padres)
    //------------------------------------------------------------------------------------//
    $sql = "SELECT id_tutor, contrasenia FROM TUTORES WHERE email = '$email'";
    $result = $conn->query($sql);
    if ($result === false) {
        manejarError("Error en la consulta SQL: " . $conn->error);
    }
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        // Verificar si la contraseña ingresada coincide con la hasheada en la BD
        if (password_verify($password, $row['contrasenia'])) {
            $_SESSION["usuario"] = $email;
            $_SESSION["tipo"] = "TUTOR";
            $_SESSION["id"] = $row["id_tutor"];
            $_SESSION["login"] = "OK";
            echo json_encode(["redirect" => "../html/Bienvenido_tutor.html"]);
            exit();
        }
    }

    //------------------------------------------------------------------------------------//
    // Verificar en la tabla MONITORES
    //------------------------------------------------------------------------------------//
    $sql = "SELECT id_monitor, contrasenia FROM MONITORES WHERE email = '$email'";
    $result = $conn->query($sql);
    if ($result === false) {
        manejarError("Error en la consulta SQL: " . $conn->error);
    }
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['contrasenia'])) {
            $_SESSION["usuario"] = $email;
            $_SESSION["tipo"] = "MONITOR";
            $_SESSION["id"] = $row["id_monitor"];
            $_SESSION["login"] = "OK";
            echo json_encode(["redirect" => "../html/Bienvenido_monitor.html"]);
            exit();
        }
    }

    //------------------------------------------------------------------------------------//
    // Verificar en la tabla ADMIN
    //------------------------------------------------------------------------------------//
    $sql = "SELECT id_admin, contrasenia FROM ADMIN WHERE email = '$email'";
    $result = $conn->query($sql);
    if ($result === false) {
        manejarError("Error en la consulta SQL: " . $conn->error);
    }
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['contrasenia'])) {
            $_SESSION["usuario"] = $email;
            $_SESSION["tipo"] = "ADMIN";
            $_SESSION["id"] = $row["id_admin"];
            $_SESSION["login"] = "OK";
            echo json_encode(["redirect" => "../html/Bienvenido_admin.html"]);
            exit();
        }
    }

    //------------------------------------------------------------------------------------//
    // Si no se encuentran coincidencias, enviar mensaje de error
    //------------------------------------------------------------------------------------//
    manejarError("Credenciales incorrectas.");
} else {
    //------------------------------------------------------------------------------------//
    // Si el método no es POST, se deniega el acceso 
    //------------------------------------------------------------------------------------//
    manejarError("Acceso denegado.");
}

//----------------------------------------------------------------------------------------//
// Opcional: Cerrar la conexión
$conn->close();
?>