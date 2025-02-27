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
    nombre  VARCHAR(40) NOT NULL,
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
        
    CREATE TABLE IF NOT EXISTS PLAN_COMEDOR (
    id_plan_comedor INT PRIMARY KEY AUTO_INCREMENT,
    nombre_plan VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,   
    imagenComida_src text
    );

 CREATE TABLE IF NOT EXISTS NINOS (
    id_nino INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(50) NOT NULL,
    alergias TEXT,
    observaciones TEXT,
    fecha_nacimiento DATE NOT NULL,
    id_tutor INT NOT NULL,
    pagado BOOLEAN NOT NULL,
    avatar_src text,
    FOREIGN KEY (id_tutor) REFERENCES TUTORES(id_tutor)
);

    CREATE TABLE IF NOT EXISTS MONITORES (
        id_monitor INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        contrasenia text NOT NULL,
        descripcion TEXT,
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
      CREATE TABLE IF NOT EXISTS PLAN_NINOS (
        id_plan INT NOT NULL,
        id_nino INT NOT NULL,
        PRIMARY KEY (id_plan, id_nino),
        FOREIGN KEY (id_plan) REFERENCES PLAN_FECHAS(id_plan) ON DELETE CASCADE,
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
    imagen_src text, 
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo),
    FOREIGN KEY (id_plan) REFERENCES PLAN_FECHAS(id_plan)
);

    CREATE TABLE IF NOT EXISTS ADMIN (
        id_admin INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(50) NOT NULL UNIQUE,
        contrasenia text NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS PLAN_COMEDOR (
    id_plan_comedor INT PRIMARY KEY AUTO_INCREMENT,
    nombre_plan VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    id_tutor INT NOT NULL,  
    id_nino INT NOT NULL,   
    FOREIGN KEY (id_tutor) REFERENCES TUTORES(id_tutor),   
    FOREIGN KEY (id_nino) REFERENCES NINOS(id_nino)        
    );

    CREATE TABLE IF NOT EXISTS CHAT_NOTIFCACIONES (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_emisor INT NOT NULL,
    id_receptor INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    leido TINYINT(1) DEFAULT 0
    );
";

$conn->multi_query($sql_tables);  // Se ejecuta la creación de todas las tablas
while ($conn->more_results() && $conn->next_result()) {
}  // Espera a que terminen todas las consultas

//----------------------------------------------------------------------------------------//
// Insertar datos de prueba usando consultas preparadas
//----------------------------------------------------------------------------------------//
// Función para verificar si un usuario ya existe
function usuarioExiste($conn, $tabla, $email)
{
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM $tabla WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $result['count'] > 0;
}


// ----- 1. MONITORES -----
// ------------------------------------------------------------------------------------------------------------------------------------//
// Funcion para crear datos en la tabla monitores con un id asignado ademas de su contraseña "hasheada".
// ------------------------------------------------------------------------------------------------------------------------------------//
if (!usuarioExiste($conn, "MONITORES", "monitor@ejemplo.com")) {
    $stmt = $conn->prepare("INSERT INTO MONITORES (nombre, email, contrasenia, descripcion) VALUES (?, ?, ?, ?)");
    $nombre = "Monitor Ejemplo";
    $email = "monitor@ejemplo.com";
    $hashed_password = '$2y$10$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu';
    $descripcion = "Monitor de ejemplo para el campamento.";
    $stmt->bind_param("ssss", $nombre, $email, $hashed_password, $descripcion);

    if ($stmt->execute()) {
        echo "Monitor insertado correctamente.<br>";
    } else {
        echo "Error al insertar Monitor: " . $stmt->error . "<br>";
    }
    $stmt->close();
}

// ----- 3. TUTORES -----
// ------------------------------------------------------------------------------------------------------------------------------------//
// Insertar Tutor si no existe en la base de datos. 
// ------------------------------------------------------------------------------------------------------------------------------------//
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
// ----- 4. ADMIN -----
// ------------------------------------------------------------------------------------------------------------------------------------//
// Insertar datos en ADMIN si no existe en la base de datos con una contraseña "hasheada".
// ------------------------------------------------------------------------------------------------------------------------------------//
if (!usuarioExiste($conn, "ADMIN", "admin@ejemplo.com")) {
    $stmt = $conn->prepare("INSERT INTO ADMIN (email, contrasenia) VALUES (?, ?)");
    $email = "admin@ejemplo.com";
    $admin_hashed_password = '$2y$10$FPQ0ATriO3ybhUFxwS3O0.2yDubZGQ0KniiwvRRAB95dEFZ045IL.';
    $stmt->bind_param("ss", $email, $admin_hashed_password);

    if ($stmt->execute()) {
        echo "Admin insertado correctamente.<br>";
    } else {
        echo "Error al insertar Admin: " . $stmt->error . "<br>";
    }
    $stmt->close();
}

// ----- 5. PLAN_FECHAS -----
// ------------------------------------------------------------------------------------------------------------------------------------//
// Función para verificar si ya existe un plan en base a fechas 
// ------------------------------------------------------------------------------------------------------------------------------------//
function planExiste($conn, $fecha_inicio, $fecha_fin)
{
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM PLAN_FECHAS WHERE fecha_inicio = ? AND fecha_fin = ?");
    $stmt->bind_param("ss", $fecha_inicio, $fecha_fin);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $result['count'] > 0;
}

// Valores a insertar en PLAN_FECHAS
$fecha_inicio           = "2025-06-01";
$fecha_fin              = "2025-06-15";
$fecha_maxInscripcion   = "2025-05-25";
$hora_maximaInscripcion = "18:00:00";
$precio                 = "100.00";
$definicion             = "Campamento de verano para niños de 6 a 12 años.";

// Insertar el plan solo si no existe
if (!planExiste($conn, $fecha_inicio, $fecha_fin)) {
    $stmt = $conn->prepare("INSERT INTO PLAN_FECHAS (fecha_inicio, fecha_fin, fecha_maxInscripcion, hora_maximaInscripcion, precio, definicion) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $fecha_inicio, $fecha_fin, $fecha_maxInscripcion, $hora_maximaInscripcion, $precio, $definicion);
    if (!$stmt->execute()) {
        error_log("Error al insertar Plan: " . $stmt->error);
    }
    $stmt->close();
} else {
    // Opcional: echo "El plan ya existe.<br>"; USAMOS AJAX Y AL ESPERAR JSON EL ECHO ROMPE LA ESTRUCUTRA
}


// ----- 6. GRUPOS -----
// ------------------------------------------------------------------------------------------------------------------------------------//
// Función para verificar si ya existe un grupo con un nombre dado y un monitor asignado
// ------------------------------------------------------------------------------------------------------------------------------------//
function grupoExiste($conn, $nombre_grupo, $id_monitor)
{
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM GRUPOS WHERE nombre = ? AND id_monitor = ?");
    $stmt->bind_param("si", $nombre_grupo, $id_monitor);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $result['count'] > 0;
}

// Valores a insertar en GRUPOS
$nombre_grupo = "Grupo Ejemplo";
$id_monitor   = 1; // Asegúrate de que este ID exista en la tabla MONITORES

// Insertar el grupo solo si no existe
if (!grupoExiste($conn, $nombre_grupo, $id_monitor)) {
    $stmt = $conn->prepare("INSERT INTO GRUPOS (nombre, id_monitor) VALUES (?, ?)");
    $stmt->bind_param("si", $nombre_grupo, $id_monitor);
    if (!$stmt->execute()) {
        error_log("Error al insertar Grupo: " . $stmt->error);
    }
    $stmt->close();
} else {
    // Opcional: echo "El grupo ya existe.<br>";
}

//
// ----- 7. ACTIVIDADES -----
// ------------------------------------------------------------------------------------------------------------------------------------//
// Función para verificar si ya existe una actividad con el mismo título y asociada al mismo grupo y plan
// ------------------------------------------------------------------------------------------------------------------------------------//
function actividadExiste($conn, $titulo, $id_grupo, $id_plan)
{
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM ACTIVIDADES WHERE titulo = ? AND id_grupo = ? AND id_plan = ?");
    $stmt->bind_param("sii", $titulo, $id_grupo, $id_plan);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $result['count'] > 0;
}

// Valores a insertar para una actividad
$titulo      = "Actividad Ejemplo";
$descripcion = "Descripción de la actividad ejemplo.";
$hora        = "10:00:00";
$hora_fin    = "12:00:00";
$dia         = "2025-10-05";
$id_grupo    = 1; // Debe existir en GRUPOS
$id_plan     = 1; // Debe existir en PLAN_FECHAS

// Insertar la actividad solo si no existe
if (!actividadExiste($conn, $titulo, $id_grupo, $id_plan)) {
    $stmt = $conn->prepare("INSERT INTO ACTIVIDADES (titulo, descripcion, hora, hora_fin, dia, id_grupo, id_plan) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $titulo, $descripcion, $hora, $hora_fin, $dia, $id_grupo, $id_plan);
    if (!$stmt->execute()) {
        error_log("Error al insertar Actividad: " . $stmt->error);
    }
    $stmt->close();
} else {
    // Opcional: echo "La actividad ya existe.<br>";
}
// ----- 8. NINOS -----
// ------------------------------------------------------------------------------------------------------------------------------------//
// Función para verificar si ya existe un niño con el mismo nombre y tutor
// ------------------------------------------------------------------------------------------------------------------------------------//
function ninoExiste($conn, $nombre, $id_tutor)
{
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM NINOS WHERE nombre = ? AND id_tutor = ?");
    $stmt->bind_param("si", $nombre, $id_tutor);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $result['count'] > 0;
}

// Valores a insertar en NINOS
$nombre_nino = "Niño Ejemplo";
$id_tutor    = 1; // Debe existir en TUTORES
$alergias    = "Ninguna";
$observaciones = "Ninguna";
$fecha_nacimiento = "2015-05-20";
$id_plan     = 1; // Debe existir en PLAN_FECHAS
$pagado      = true;
$avatar_src  = "avatar.png";

// Insertar el niño solo si no existe
if (!ninoExiste($conn, $nombre_nino, $id_tutor)) {
    $stmt = $conn->prepare("INSERT INTO NINOS (nombre, alergias, observaciones, fecha_nacimiento, id_tutor,  pagado, avatar_src) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssiis", $nombre_nino, $alergias, $observaciones, $fecha_nacimiento, $id_tutor, $pagado, $avatar_src);
    if (!$stmt->execute()) {
        error_log("Error al insertar Niño: " . $stmt->error);
    } else {
        echo "Niño insertado correctamente.<br>";
    }
    $stmt->close();
} else {
    // Opcional: echo "El niño ya existe.<br>";
}

// ----- 9. GRUPO_NINOS -----
// ------------------------------------------------------------------------------------------------------------------------------------//
// Función para verificar si ya existe una relación entre grupo y niño
// ------------------------------------------------------------------------------------------------------------------------------------//
function grupoNinoExiste($conn, $id_grupo, $id_nino)
{
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM GRUPO_NINOS WHERE id_grupo = ? AND id_nino = ?");
    $stmt->bind_param("ii", $id_grupo, $id_nino);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $result['count'] > 0;
}

// Valores a insertar en GRUPO_NINOS
$id_grupo = 1; // Debe existir en GRUPOS
$id_nino  = 1; // Debe existir en NINOS

// Insertar la relación solo si no existe
if (!grupoNinoExiste($conn, $id_grupo, $id_nino)) {
    $stmt = $conn->prepare("INSERT INTO GRUPO_NINOS (id_grupo, id_nino) VALUES (?, ?)");
    $stmt->bind_param("ii", $id_grupo, $id_nino);
    if (!$stmt->execute()) {
        error_log("Error al insertar relación Grupo-Niño: " . $stmt->error);
    } else {
        echo "Relación Grupo-Niño insertada correctamente.<br>";
    }
    $stmt->close();
} else {
    // Opcional: echo "La relación Grupo-Niño ya existe.<br>";
}


// ----- 10. PLAN_COMEDOR -----
// ------------------------------------------------------------------------------------------------------------------------------------//
// Función para verificar si ya existe un plan comedor con el mismo nombre, tutor y niño
// ------------------------------------------------------------------------------------------------------------------------------------//
// function planComedorExiste($conn, $nombre_plan, $id_tutor, $id_nino)
// {
//     $stmt = $conn->prepare("SELECT COUNT(*) as count FROM PLAN_COMEDOR WHERE nombre_plan = ? AND id_tutor = ? AND id_nino = ?");
//     $stmt->bind_param("sii", $nombre_plan, $id_tutor, $id_nino);
//     $stmt->execute();
//     $result = $stmt->get_result()->fetch_assoc();
//     $stmt->close();
//     return $result['count'] > 0;
// }

// // Valores a insertar en PLAN_COMEDOR
// $nombre_plan = "Plan Comedor Ejemplo";
// $id_tutor    = 1; // Debe existir en TUTORES
// $id_nino     = 1; // Debe existir en NINOS
// $descripcion = "Descripción del plan comedor ejemplo.";
// $precio      = 50.00;

// // Insertar el plan comedor solo si no existe
// if (!planComedorExiste($conn, $nombre_plan, $id_tutor, $id_nino)) {
//     $stmt = $conn->prepare("INSERT INTO PLAN_COMEDOR (nombre_plan, descripcion, precio, id_tutor, id_nino) VALUES (?, ?, ?, ?, ?)");
//     $stmt->bind_param("ssdii", $nombre_plan, $descripcion, $precio, $id_tutor, $id_nino);
//     if (!$stmt->execute()) {
//         error_log("Error al insertar Plan Comedor: " . $stmt->error);
//     }
//     $stmt->close();
// } else {
//     // Opcional: echo "El plan comedor ya existe.<br>";
// }
