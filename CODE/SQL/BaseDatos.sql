-- Crear la base de datos (sin comillas en el nombre)
CREATE DATABASE IF NOT EXISTS CAMPAMENTO;

-- Seleccionar la base de datos creada
USE CAMPAMENTO;

-- Crear tabla TUTORES (se utiliza "email" en lugar de "correo")
CREATE TABLE IF NOT EXISTS TUTORES (
    id_tutor INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(50) NOT NULL,
    dni VARCHAR(9) NOT NULL,
    telefono VARCHAR(9) NOT NULL, 
    email VARCHAR(50) NOT NULL,
    contrasenia VARCHAR(50) NOT NULL
); 

-- Crear tabla NINOS
CREATE TABLE IF NOT EXISTS NINOS (
    id_nino INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(50) NOT NULL,
    alergias VARCHAR(255),
    observacion VARCHAR(255),
    fecha_nacimiento DATE NOT NULL,
    id_tutor INT NOT NULL,
    FOREIGN KEY (id_tutor) REFERENCES TUTORES(id_tutor)
);
    
-- Crear tabla MONITORES (se utiliza "email" en lugar de "correo")
CREATE TABLE IF NOT EXISTS MONITORES (
    id_monitor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    contrasenia VARCHAR(50) NOT NULL
);

-- Crear tabla GRUPOS
CREATE TABLE IF NOT EXISTS GRUPOS (
    id_grupo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    id_monitor INT NOT NULL,
    id_nino INT NOT NULL,
    FOREIGN KEY (id_monitor) REFERENCES MONITORES(id_monitor),
    FOREIGN KEY (id_nino) REFERENCES NINOS(id_nino)
);

-- Crear tabla ACTIVIDADES
CREATE TABLE IF NOT EXISTS ACTIVIDADES (
    id_actividad INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    hora TIME NOT NULL,
    id_grupo INT NOT NULL,
    FOREIGN KEY (id_grupo) REFERENCES GRUPOS(id_grupo)
);

-- Crear tabla ADMIN (se utiliza "email" en lugar de "correo")
CREATE TABLE IF NOT EXISTS ADMIN (
    id_admin INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    contrasenia VARCHAR(50) NOT NULL
);

-- Insertar datos de prueba en TUTORES, si no existen ya
INSERT INTO TUTORES (nombre, dni, telefono, email, contrasenia)
SELECT 'Padre Ejemplo', '12345678A', '123456789', 'padre@ejemplo.com', '1234567'
WHERE NOT EXISTS (SELECT 1 FROM TUTORES WHERE email = 'padre@ejemplo.com');

-- Insertar datos de prueba en MONITORES, si no existen ya
INSERT INTO MONITORES (nombre, email, contrasenia)
SELECT 'Monitor Ejemplo', 'monitor@ejemplo.com', '1234567'
WHERE NOT EXISTS (SELECT 1 FROM MONITORES WHERE email = 'monitor@ejemplo.com');

-- Insertar datos de prueba en ADMIN, si no existen ya
INSERT INTO ADMIN (email, contrasenia)
SELECT 'admin@ejemplo.com', 'admin1234'
WHERE NOT EXISTS (SELECT 1 FROM ADMIN WHERE email = 'admin@ejemplo.com');
