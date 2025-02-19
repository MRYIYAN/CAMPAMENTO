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

// Verificar si hay resultados
if ($result->num_rows > 0) {
    // Crear las cards dinámicamente
    while($row = $result->fetch_assoc()) {
        echo "<div class='card'>
                <h3>" . $row['nombre_plan'] . "</h3>
                <p>" . $row['descripcion'] . "</p>
                <p>Precio: " . $row['precio'] . "€</p>
              </div>";
    }
} else {
    echo "<p>No hay planes disponibles.</p>";
}

// Cerrar la conexión
$conn->close();
?>
