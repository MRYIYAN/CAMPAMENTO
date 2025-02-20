<?php
// Incluir el archivo de conexión a la base de datos
include("conexion.php");

// Comprobar si el usuario está logueado
session_start();
if (!isset($_SESSION["login"]) || !isset($_SESSION["id"])) {
    header("Location: ../html/noLogeado.html");
    exit();
}

// Consulta para obtener los datos de PLAN_COMEDOR
$sql = "SELECT * FROM PLAN_COMEDOR";
$result = $conn->query($sql);

// Crear un array de los resultados
$plans = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $plans[] = [
            'nombre_plan' => $row['nombre_plan'],
            'descripcion' => $row['descripcion'],
            'precio' => $row['precio'],
            'descuento' => isset($row['descuento']) ? $row['descuento'] : 40
        ];
    }
} else {
    $plans = [];
}

// Devolver los datos como JSON
echo json_encode($plans);

// Cerrar la conexión
$conn->close();
?>
