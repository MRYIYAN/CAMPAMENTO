<?php
// Conectar a la base de datos
include("conexion.php");

// Verificar la conexión
if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit();
}

session_start(); // Inicia o reanuda la sesión

// Comprobar si el usuario está logueado
if (!isset($_SESSION["login"])) {
    echo json_encode(['noLogin' => '../html/noLogeado.html']);
    exit();
}

// Comprobar si el ID de usuario está disponible en la sesión
if (!isset($_SESSION['id'])) {
    echo json_encode(['error' => 'No se encontró la sesión del usuario.']);
    exit(); // Salir si no se encuentra el ID
}

// Consulta para obtener las fechas de inicio, fin, precio y definición
$query = $conn->prepare("SELECT fecha_inicio, fecha_fin, precio, definicion FROM PLAN_FECHAS");
$query->execute();
$result = $query->get_result();

$fechas = []; // Array para almacenar los resultados

// Si la consulta tiene resultados, recorremos los datos
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Aquí estamos almacenando las fechas y datos adicionales (precio, definición)
        $fechas[] = [
            'fecha_inicio' => $row['fecha_inicio'],
            'fecha_fin' => $row['fecha_fin'],
            'precio' => $row['precio'],
            'definicion' => $row['definicion']
        ];
    }
} else {
    echo json_encode(['error' => 'No se encontraron eventos.']);
    exit();
}

// Devolver los datos en formato JSON para usarlos en el frontend
echo json_encode($fechas);

// Cerrar la consulta
$query->close();
?>
