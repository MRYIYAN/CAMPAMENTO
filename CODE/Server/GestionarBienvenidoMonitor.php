<?php
// servidor enviará estará en formato JSON
header('Content-Type: application/json');
require_once 'conexion.php';
// comprobacion de conexion
if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit();
}
// Decodificar el JSON recibido
$data = json_decode(file_get_contents("php://input"), true);
session_start(); // Reanuda/recuperar la sesión que teníamos creada

if(isset($data['id'])){
    // Preparar la consulta para evitar inyecciones SQL
    $query = $conn->prepare("SELECT nombre FROM monitores WHERE id_monitor = ?");
    $query->bind_param("i", $data['id']); // Vincular el parámetro
    $query->execute();   
    $result = $query->get_result();  
    
    $nombreMonitor = ""; // Inicializar la variable para evitar errores

    if ($result->num_rows > 0) {    
        $row = $result->fetch_assoc();  
        $nombreMonitor = $row['nombre']; // Acceder directamente al nombre
    }

    $query->close();

    // Enviar la respuesta en JSON
    echo json_encode(['nombreMonitor' => $nombreMonitor]);
    exit();
}

// Si no se cumple ninguna condición, envía una respuesta vacía pero válida:
echo json_encode(['error' => 'ID del monitor no proporcionado o no encontrado']);
exit();