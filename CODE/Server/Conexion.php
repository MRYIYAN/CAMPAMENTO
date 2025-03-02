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

$sql_check = "SHOW DATABASES LIKE '$dbname'";
$result = $conn->query($sql_check);

if ($result->num_rows == 0) {
    
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
    asistencia DATE NOT NULL,
    inasistencia DATE NOT NULL,
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

    CREATE TABLE IF NOT EXISTS MENSAJES (
    id_mensaje INT PRIMARY KEY AUTO_INCREMENT,
    id_tutor INT NOT NULL,
    id_monitor INT NOT NULL,
    mensaje TEXT NOT NULL,
    enviado_por ENUM('tutor', 'monitor') NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tutor) REFERENCES TUTORES(id_tutor) ON DELETE CASCADE,
    FOREIGN KEY (id_monitor) REFERENCES MONITORES(id_monitor) ON DELETE CASCADE

);
-- Admin 
INSERT IGNORE INTO ADMIN (email, contrasenia) 
VALUES ('admin@ejemplo.com', '\$2y\$10\$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu');



-- Inserción en la tabla PLAN_FECHAS
INSERT INTO PLAN_FECHAS (nombre, fecha_inicio, fecha_fin, fecha_maxInscripcion, hora_maximaInscripcion, precio, definicion)
VALUES
('Campamento de Verano 2025', '2025-06-01', '2025-07-31', '2025-05-15', '23:59:00', '100.00', 'Campamento de verano con actividades de deporte y naturaleza.'),
('Campamento de Invierno 2025', '2025-12-01', '2025-12-20', '2025-11-15', '23:59:00', '120.00', 'Campamento de invierno con actividades de esquí y aventuras en la nieve.'),
('Campamento Infantil 2025', '2025-06-10', '2025-06-20', '2025-06-01', '23:59:00', '80.00', 'Campamento para niños con actividades de arte, deportes y juegos.'),
('Campamento Aventura 2025', '2025-07-10', '2025-08-10', '2025-06-25', '23:59:00', '150.00', 'Campamento de aventura con excursiones y deportes extremos.');

-- Inserción en la tabla TUTORES
INSERT INTO TUTORES (nombre, dni, telefono, email, contrasenia, avatar_src)
VALUES
('Juan Pérez', '12345678A', '612345678', 'tutor@ejemplo.com', '\$2y\$10\$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu', 'avatar1.jpg'),
('Laura García', '23456789B', '612345679', 'laura@tutor.com', '\$2y\$10\$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu', 'avatar2.jpg'),
('Pedro Martínez', '34567890C', '612345680', 'pedro@tutor.com', '\$2y\$10\$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu', 'avatar3.jpg'),
('Maria Rodríguez', '45678901D', '612345681', 'maria@tutor.com', '\$2y\$10\$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu', 'avatar4.jpg');

-- Inserción en la tabla PLAN_COMEDOR
INSERT INTO PLAN_COMEDOR (nombre_plan, descripcion, precio, imagenComida_src)
VALUES
('Plan Comedor Básico', 'Comida sencilla y saludable.', 15.00, 'comida_basica.jpg'),
('Plan Comedor Premium', 'Comida gourmet con opciones veganas.', 25.00, 'comida_premium.jpg'),
('Plan Comedor Normal ', 'Comida gourmet con opciones veganas.', 25.00, 'comida_premium.jpg');

-- Inserción en la tabla NINOS
INSERT INTO NINOS (nombre, alergias, observaciones, fecha_nacimiento, id_tutor, pagado, avatar_src, asistencia, inasistencia)
VALUES
('Carlos', 'Ninguna', 'Le gusta el fútbol.', '2015-05-15', 1, TRUE, 'avatar1.jpg', '2025-06-01', '2025-06-02'),
('Ana', 'Gluten', 'Muy sociable y creativa.', '2014-07-20', 1, TRUE, 'avatar2.jpg', '2025-06-01', '2025-06-02'),
('Pedro', 'Ninguna', 'Muy activo, le encanta nadar.', '2014-03-10', 2, TRUE, 'avatar3.jpg', '2025-06-01', '2025-06-02'),
('Lucía', 'Frutos secos', 'Amante de la naturaleza.', '2014-12-05', 2, TRUE, 'avatar4.jpg', '2025-06-01', '2025-06-02'),
('Raúl', 'Ninguna', 'Fanático de los deportes extremos.', '2015-02-10', 3, TRUE, 'avatar5.jpg', '2025-06-01', '2025-06-02'),
('María', 'Lactosa', 'Estudia danza, muy enérgica.', '2015-08-14', 3, TRUE, 'avatar6.jpg', '2025-06-01', '2025-06-02'),
('José', 'Ninguna', 'Muy curioso y ama los animales.', '2015-10-25', 4, TRUE, 'avatar7.jpg', '2025-06-01', '2025-06-02'),
('Elena', 'Arachide', 'Le gusta pintar y las actividades creativas.', '2014-01-18', 4, TRUE, 'avatar8.jpg', '2025-06-01', '2025-06-02');

-- Inserción en la tabla MONITORES
INSERT INTO MONITORES (nombre, email, contrasenia, descripcion, avatar_src)
VALUES
('Monitor Juan', 'monitor@ejemplo.com', '\$2y\$10\$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu', 'Monitor con experiencia en deportes y actividades al aire libre.', 'juan.jpg'),
('Monitor Laura', 'laura@campamento.com', '\$2y\$10\$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu', 'Experta en actividades acuáticas y juegos para niños.', 'laura.jpg'),
('Monitor Pedro', 'pedro@campamento.com', '\$2y\$10\$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu', 'Monitor con formación en actividades de montaña y senderismo.', 'pedro.jpg'),
('Monitor Maria', 'maria@campamento.com', '\$2y\$10\$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu', 'Monitor apasionada por las manualidades y actividades creativas.', 'maria.jpg');

-- Inserción en la tabla GRUPOS
INSERT INTO GRUPOS (nombre, id_monitor)
VALUES
('Grupo A', 1), 
('Grupo B', 2), 
('Grupo C', 3), 
('Grupo D', 4);

-- Inserción en la tabla GRUPO_NINOS
INSERT INTO GRUPO_NINOS (id_grupo, id_nino)
VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(4, 7),
(4, 8);

-- Inserción en la tabla PLAN_NINOS
INSERT INTO PLAN_NINOS (id_plan, id_nino)
VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(4, 7),
(4, 8);

-- Inserción en la tabla ACTIVIDADES
INSERT INTO ACTIVIDADES (titulo, descripcion, hora, hora_fin, dia, id_grupo, id_plan, imagen_src)
VALUES
-- Actividades para el Grupo A y el Plan 1 (Campamento de Verano 2025)
('Torneo de Futbol', 'Torneo de futbol entre grupos.', '10:00:00', '12:00:00', '2025-06-01', 1, 1, 'futbol.jpg'),
('Taller de Pintura', 'Taller creativo para pintar cuadros.', '14:00:00', '16:00:00', '2025-06-01', 1, 1, 'pintura.jpg'),
('Caminata por el Bosque', 'Caminata guiada por el bosque cercano.', '10:00:00', '12:00:00', '2025-06-02', 1, 1, 'bosque.jpg'),
('Torneo de Baile', 'Competencia de baile grupal.', '15:00:00', '17:00:00', '2025-06-02', 1, 1, 'baile.jpg'),
('Búsqueda del Tesoro', 'Búsqueda de objetos escondidos en el campamento.', '10:00:00', '12:00:00', '2025-06-03', 1, 1, 'tesoro.jpg'),

-- Actividades para el Grupo B y el Plan 2 (Campamento de Invierno 2025)
('Esquí en Nieve', 'Actividades de esquí en la estación de montaña.', '09:00:00', '12:00:00', '2025-12-01', 2, 2, 'esqui.jpg'),
('Construcción de Muñecos de Nieve', 'Taller de creación de muñecos de nieve.', '14:00:00', '16:00:00', '2025-12-01', 2, 2, 'muñecos.jpg'),
('Torneo de Hockey', 'Competencia de hockey sobre hielo.', '10:00:00', '12:00:00', '2025-12-02', 2, 2, 'hockey.jpg'),
('Cine en la Nieve', 'Película en el refugio con chocolate caliente.', '18:00:00', '20:00:00', '2025-12-02', 2, 2, 'cine_nieve.jpg'),
('Caminata por la Montaña', 'Caminata guiada por la montaña nevada.', '10:00:00', '12:00:00', '2025-12-03', 2, 2, 'montaña.jpg'),

-- Actividades para el Grupo C y el Plan 3 (Campamento Infantil 2025)
('Taller de Manualidades', 'Creación de objetos con material reciclado.', '10:00:00', '12:00:00', '2025-06-10', 3, 3, 'manualidades.jpg'),
('Fiesta de Disfraces', 'Fiesta para niños con disfraces temáticos.', '15:00:00', '17:00:00', '2025-06-10', 3, 3, 'disfraces.jpg'),
('Teatro de Marionetas', 'Representación de una obra de marionetas.', '14:00:00', '16:00:00', '2025-06-11', 3, 3, 'marionetas.jpg'),
('Juegos de Agua', 'Diversión con juegos acuáticos.', '10:00:00', '12:00:00', '2025-06-12', 3, 3, 'agua.jpg'),
('Cuentos y Relatos', 'Hora del cuento con narraciones interactivas.', '10:00:00', '12:00:00', '2025-06-13', 3, 3, 'cuentos.jpg');

-- Inserción en la tabla MENSAJES
INSERT INTO MENSAJES (id_tutor, id_monitor, mensaje, enviado_por, fecha)
VALUES
(1, 1, '¿Cómo va el progreso del campamento?', 'tutor', '2025-05-01 10:00:00'),
(2, 2, 'El niño está disfrutando mucho, gracias.', 'tutor', '2025-05-02 15:00:00'),
(3, 3, '¿Hay algún problema con la comida?', 'tutor', '2025-05-03 18:00:00'),
(4, 4, 'Todo está perfecto, los niños están muy felices.', 'tutor', '2025-05-04 20:00:00'),
(1, 1, 'Todo marcha bien, los niños están muy activos.', 'monitor', '2025-05-05 09:00:00');

";

$conn->multi_query($sql_tables);  // Se ejecuta la creación de todas las tablas
while ($conn->more_results() && $conn->next_result()) {
}  // Espera a que terminen todas las consultas



}else{
    $conn->select_db($dbname);
}





//----------------------------------------------------------------------------------------//
// Insertar datos de prueba usando consultas preparadas
//----------------------------------------------------------------------------------------//
// Función para verificar si un usuario ya existe
// function usuarioExiste($conn, $tabla, $email)
// {
//     $stmt = $conn->prepare("SELECT COUNT(*) as count FROM $tabla WHERE email = ?");
//     $stmt->bind_param("s", $email);
//     $stmt->execute();
//     $result = $stmt->get_result()->fetch_assoc();
//     $stmt->close();
//     // return $result['count'] > 0;
// }


// // ----- 1. MONITORES -----
// // ------------------------------------------------------------------------------------------------------------------------------------//
// // Funcion para crear datos en la tabla monitores con un id asignado ademas de su contraseña "hasheada".
// // ------------------------------------------------------------------------------------------------------------------------------------//
// if (!usuarioExiste($conn, "MONITORES", "monitor@ejemplo.com")) {
//     $stmt = $conn->prepare("INSERT INTO MONITORES (nombre, email, contrasenia, descripcion) VALUES (?, ?, ?, ?)");
//     $nombre = "Monitor Ejemplo";
//     $email = "monitor@ejemplo.com";
//     $hashed_password = '$2y$10$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu';
//     $descripcion = "Monitor de ejemplo para el campamento.";
//     $stmt->bind_param("ssss", $nombre, $email, $hashed_password, $descripcion);

//     if ($stmt->execute()) {
//         echo "Monitor insertado correctamente.<br>";
//     } else {
//         echo "Error al insertar Monitor: " . $stmt->error . "<br>";
//     }
//     $stmt->close();
// }

// // ----- 3. TUTORES -----
// // ------------------------------------------------------------------------------------------------------------------------------------//
// // Insertar Tutor si no existe en la base de datos. 
// // ------------------------------------------------------------------------------------------------------------------------------------//
// if (!usuarioExiste($conn, "TUTORES", "tutor@ejemplo.com")) {
//     $stmt = $conn->prepare("INSERT INTO TUTORES (nombre, dni, telefono, email, contrasenia) VALUES (?, ?, ?, ?, ?)");
//     $nombre = "Tutor Ejemplo";
//     $dni = "12345678A";
//     $telefono = "123456789";
//     $email = "tutor@ejemplo.com";
//     $tutor_hashed_password = '$2y$10$BdT7ajvlvw8G4ExY0CQ57ewHfT2ctoziqRgpYvoF4QA41uu0/VEgu';
//     $stmt->bind_param("sssss", $nombre, $dni, $telefono, $email, $tutor_hashed_password);

//     if ($stmt->execute()) {
//         echo "Tutor insertado correctamente.<br>";
//     } else {
//         echo "Error al insertar Tutor: " . $stmt->error . "<br>";
//     }
//     $stmt->close();
// }
// // ----- 4. ADMIN -----
// // ------------------------------------------------------------------------------------------------------------------------------------//
// // Insertar datos en ADMIN si no existe en la base de datos con una contraseña "hasheada".
// // ------------------------------------------------------------------------------------------------------------------------------------//
// if (!usuarioExiste($conn, "ADMIN", "admin@ejemplo.com")) {
//     $stmt = $conn->prepare("INSERT INTO ADMIN (email, contrasenia) VALUES (?, ?)");
//     $email = "admin@ejemplo.com";
//     $admin_hashed_password = '$2y$10$FPQ0ATriO3ybhUFxwS3O0.2yDubZGQ0KniiwvRRAB95dEFZ045IL.';
//     $stmt->bind_param("ss", $email, $admin_hashed_password);

//     if ($stmt->execute()) {
//         echo "Admin insertado correctamente.<br>";
//     } else {
//         echo "Error al insertar Admin: " . $stmt->error . "<br>";
//     }
//     $stmt->close();
// }

// // ----- 5. PLAN_FECHAS -----
// // ------------------------------------------------------------------------------------------------------------------------------------//
// // Función para verificar si ya existe un plan en base a fechas 
// // ------------------------------------------------------------------------------------------------------------------------------------//
// function planExiste($conn, $fecha_inicio, $fecha_fin)
// {
//     $stmt = $conn->prepare("SELECT COUNT(*) as count FROM PLAN_FECHAS WHERE fecha_inicio = ? AND fecha_fin = ?");
//     $stmt->bind_param("ss", $fecha_inicio, $fecha_fin);
//     $stmt->execute();
//     $result = $stmt->get_result()->fetch_assoc();
//     $stmt->close();
//     // return $result['count'] > 0;
// }

// // Valores a insertar en PLAN_FECHAS
// $fecha_inicio           = "2025-06-01";
// $fecha_fin              = "2025-06-15";
// $fecha_maxInscripcion   = "2025-05-25";
// $hora_maximaInscripcion = "18:00:00";
// $precio                 = "100.00";
// $definicion             = "Campamento de verano para niños de 6 a 12 años.";

// // Insertar el plan solo si no existe
// if (!planExiste($conn, $fecha_inicio, $fecha_fin)) {
//     $stmt = $conn->prepare("INSERT INTO PLAN_FECHAS (fecha_inicio, fecha_fin, fecha_maxInscripcion, hora_maximaInscripcion, precio, definicion) VALUES (?, ?, ?, ?, ?, ?)");
//     $stmt->bind_param("ssssss", $fecha_inicio, $fecha_fin, $fecha_maxInscripcion, $hora_maximaInscripcion, $precio, $definicion);
//     if (!$stmt->execute()) {
//         error_log("Error al insertar Plan: " . $stmt->error);
//     }
//     $stmt->close();
// } else {
//     // Opcional: echo "El plan ya existe.<br>"; USAMOS AJAX Y AL ESPERAR JSON EL ECHO ROMPE LA ESTRUCUTRA
// }


// // ----- 6. GRUPOS -----
// // ------------------------------------------------------------------------------------------------------------------------------------//
// // Función para verificar si ya existe un grupo con un nombre dado y un monitor asignado
// // ------------------------------------------------------------------------------------------------------------------------------------//
// function grupoExiste($conn, $nombre_grupo, $id_monitor)
// {
//     $stmt = $conn->prepare("SELECT COUNT(*) as count FROM GRUPOS WHERE nombre = ? AND id_monitor = ?");
//     $stmt->bind_param("si", $nombre_grupo, $id_monitor);
//     $stmt->execute();
//     $result = $stmt->get_result()->fetch_assoc();
//     $stmt->close();
//     // return $result['count'] > 0;
// }

// // Valores a insertar en GRUPOS
// $nombre_grupo = "Grupo Ejemplo";
// $id_monitor   = 1; // Asegúrate de que este ID exista en la tabla MONITORES

// // Insertar el grupo solo si no existe
// if (!grupoExiste($conn, $nombre_grupo, $id_monitor)) {
//     $stmt = $conn->prepare("INSERT INTO GRUPOS (nombre, id_monitor) VALUES (?, ?)");
//     $stmt->bind_param("si", $nombre_grupo, $id_monitor);
//     if (!$stmt->execute()) {
//         error_log("Error al insertar Grupo: " . $stmt->error);
//     }
//     $stmt->close();
// } else {
//     // Opcional: echo "El grupo ya existe.<br>";
// }

// //
// // ----- 7. ACTIVIDADES -----
// // ------------------------------------------------------------------------------------------------------------------------------------//
// // Función para verificar si ya existe una actividad con el mismo título y asociada al mismo grupo y plan
// // ------------------------------------------------------------------------------------------------------------------------------------//
// function actividadExiste($conn, $titulo, $id_grupo, $id_plan)
// {
//     $stmt = $conn->prepare("SELECT COUNT(*) as count FROM ACTIVIDADES WHERE titulo = ? AND id_grupo = ? AND id_plan = ?");
//     $stmt->bind_param("sii", $titulo, $id_grupo, $id_plan);
//     $stmt->execute();
//     $result = $stmt->get_result()->fetch_assoc();
//     $stmt->close();
//     // return $result['count'] > 0;
// }

// // Valores a insertar para una actividad
// $titulo      = "Actividad Ejemplo";
// $descripcion = "Descripción de la actividad ejemplo.";
// $hora        = "10:00:00";
// $hora_fin    = "12:00:00";
// $dia         = "2025-10-05";
// $id_grupo    = 1; // Debe existir en GRUPOS
// $id_plan     = 1; // Debe existir en PLAN_FECHAS

// // Insertar la actividad solo si no existe
// if (!actividadExiste($conn, $titulo, $id_grupo, $id_plan)) {
//     $stmt = $conn->prepare("INSERT INTO ACTIVIDADES (titulo, descripcion, hora, hora_fin, dia, id_grupo, id_plan) VALUES (?, ?, ?, ?, ?, ?, ?)");
//     $stmt->bind_param("sssssss", $titulo, $descripcion, $hora, $hora_fin, $dia, $id_grupo, $id_plan);
//     if (!$stmt->execute()) {
//         error_log("Error al insertar Actividad: " . $stmt->error);
//     }
//     $stmt->close();
// } else {
//     // Opcional: echo "La actividad ya existe.<br>";
// }
// // ----- 8. NINOS -----
// // ------------------------------------------------------------------------------------------------------------------------------------//
// // Función para verificar si ya existe un niño con el mismo nombre y tutor
// // ------------------------------------------------------------------------------------------------------------------------------------//
// function ninoExiste($conn, $nombre, $id_tutor)
// {
//     $stmt = $conn->prepare("SELECT COUNT(*) as count FROM NINOS WHERE nombre = ? AND id_tutor = ?");
//     $stmt->bind_param("si", $nombre, $id_tutor);
//     $stmt->execute();
//     $result = $stmt->get_result()->fetch_assoc();
//     $stmt->close();
//     // return $result['count'] > 0;
// }

// // Valores a insertar en NINOS
// $nombre_nino = "Niño Ejemplo";
// $id_tutor    = 1; // Debe existir en TUTORES
// $alergias    = "Ninguna";
// $observaciones = "Ninguna";
// $fecha_nacimiento = "2015-05-20";
// $id_plan     = 1; // Debe existir en PLAN_FECHAS
// $pagado      = true;
// $avatar_src  = "avatar.png";

// // Insertar el niño solo si no existe
// if (!ninoExiste($conn, $nombre_nino, $id_tutor)) {
//     $stmt = $conn->prepare("INSERT INTO NINOS (nombre, alergias, observaciones, fecha_nacimiento, id_tutor,  pagado, avatar_src) VALUES (?, ?, ?, ?, ?, ?, ?)");
//     $stmt->bind_param("ssssiis", $nombre_nino, $alergias, $observaciones, $fecha_nacimiento, $id_tutor, $pagado, $avatar_src);
//     if (!$stmt->execute()) {
//         error_log("Error al insertar Niño: " . $stmt->error);
//     } else {
//         echo "Niño insertado correctamente.<br>";
//     }
//     $stmt->close();
// } else {
//     // Opcional: echo "El niño ya existe.<br>";
// }

// // ----- 9. GRUPO_NINOS -----
// // ------------------------------------------------------------------------------------------------------------------------------------//
// // Función para verificar si ya existe una relación entre grupo y niño
// // ------------------------------------------------------------------------------------------------------------------------------------//
// function grupoNinoExiste($conn, $id_grupo, $id_nino)
// {
//     $stmt = $conn->prepare("SELECT COUNT(*) as count FROM GRUPO_NINOS WHERE id_grupo = ? AND id_nino = ?");
//     $stmt->bind_param("ii", $id_grupo, $id_nino);
//     $stmt->execute();
//     $result = $stmt->get_result()->fetch_assoc();
//     $stmt->close();
//     // return $result['count'] > 0;
// }

// // Valores a insertar en GRUPO_NINOS
// $id_grupo = 1; // Debe existir en GRUPOS
// $id_nino  = 1; // Debe existir en NINOS

// // Insertar la relación solo si no existe
// if (!grupoNinoExiste($conn, $id_grupo, $id_nino)) {
//     $stmt = $conn->prepare("INSERT INTO GRUPO_NINOS (id_grupo, id_nino) VALUES (?, ?)");
//     $stmt->bind_param("ii", $id_grupo, $id_nino);
//     if (!$stmt->execute()) {
//         error_log("Error al insertar relación Grupo-Niño: " . $stmt->error);
//     } else {
//         echo "Relación Grupo-Niño insertada correctamente.<br>";
//     }
//     $stmt->close();
// } else {
//     // Opcional: echo "La relación Grupo-Niño ya existe.<br>";
// }


// // ----- 10. PLAN_COMEDOR -----
// // ------------------------------------------------------------------------------------------------------------------------------------//
// // Función para verificar si ya existe un plan comedor con el mismo nombre, tutor y niño
// // ------------------------------------------------------------------------------------------------------------------------------------//
// function planComedorExiste($conn, $nombre_plan, $descripcion, $precio, $imagenComida_src)
// {
//     $stmt = $conn->prepare("SELECT COUNT(*) as count FROM PLAN_COMEDOR WHERE nombre_plan = ? AND descripcion = ? AND precio = ? AND imagenComida_src = ?");
//     $stmt->bind_param("ssss", $nombre_plan, $descripcion, $precio, $imagenComida_src);
//     $stmt->execute();
//     $result = $stmt->get_result()->fetch_assoc();
//     $stmt->close();
//     return $result['count'] > 0;
// }

// // Valores a insertar en PLAN_COMEDOR
// $nombre_plan = "Pollo Asado";
// $descripcion = "Descripción del plan comedor ejemplo.";
// $precio = 99.00;
// $imagenComida_src = "../assets/comida/uploads/defaultPlanComida.png";

// // Insertar el plan comedor solo si no existe
// if (!planComedorExiste($conn, $nombre_plan, $descripcion, $precio, $imagenComida_src)) {
//     $stmt = $conn->prepare("INSERT INTO PLAN_COMEDOR (nombre_plan, descripcion, precio, imagenComida_src) VALUES (?, ?, ?, ?)");
//     $stmt->bind_param("ssds", $nombre_plan, $descripcion, $precio, $imagenComida_src);
//     if (!$stmt->execute()) {
//         error_log("Error al insertar Plan Comedor: " . $stmt->error);
//     }
//     $stmt->close();
// } else {
//     // echo "El plan comedor ya existe.<br>";
// }

