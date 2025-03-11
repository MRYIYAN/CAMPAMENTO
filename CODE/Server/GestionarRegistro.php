<?php
//----------------------------------------------------------------------------------------//
// Iniciar sesión y configurar la respuesta JSON
//----------------------------------------------------------------------------------------//
session_start();
require 'Conexion.php';

header('Content-Type: application/json');  // Indicamos que la respuesta es JSON para AJAX

//----------------------------------------------------------------------------------------//
// Recuperar los datos enviados por el método POST
//----------------------------------------------------------------------------------------//
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];
    $password = $_POST["pswd"];

    //------------------------------------------------------------------------------------//
    // Validar que los campos no estén vacíos
    //------------------------------------------------------------------------------------//
    if (empty($email) || empty($password)) {
        echo json_encode(["error" => "Todos los campos son obligatorios."]);
        exit();
    }

    //------------------------------------------------------------------------------------//
    // Hashear la contraseña
    //------------------------------------------------------------------------------------//
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    //------------------------------------------------------------------------------------//
    // Consultar si el email ya está registrado en la base de datos
    //------------------------------------------------------------------------------------//
    $check_email = $conn->prepare("SELECT * FROM TUTORES WHERE email = ?");
    $check_email->bind_param("s", $email);
    $check_email->execute();
    $result = $check_email->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["error" => "El email ya está registrado."]);
        exit();
    }
    $check_email->close();

    //------------------------------------------------------------------------------------//
    // Insertar el nuevo TUTOR en la base de datos (solo se insertan email y contraseña)
    // Los demás campos se insertan como cadena vacía (o NULL, según la definición de la tabla)
    //------------------------------------------------------------------------------------//
    $sql_insert_tutor = $conn->prepare("INSERT INTO TUTORES (nombre, dni, telefono, email, contrasenia) VALUES ('', '', '', ?, ?)");
    $sql_insert_tutor->bind_param("ss", $email, $hashedPassword);
    if ($sql_insert_tutor->execute() === TRUE) {
        // Registrar el usuario en la sesión y redirigir
        $_SESSION["usuario"] = $email;
        $_SESSION["tipo"] = "TUTOR";
        $_SESSION["id"] = $conn->insert_id;  // Obtener el id del nuevo tutor 
        $_SESSION["login"] = "OK";
        echo json_encode(["redirect" => "../html/IndexPadre.html"]);
        exit();
    } else {
        echo json_encode(["error" => "Error al registrar el tutor."]);
        exit();
    }
    $sql_insert_tutor->close();
} else {
    echo json_encode(["error" => "No se enviaron datos vía POST."]);
    exit();
}

//------------------------------------------------------------------------------------//
// Cerrar la conexión no es necesario aun 
// $conn->close();
//------------------------------------------------------------------------------------//
?>