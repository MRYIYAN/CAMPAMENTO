<?php
// servidor enviará estará en formato JSON
header('Content-Type: application/json');
require_once 'conexion.php';
// comprobacion de conexion
if ($conn->connect_error) {
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit();
}

session_start(); // Reanuda/recuperar la sesión que teníamos creada

//=========================================================================================================================
//                       COMPROBAR LOGIN Y EXTRAER EL ID 
//=========================================================================================================================
//el comprobar login tiene que estar arriba del todo, porque si cae en el condicion, se encia al js y se para todo
$login = "no";
//comprobar si ha logueado o no 
if (!isset($_SESSION["login"])){
    echo json_encode(['noLogin' => '../html/noLogeado.html']);
    exit(); //detenerse
}else{
    //comprobar si es perfil del admin o no 
    if ($_SESSION["tipo"] !== "ADMIN"){
        echo json_encode(['noLogin' => '../html/noLogeado.html']);
        exit();
    }else{
        $login= "ok"; 
    }
   
}
//comprobamos si recoge el id
if (!isset($_SESSION['id'])) {
    //en caso si no se recoge bien el id
    echo json_encode(['error' => 'No se encontró la sesión del usuario.']);
    exit();
}
//=========================================================================================================================
//                       FIN DE COMPROBAR LOGIN Y EXTRAER EL ID 
//=========================================================================================================================


// Obtener el contenido JSON de la solicitud POST
$data = json_decode(file_get_contents('php://input'), true);
//=========================================================================================================================
//                       CONSULTAS A BBDD 
//=========================================================================================================================

//---------------------------------------------------------------//
//SACAR TODO PLAN QUE EXISTE
//---------------------------------------------------------------//
$queryMonitores = $conn->prepare("SELECT * FROM monitores");
$queryMonitores->execute();   //ejecutar en bbdd
$result = $queryMonitores->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$monitoresDisponible = [];  // Creamos un array vacío para almacenar la información de los hijos
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $monitoresDisponible[] = $row;
}
//cerramos el conexion 
$queryMonitores->close();
//---------------------------------------------------------------//


//---------------------------------------------------------------//
//BORRAR UN MONITOR
//---------------------------------------------------------------//
if (isset($data['idNinoSeleccionaParaEliminar'])){
    
    //eliminamos la relacion que tiene con el gruponino
    $queryEliminarGrupoMonitor = $conn->prepare("DELETE FROM ACTIVIDADES WHERE id_grupo IN (SELECT id_grupo FROM GRUPOS WHERE id_monitor = ?);");
    $queryEliminarGrupoMonitor->bind_param("i", $data['idNinoSeleccionaParaEliminar']);
    $queryEliminarGrupoMonitor->execute();   //ejecutar en bbdd

    //eliminamos la relacion que tiene con el grupo
    $queryEliminarGrupos = $conn->prepare("DELETE FROM GRUPOS WHERE id_monitor = ?;");
    $queryEliminarGrupos->bind_param("i", $data['idNinoSeleccionaParaEliminar']);
    $queryEliminarGrupos->execute();   //ejecutar en bbdd

    //eliminamos el nino
    $queryEliminarMonitor = $conn->prepare("DELETE FROM MONITORES WHERE id_monitor = ?; ");
    $queryEliminarMonitor->bind_param("i", $data['idNinoSeleccionaParaEliminar']);
    if ($queryEliminarMonitor->execute()) { //comprobamos la ejecucion
        //comprobamos si se ha creado o no 
        if ($queryEliminarMonitor->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            //en caso de si 
            echo json_encode(['eliminadoMonitor' => 'ok']);
            $queryEliminarMonitor->close();
            exit();
        } else {
            //en caso de no 
            echo json_encode(['eliminadoMonitor' => 'noOk']);
            $queryEliminarMonitor->close();
            exit();
        }
    }
}
//---------------------------------------------------------------//


//---------------------------------------------------------------//
//CAMBAIR LA CONTRASEÑA
//---------------------------------------------------------------//
if(isset($data['contraseñaParaCambiar2']) && $data['idMonitorCambiarContrasenia']){
    $contraseniaHasheada = password_hash($data['contraseñaParaCambiar2'], PASSWORD_DEFAULT);
     //insertamos la contraseña en bbdd
     $queryCambiarContrasenia = $conn->prepare("UPDATE monitores SET contrasenia = ? WHERE id_monitor = ?");
     $queryCambiarContrasenia->bind_param("si", $contraseniaHasheada, $data['idMonitorCambiarContrasenia']);
     if ($queryCambiarContrasenia->execute()) { //comprobamos la ejecucion
         //comprobamos si se ha creado o no 
         if ($queryCambiarContrasenia->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
             //en caso de si 
             echo json_encode(['contraseniaMonitorCambiado' => 'ok']);
             $queryCambiarContrasenia->close();
             exit();
         } else {
             //en caso de no 
             echo json_encode(['contraseniaMonitorCambiado' => 'noOk']);
             $queryCambiarContrasenia->close();
             exit();
         }
     }
}


//---------------------------------------------------------------//




//---------------------------------------------------------------//
//AUTORELLENO PARA MODIFICAR MONITOR
//---------------------------------------------------------------//
if(isset($data['consultaAtorellenoModificarMonitor'])){
     //SACAR EL FECHA DE INICIO Y FIN DE UN ACTIVIDAD EN UN PLAN 
    $queryAutorelleno = $conn->prepare("SELECT * FROM monitores WHERE id_monitor = ?");
    $queryAutorelleno->bind_param("i", $data['consultaAtorellenoModificarMonitor']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryAutorelleno->execute();   //ejecutar en bbdd
    $result = $queryAutorelleno->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $autoRelleno = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryAutorelleno->close();
    //enviamos el solucion
    echo json_encode(['autoRelleno' => $autoRelleno]);
    exit();
}
   
//---------------------------------------------------------------//




//---------------------------------------------------------------//
//ACTUALIZACION DE DATOS DEL MONITOR
//---------------------------------------------------------------//
if(isset($data['nombreCambiado']) && isset($data['definicionCambiado']) && isset($data['idMonitorParaActualizarDato'])){
    //SACAR EL FECHA DE INICIO Y FIN DE UN ACTIVIDAD EN UN PLAN 
   $queryActualizarDatosMonitor = $conn->prepare("UPDATE monitores SET nombre = ?, descripcion = ? WHERE id_monitor = ?");
   $queryActualizarDatosMonitor->bind_param("ssi", $data['nombreCambiado'], $data['definicionCambiado'], $data['idMonitorParaActualizarDato']);    //asignamos el valor de ?, es un i porque es un numero(integer)
   if ($queryActualizarDatosMonitor->execute()) { //comprobamos la ejecucion
    //comprobamos si se ha creado o no 
    if ($queryActualizarDatosMonitor->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
        //en caso de si 
        echo json_encode(['actualizacionDatosMonitor' => 'ok']);
        $queryActualizarDatosMonitor->close();
        exit();
    } else {
        //en caso de no 
        echo json_encode(['actualizacionDatosMonitor' => 'noOk']);
        $queryActualizarDatosMonitor->close();
        exit();
    }
}
}
  
//---------------------------------------------------------------//


//---------------------------------------------------------------//
//INSERTAR DE DATOS DEL MONITOR (CREAR MONITOR)
//---------------------------------------------------------------//
if(isset($data['crearNombre']) && isset($data['crearEmail']) && isset($data['crearDescripcion']) && isset($data['crearContrasenia'])){
    $contraseniaHasheadaCrear = password_hash($data['crearContrasenia'], PASSWORD_DEFAULT);
    $defaultAvatar = '../assets/img/avatar.png';
   $queryCrearMonitor = $conn->prepare("INSERT INTO monitores (nombre, email, contrasenia, descripcion, avatar_src) VALUES (?, ?, ?, ?, ?)");
   $queryCrearMonitor->bind_param("sssss", $data['crearNombre'], $data['crearEmail'], $contraseniaHasheadaCrear, $data['crearDescripcion'], $defaultAvatar);    //asignamos el valor de ?, es un i porque es un numero(integer)
   if ($queryCrearMonitor->execute()) { //comprobamos la ejecucion
    //comprobamos si se ha creado o no 
    if ($queryCrearMonitor->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
        //en caso de si 
        echo json_encode(['crearMonitor' => 'ok']);
        $queryCrearMonitor->close();
        exit();
    } else {
        //en caso de no 
        echo json_encode(['crearMonitor' => 'noOk']);
        $queryCrearMonitor->close();
        exit();
    }
}
}
  
//---------------------------------------------------------------//




//=========================================================================================================================
//                       ENVIO DE DATOS
//=========================================================================================================================
//enviar el json a js
echo json_encode([
    'login' => $login,
    'id_admin' => $_SESSION['id'],
    'monitoresDisponible' => $monitoresDisponible
]);
