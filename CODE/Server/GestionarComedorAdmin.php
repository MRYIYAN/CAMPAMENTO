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


//=========================================================================================================================
//                       INSERT PLAN DE COMIDA A BBDD 
//=========================================================================================================================
if (isset($_POST['nombreComida']) && isset($_POST['descripcionComida']) && isset($_POST['precioComida'])){
    //ASIGNACION DE NUEVO FOTO DE FONDE EN ACTIVIDADES 
    //definimos donde queremos que se guarde el archivo
    $directorio_subida_foto = "../assets/comida/uploads/";
    //comprobar si hemos asignado el avatar y si hay algun error
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0 && $_POST['cambiarfoto'] == true){    //aqui comprobamos si hay que cambiar el avatar

        $name_foto = $_FILES['foto']['name'];  //sacamos el nombre del archivo
        //sacamos los informaciones del archivo segun su nombre
        $array_foto = pathinfo($name_foto);

        //sacamos la ruta antigua del avatar
        $ruta_antiguo_foto = $_FILES['foto']['tmp_name'];

        //sacamos la ruta que tiene que estrar en uploads
        $ruta_destino_foto= $directorio_subida_foto . $name_foto;

        //movemos
        move_uploaded_file($ruta_antiguo_foto, $ruta_destino_foto);
        $rutaFoto = $ruta_destino_foto;
    }else{
        //en caso de no cambiar el foto se usa la ruta que ya esta en bbdd/ la que se paso en bbdd si no quiere cambiar el foto
        $rutaFoto = $_POST['fondoComida'];
    }

    $queryInsertarPlanComida = $conn->prepare("INSERT INTO plan_comedor (nombre_plan, descripcion, precio, imagenComida_src) VALUES (?, ?, ?, ?)");
    $queryInsertarPlanComida->bind_param("ssss",  $_POST['nombreComida'], $_POST['descripcionComida'], $_POST['precioComida'], $rutaFoto);
    if ($queryInsertarPlanComida->execute()) { //comprobamos la ejecucion
        if ($queryInsertarPlanComida->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['creadoPlanComida' => 'ok']);
            $queryInsertarPlanComida->close();   
            exit();
        } else {
            echo json_encode(['creadoPlanComida' => 'noOk']);
            $queryInsertarPlanComida->close();   
            exit();
    
        }
    }else{
        echo json_encode(['creadoPlanComida' => 'noOk']);
        $queryInsertarPlanComida->close();   
        exit();
    }

    
}
//=========================================================================================================================
//                       FIN DE INSERT PLAN DE COMIDA A BBDD 
//=========================================================================================================================


//=========================================================================================================================
//                       MOSTRAR TARJETAS DE PLAN DE DOMIDA DEL BBDD
//=========================================================================================================================
// Consulta para obtener los datos de PLAN_COMEDOR
$queryPlanComida = $conn->prepare("SELECT * FROM plan_comedor");
$queryPlanComida->execute();   //ejecutar en bbdd
$result = $queryPlanComida->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$planComidasDisponible = [];  // Creamos un array vacío para almacenar la información de los hijos
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $planComidasDisponible[] = $row;
}
//cerramos el conexion 
$queryPlanComida->close();
//=========================================================================================================================
//                       FIN MOSTRAR TARJETAS DE PLAN DE DOMIDA DEL BBDD
//=========================================================================================================================


//=========================================================================================================================
//                      ELIMINAR PLAN DE COMIDA EN BBDD
//=========================================================================================================================
if (isset($data['id_planComida_paraEliminar'])){
    $queryEliminarPlanComida = $conn->prepare("DELETE FROM plan_comedor WHERE id_plan_comedor = ?");
    $queryEliminarPlanComida->bind_param("i", $data['id_planComida_paraEliminar'] );
    if ($queryEliminarPlanComida->execute()) { //comprobamos la ejecucion
        if ($queryEliminarPlanComida->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['borrarPlanComida' => 'ok']);
            $queryEliminarPlanComida->close();   
            exit();
        } else {
            echo json_encode(['borrarPlanComida' => 'noOk']);
            $queryEliminarPlanComida->close();   
            exit();
    
        }
    }else{
        echo json_encode(['borrarPlanComida' => 'noOk']);
        $queryEliminarPlanComida->close();   
        exit();
    }
}
//=========================================================================================================================
//                      FIN DE ELIMINAR PLAN DE COMIDA EN BBDD
//=========================================================================================================================


//=========================================================================================================================
//                      SACAR DATO PARA EL AUTORELLENO PARA MODIFICAR
//=========================================================================================================================
if(isset($data['id_planComida_paraRellenardedeBBDD'])){
    $queryPlanComidabbdd = $conn->prepare("SELECT * FROM plan_comedor WHERE id_plan_comedor = ?");
    $queryPlanComidabbdd->bind_param("i", $data['id_planComida_paraRellenardedeBBDD'] );
    $queryPlanComidabbdd->execute();   //ejecutar en bbdd
    $result = $queryPlanComidabbdd->get_result();  //recoge el resultado de la consulta 
    // Comprobamos si hay resultados
    $planComidabbdd = [];  // Creamos un array vacío para almacenar la información de los hijos
    while ($row = $result->fetch_assoc()) {
        // Añadimos cada hijo al array
        $planComidabbdd[] = $row;
    }
    //cerramos el conexion 
    echo json_encode(['planComidabbdd' => $planComidabbdd[0]]);
    $queryPlanComidabbdd->close();
    exit();
    
}
//=========================================================================================================================
//                      FIN SACAR DATO PARA EL AUTORELLENO PARA MODIFICAR
//=========================================================================================================================


//=========================================================================================================================
//                       MODIFICAR PLAN DE COMIDA A BBDD 
//=========================================================================================================================
if (isset($_POST['nombreComidaModificar']) && isset($_POST['descripcionComidaModificar']) && isset($_POST['precioComidaModificar']) && isset($_POST['id_planComidaParaModificar'])){
    //ASIGNACION DE NUEVO FOTO DE FONDE EN ACTIVIDADES 
    //definimos donde queremos que se guarde el archivo
    $directorio_subida_fotoMod = "../assets/comida/uploads/";
    //comprobar si hemos asignado el avatar y si hay algun error
    if (isset($_FILES['fotoMod']) && $_FILES['fotoMod']['error'] == 0 && $_POST['cambiarfotoMod'] == true){    //aqui comprobamos si hay que cambiar el avatar

        $name_fotoMod = $_FILES['fotoMod']['name'];  //sacamos el nombre del archivo
        //sacamos los informaciones del archivo segun su nombre
        $array_fotoMod = pathinfo($name_fotoMod);

        //sacamos la ruta antigua del avatar
        $ruta_antiguo_fotoMod = $_FILES['fotoMod']['tmp_name'];

        //sacamos la ruta que tiene que estrar en uploads
        $ruta_destino_fotoMod= $directorio_subida_fotoMod . $name_fotoMod;

        //movemos
        move_uploaded_file($ruta_antiguo_fotoMod, $ruta_destino_fotoMod);
        $rutaFotoMod = $ruta_destino_fotoMod;
    }else{
        //en caso de no cambiar el foto se usa la ruta que ya esta en bbdd/ la que se paso en bbdd si no quiere cambiar el foto
        $rutaFotoMod = $_POST['fondoComidaMod'];
    }

    $queryModificarPlanComida = $conn->prepare("UPDATE PLAN_COMEDOR 
                                                SET nombre_plan = ?, 
                                                    descripcion = ?, 
                                                    precio = ?, 
                                                    imagenComida_src = ? 
                                                WHERE id_plan_comedor = ?;
                                                ");
    $queryModificarPlanComida->bind_param("sssss",  $_POST['nombreComidaModificar'], $_POST['descripcionComidaModificar'], $_POST['precioComidaModificar'], $rutaFotoMod, $_POST['id_planComidaParaModificar']);
    if ($queryModificarPlanComida->execute()) { //comprobamos la ejecucion
        if ($queryModificarPlanComida->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['modificarPlanComida' => 'ok']);
            $queryModificarPlanComida->close();   
            exit();
        } else {
            echo json_encode(['modificarPlanComida' => 'noOk']);
            $queryModificarPlanComida->close();   
            exit();
    
        }
    }else{
        echo json_encode(['modificarPlanComida' => 'noOk']);
        $queryModificarPlanComida->close();   
        exit();
    }

    
}
//=========================================================================================================================
//                       FIN DE MODIFICAR PLAN DE COMIDA A BBDD 
//=========================================================================================================================








//=========================================================================================================================
//                       ENVIO DE DATOS
//=========================================================================================================================
//enviar el json a js
echo json_encode([
    'login' => $login,
    'id_admin' => $_SESSION['id'],
    'planComidasDisponible' =>$planComidasDisponible
]);
