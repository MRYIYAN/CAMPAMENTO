<?php
//----------------------------------------------------------------------------------------//
// Configuración de conexión
//----------------------------------------------------------------------------------------//
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Campamento";

//----------------------------------------------------------------------------------------//
// Crear la conexión (sin seleccionar la base aún)
//----------------------------------------------------------------------------------------//
$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//----------------------------------------------------------------------------------------//
// Crear la base de datos si no existe
//----------------------------------------------------------------------------------------//
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
$conn->query($sql);  // Se crea la base de datos si no existe, sin imprimir nada

//----------------------------------------------------------------------------------------//
// Seleccionar la base de datos
//----------------------------------------------------------------------------------------//
$conn->select_db($dbname);

//----------------------------------------------------------------------------------------//
// Creación de tablas
//----------------------------------------------------------------------------------------//
$sql_tables = "

 CREATE TABLE IF NOT EXISTS PLAN_FECHAS (
    id_plan INT PRIMARY KEY AUTO_INCREMENT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    fecha_maxInscripcion DATE NOT null,
    hora_maximaInscripcion time not null,
    precio VARCHAR(9) NOT NULL,
    definicion VARCHAR(40000) NOT NULL
);
    CREATE TABLE IF NOT EXISTS TUTORES (
        id_tutor INT PRIMARY KEY AUTO_INCREMENT, 
        nombre VARCHAR(50) NOT NULL,
        dni VARCHAR(9) NOT NULL,
        telefono VARCHAR(9) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        contrasenia text NOT NULL,
        avatar_src text
    );

 CREATE TABLE IF NOT EXISTS NINOS (
    id_nino INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(50) NOT NULL,
    alergias TEXT,
    observaciones TEXT,
    fecha_nacimiento DATE NOT NULL,
    id_tutor INT NOT NULL,
    id_plan INT NOT NULL,
    pagado BOOLEAN NOT NULL,
    avatar_src text,
    FOREIGN KEY (id_tutor) REFERENCES TUTORES(id_tutor),
    FOREIGN KEY (id_plan) REFERENCES PLAN_FECHAS(id_plan)
);

    CREATE TABLE IF NOT EXISTS MONITORES (
        id_monitor INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        contrasenia text NOT NULL,
        avatar_src text
    );

    CREATE TABLE IF NOT EXISTS GRUPOS (
        id_grupo INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(50) NOT NULL,
        id_monitor INT NOT NULL,
        FOREIGN KEY (id_monitor) REFERENCES MONITORES(id_monitor)
    );

    CREATE TABLE IF NOT EXISTS GRUPO_NINOS (
        id_grupo INT NOT NULL,
        id_nino INT NOT NULL,
        PRIMARY KEY (id_grupo, id_nino),
        FOREIGN KEY (id_grupo) REFERENCES GRUPOS(id_grupo) ON DELETE CASCADE,
        FOREIGN KEY (id_nino) REFERENCES NINOS(id_nino) ON DELETE CASCADE
    );



     CREATE TABLE IF NOT EXISTS ACTIVIDADES (
    id_actividad INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    hora TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dia DATE NOT NULL,
    id_grupo INT NOT NULL,
    id_plan INT NOT NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo),
    FOREIGN KEY (id_plan) REFERENCES PLAN_FECHAS(id_plan)
);

    CREATE TABLE IF NOT EXISTS ADMIN (
        id_admin INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(50) NOT NULL UNIQUE,
        contrasenia text NOT NULL
    );

    
";
$conn->multi_query($sql_tables);  // Se ejecuta la creación de todas las tablas
while ($conn->more_results() && $conn->next_result()) {}  // Espera a que terminen todas las consultas

//----------------------------------------------------------------------------------------//
// Insertar datos de prueba usando consultas preparadas
//----------------------------------------------------------------------------------------//
// Función para verificar si un usuario ya existe
function usuarioExiste($conn, $tabla, $email) {
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM $tabla WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $result['count'] > 0;
}

// Insertar Monitor si no existe
if (!usuarioExiste($conn, "MONITORES", "monitor@ejemplo.com")) {
    $stmt = $conn->prepare("INSERT INTO MONITORES (nombre, email, contrasenia) VALUES (?, ?, ?)");
    $nombre = "Monitor Ejemplo";
    $email = "monitor@ejemplo.com";
    $hashed_password = '$2y$10$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu';  
    $stmt->bind_param("sss", $nombre, $email, $hashed_password);
    
    if ($stmt->execute()) {
        echo "Monitor insertado correctamente.<br>";
    } else {
        echo "Error al insertar Monitor: " . $stmt->error . "<br>";
    }
    $stmt->close();
}

// Insertar Tutor si no existe

if (!usuarioExiste($conn, "TUTORES", "tutor@ejemplo.com")) {
    $stmt = $conn->prepare("INSERT INTO TUTORES (nombre, dni, telefono, email, contrasenia) VALUES (?, ?, ?, ?, ?)");
    $nombre = "Tutor Ejemplo";
    $dni = "12345678A";
    $telefono = "123456789";
    $email = "tutor@ejemplo.com";
    $tutor_hashed_password = '$2y$10$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu';
    $stmt->bind_param("sssss", $nombre, $dni, $telefono, $email, $tutor_hashed_password);
    
    if ($stmt->execute()) {
        echo "Tutor insertado correctamente.<br>";
    } else {
        echo "Error al insertar Tutor: " . $stmt->error . "<br>";
    }
    $stmt->close();
}

// Insertar Admin si no existe
if (!usuarioExiste($conn, "ADMIN", "admin@ejemplo.com")) {
    $stmt = $conn->prepare("INSERT INTO ADMIN (email, contrasenia) VALUES (?, ?)");
    $email = "admin@ejemplo.com";
    $admin_hashed_password = '$2y$10$RVcnfes4zNR150gzv5ZfluPaxB1fzxJtyBSM1Nxj0VBWm5yadTRxW'; 
    $stmt->bind_param("ss", $email, $admin_hashed_password);
    
    if ($stmt->execute()) {
        echo "Admin insertado correctamente.<br>";
    } else {
        echo "Error al insertar Admin: " . $stmt->error . "<br>";
    }
    $stmt->close();
}

//----------------------------------------------------------------------------------------//
// No se cierra la conexión para que se pueda usar en GestionarLogin.php IMPORTANTE
//----------------------------------------------------------------------------------------//
?>