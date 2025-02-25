<?php

require_once("conexion.php");

session_start();

$sql = "SELECT * FROM MONITORES";
$result = $conn->query($sql);

$monitores = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $monitores[] = $row;
    }
} else {
    $monitores = [];
}
echo json_encode(['infoMonitores' => $monitores]);

// cerrar conexion pero no es necesario ahora
//$conn->close();
?>
