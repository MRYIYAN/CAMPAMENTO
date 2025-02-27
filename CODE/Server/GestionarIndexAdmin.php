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

// Preparar la consulta para evitar inyección SQL
//SACAR TODOS INFORMACION DEL ADMIN
$queryInfo = $conn->prepare("SELECT * FROM ADMIN WHERE id_admin = ?");
$queryInfo->bind_param("i", $_SESSION['id']);    //asignamos el valor de ?, es un i porque es un numero(integer)
$queryInfo->execute();   //ejecutar en bbdd
$result = $queryInfo->get_result();  //recoge el resultado de la consulta 
// Comprobamos la respuesta de la consulta
if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
    $info = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
}
//cerramos e query
$queryInfo->close();


//SACAR TODO LOS GRUPOS QUE HAY EN BBDD
$queryGrupos = $conn->prepare("SELECT * FROM GRUPOS");
$queryGrupos->execute();   //ejecutar en bbdd
$result = $queryGrupos->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$grupos = [];  // Creamos un array vacío para almacenar la información de los hijos
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $grupos[] = $row;
}
$queryGrupos -> close();

//SACAR TODO LOS PLAN DE FECHA QUE HAY EN BBDD
$queryPlanFecha = $conn->prepare("SELECT * FROM plan_fechas");
$queryPlanFecha->execute();   //ejecutar en bbdd
$result = $queryPlanFecha->get_result();  //recoge el resultado de la consulta 
// Comprobamos si hay resultados
$planFecha = [];  // Creamos un array vacío para almacenar la información de los hijos
while ($row = $result->fetch_assoc()) {
    // Añadimos cada hijo al array
    $planFecha[] = $row;
}
$queryPlanFecha -> close();

//==========================================================================================================================================================//
//CONSULTA PARA SACER DATOS DE LA TABLA
//==========================================================================================================================================================//
//COMPROBAMOS SI HAN ASIGNADO LOS VALORES PAR LA CONSULTA DE TABLA
if (isset($data['planSeleccionado']) &&isset($data['grupoSeleccionado'])){
    //SACAR TODO LOS ACTIVIDADES QUE HAY EN BBDD DEOPENDIENDO DEL GRUPO Y PLAN 
    $queryActividadesTabla = $conn->prepare("SELECT * FROM actividades WHERE id_grupo = ? AND id_plan = ?");
    $queryActividadesTabla->bind_param("ii", $data['grupoSeleccionado'], $data['planSeleccionado']); 
    $queryActividadesTabla->execute();   //ejecutar en bbdd
    $result = $queryActividadesTabla->get_result();  //recoge el resultado de la consulta 
    // Comprobamos si hay resultados
    $actividadesTabla = [];  // Creamos un array vacío para almacenar la información de los hijos
    while ($row = $result->fetch_assoc()) {
        // Añadimos cada hijo al array
        $actividadesTabla[] = $row;
    }
    //cerramos el conexion 
    $queryActividadesTabla -> close();
    //enviamos el solucion
    echo json_encode(['datosTabla' => $actividadesTabla]);
    exit();
    
}

//==========================================================================================================================================================//
//CONSULTA PARA PODER OPERAR INFORMACION DEL ACTIVIDAD
//==========================================================================================================================================================//
if (isset($data['id_actividad'])){
    //SACAR TODOS INFORMACION DEL ACTIVIDAD DEPENDIENTO DEL ID_ACTIVIDAD
    $queryInfoActiviad = $conn->prepare("SELECT * FROM actividades WHERE id_actividad = ?");
    $queryInfoActiviad->bind_param("i", $data['id_actividad']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryInfoActiviad->execute();   //ejecutar en bbdd
    $result = $queryInfoActiviad->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $infoActiviad = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryInfoActiviad->close();



    //SACAR EL FECHA DE INICIO Y FIN DE UN ACTIVIDAD EN UN PLAN 
    $queryFechaActiviad = $conn->prepare("SELECT 
                                                P.fecha_inicio,
                                                P.fecha_fin
                                            FROM ACTIVIDADES A
                                            JOIN PLAN_FECHAS P ON A.id_plan = P.id_plan
                                            WHERE A.id_actividad = ?;");
    $queryFechaActiviad->bind_param("i", $data['id_actividad']);    //asignamos el valor de ?, es un i porque es un numero(integer)
    $queryFechaActiviad->execute();   //ejecutar en bbdd
    $result = $queryFechaActiviad->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $fechaActiviad = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryFechaActiviad->close();
    //enviamos el solucion
    echo json_encode(['infoActividad' => $infoActiviad, 'fechaActiviad' => $fechaActiviad]);
    exit();
}





//===============================================================================================================================================================================================================
//                                                      ACTUALIZAR TABLA
//===============================================================================================================================================================================================================

if (isset($_POST['id_actividadSeleccionado']) && isset($_POST['titulo']) && isset($_POST['hora_inicio']) && isset($_POST['hora_fin']) && isset($_POST['descripcion']) && isset($_POST['fecha'])){

    //ASIGNACION DE NUEVO FOTO DE FONDE EN ACTIVIDADES 
        //definimos donde queremos que se guarde el archivo
        $directorio_subida_avatar = "../assets/actividad/uploads/";
        //comprobar si hemos asignado el avatar y si hay algun error
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0 && $_POST['cambiarfoto'] == true){    //aqui comprobamos si hay que cambiar el avatar

        $name_avatar = $_FILES['foto']['name'];  //sacamos el nombre del archivo
        //sacamos los informaciones del archivo segun su nombre
        $array_avatar = pathinfo($name_avatar);

        //sacamos la ruta antigua del avatar
        $ruta_antiguo_avatar = $_FILES['foto']['tmp_name'];

        //sacamos la ruta que tiene que estrar en uploads
        $ruta_destino_avatar = $directorio_subida_avatar . $name_avatar;

        //movemos
        move_uploaded_file($ruta_antiguo_avatar, $ruta_destino_avatar);
        $rutaAvatar = $ruta_destino_avatar;
    }else{
        //en caso de no cambiar el avatar se usa la ruta que ya esta en bbdd
        $rutaAvatar = $_POST['fodoActividad'];
    }

    //creamos los querys y dependemos en que situacion lo usamos cada uno 
    if ($_POST['cambiarGrupo'] !== "si" && $_POST['cambiarPlan'] !== "si"){
        $queryModificacionActividad = $conn->prepare("UPDATE actividades SET titulo = ?, descripcion = ?, hora = ?, hora_fin = ?,  dia = ? , imagen_src = ? WHERE id_actividad = ?");
        $queryModificacionActividad->bind_param("ssssssi",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $rutaAvatar, $_POST['id_actividadSeleccionado'] );
    }else if ($_POST['cambiarGrupo'] == "si" && $_POST['cambiarPlan'] !== "si"){
        $queryModificacionActividad = $conn->prepare("UPDATE actividades SET titulo = ?, descripcion = ?, hora = ?, hora_fin = ?,  dia = ? , imagen_src = ?, id_grupo = ? WHERE id_actividad = ?");
        $queryModificacionActividad->bind_param("ssssssii",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $rutaAvatar, $_POST['grupoSeleccionadoOperar'],  $_POST['id_actividadSeleccionado'] );
    }
    else if ($_POST['cambiarGrupo'] !== "si" && $_POST['cambiarPlan'] == "si"){
        $queryModificacionActividad = $conn->prepare("UPDATE actividades SET titulo = ?, descripcion = ?, hora = ?, hora_fin = ?,  dia = ? , imagen_src = ?, id_plan = ? WHERE id_actividad = ?");
        $queryModificacionActividad->bind_param("ssssssii",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $rutaAvatar, $_POST['planSeleccionadoOperar'],  $_POST['id_actividadSeleccionado'] );
    }
    else if ($_POST['cambiarGrupo'] == "si" && $_POST['cambiarPlan'] == "si"){
        $queryModificacionActividad = $conn->prepare("UPDATE actividades SET titulo = ?, descripcion = ?, hora = ?, hora_fin = ?,  dia = ? , imagen_src = ?, id_plan = ?, id_grupo = ? WHERE id_actividad = ?");
        $queryModificacionActividad->bind_param("ssssssiii",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $rutaAvatar, $_POST['planSeleccionadoOperar'], $_POST['grupoSeleccionadoOperar'],  $_POST['id_actividadSeleccionado'] );
    }

    if ($queryModificacionActividad->execute()) { //comprobamos la ejecucion
        
        if ($queryModificacionActividad->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['modificado' => 'ok']);
            $queryModificacionActividad->close();   
            exit();
        } else {
            echo json_encode(['modificado' => 'noOk']);
            $queryModificacionActividad->close();   
            exit();

        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar Modificar de padre']);
        $queryModificacionActividad->close();   
        exit();
    }




}
//===============================================================================================================================================================================================================
//                                                      FIN DE ACTUALIZAR TABLA
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                      BORRAR UN ACTIVIDAD
//===============================================================================================================================================================================================================
if (isset($data['id_actividadSeleccionadaParaBorrar'])){
    $queryBorrarActividad = $conn->prepare("DELETE FROM actividades WHERE id_actividad = ?");
    $queryBorrarActividad->bind_param("i", $data['id_actividadSeleccionadaParaBorrar'] );
    if ($queryBorrarActividad->execute()) { //comprobamos la ejecucion
        
        if ($queryBorrarActividad->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['borrado' => 'ok']);
            $queryBorrarActividad->close();   
            exit();
        } else {
            echo json_encode(['borrado' => 'noOk']);
            $queryBorrarActividad->close();   
            exit();

        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar Modificar de padre']);
        $queryBorrarActividad->close();   
        exit();
    }
}

//===============================================================================================================================================================================================================
//                                                      fin BORRAR UN ACTIVIDAD
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                      BSACAR FECHA INICIO Y FECHA FIN DEL PLAN PARA INSERT
//===============================================================================================================================================================================================================
if (isset($data['planSeleccionadoParaInsert'])){
    $queryFechaPlanInserts = $conn->prepare("SELECT fecha_inicio, fecha_fin FROM plan_fechas WHERE id_plan = ?");
    $queryFechaPlanInserts->bind_param("i", $data['planSeleccionadoParaInsert'] );
    $queryFechaPlanInserts->execute();   //ejecutar en bbdd
    $result = $queryFechaPlanInserts->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $fechaPlanInserts = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryFechaPlanInserts->close();
    //enviamos el solucion
    echo json_encode(['fechaPlanInserts' => $fechaPlanInserts]);
    exit();
}

//===============================================================================================================================================================================================================
//                                                      FIN BSACAR FECHA INICIO Y FECHA FIN DEL PLAN PARA INSERT
//===============================================================================================================================================================================================================

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------

//===============================================================================================================================================================================================================
//                                                      INSERT DE ACTIVIDAD EN BBDD
//===============================================================================================================================================================================================================
if (isset($_POST['titulo']) && isset($_POST['hora_inicio']) && isset($_POST['hora_fin']) && isset($_POST['descripcion']) && isset($_POST['fecha'])&& isset($_POST['planSeleccionado']) && isset($_POST['grupoSeleccionado'])){
    //ASIGNACION DE NUEVO FOTO DE FONDE EN ACTIVIDADES 
        //definimos donde queremos que se guarde el archivo
        $directorio_subida_avatar = "../assets/actividad/uploads/";
        //comprobar si hemos asignado el avatar y si hay algun error
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0 && $_POST['cambiarfoto'] == true){    //aqui comprobamos si hay que cambiar el avatar

        $name_avatar = $_FILES['foto']['name'];  //sacamos el nombre del archivo
        //sacamos los informaciones del archivo segun su nombre
        $array_avatar = pathinfo($name_avatar);

        //sacamos la ruta antigua del avatar
        $ruta_antiguo_avatar = $_FILES['foto']['tmp_name'];

        //sacamos la ruta que tiene que estrar en uploads
        $ruta_destino_avatar = $directorio_subida_avatar . $name_avatar;

        //movemos
        move_uploaded_file($ruta_antiguo_avatar, $ruta_destino_avatar);
        $rutaAvatar = $ruta_destino_avatar;
    }else{
        //en caso de no cambiar el avatar se usa la ruta que ya esta en bbdd
        $rutaAvatar = $_POST['fodoActividad'];
    }

    $queryAniadirActividad = $conn->prepare("INSERT INTO actividades (titulo, descripcion, hora, hora_fin, dia, id_grupo, id_plan, imagen_src) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $queryAniadirActividad->bind_param("sssssiis",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $_POST['grupoSeleccionado'], $_POST['planSeleccionado'],  $rutaAvatar);
    if ($queryAniadirActividad->execute()) { //comprobamos la ejecucion
        
        if ($queryAniadirActividad->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['insertado' => 'ok']);
            $queryAniadirActividad->close();   
            exit();
        } else {
            echo json_encode(['insertado' => 'noOk']);
            $queryAniadirActividad->close();   
            exit();

        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar Modificar de padre']);
        $queryAniadirActividad->close();   
        exit();
    }
}

//===============================================================================================================================================================================================================
//                                                      BSACAR FECHA INICIO Y FECHA FIN DEL PLAN PARA INSERT
//===============================================================================================================================================================================================================
if (isset($data['planSeleccionadoParaInsert'])){
    $queryFechaPlanInserts = $conn->prepare("SELECT fecha_inicio, fecha_fin FROM plan_fechas WHERE id_plan = ?");
    $queryFechaPlanInserts->bind_param("i", $data['planSeleccionadoParaInsert'] );
    $queryFechaPlanInserts->execute();   //ejecutar en bbdd
    $result = $queryFechaPlanInserts->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $fechaPlanInserts = $result->fetch_assoc();  //extraer los datos del primier fila ([nombre => padreEjemplo, wjdwedeu, sduewhud, sduhuwe]), en este caso en js no hace falta mapear, por que solo hay una fila de datos
    }
    //cerramos e query
    $queryFechaPlanInserts->close();
    //enviamos el solucion
    echo json_encode(['fechaPlanInserts' => $fechaPlanInserts]);
    exit();
}

//===============================================================================================================================================================================================================
//                                                      FIN BSACAR FECHA INICIO Y FECHA FIN DEL PLAN PARA INSERT
//===============================================================================================================================================================================================================

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------

//===============================================================================================================================================================================================================
//                                                      INSERT DE ACTIVIDAD EN BBDD
//===============================================================================================================================================================================================================
if (isset($_POST['titulo']) && isset($_POST['hora_inicio']) && isset($_POST['hora_fin']) && isset($_POST['descripcion']) && isset($_POST['fecha'])&& isset($_POST['planSeleccionado']) && isset($_POST['grupoSeleccionado'])){
    //ASIGNACION DE NUEVO FOTO DE FONDE EN ACTIVIDADES 
        //definimos donde queremos que se guarde el archivo
        $directorio_subida_avatar = "../assets/actividad/uploads/";
        //comprobar si hemos asignado el avatar y si hay algun error
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0 && $_POST['cambiarfoto'] == true){    //aqui comprobamos si hay que cambiar el avatar

        $name_avatar = $_FILES['foto']['name'];  //sacamos el nombre del archivo
        //sacamos los informaciones del archivo segun su nombre
        $array_avatar = pathinfo($name_avatar);


        //sacamos la ruta antigua del avatar
        $ruta_antiguo_avatar = $_FILES['foto']['tmp_name'];

        //sacamos la ruta que tiene que estrar en uploads
        $ruta_destino_avatar = $directorio_subida_avatar . $name_avatar;

        //movemos
        move_uploaded_file($ruta_antiguo_avatar, $ruta_destino_avatar);
        $rutaAvatar = $ruta_destino_avatar;
    }else{
        //en caso de no cambiar el avatar se usa la ruta que ya esta en bbdd
        $rutaAvatar = $_POST['fodoActividad'];
    }

    $queryAniadirActividad = $conn->prepare("INSERT INTO actividades (titulo, descripcion, hora, hora_fin, dia, id_grupo, id_plan, imagen_src) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $queryAniadirActividad->bind_param("sssssiis",  $_POST['titulo'], $_POST['descripcion'], $_POST['hora_inicio'], $_POST['hora_fin'], $_POST['fecha'], $_POST['grupoSeleccionado'], $_POST['planSeleccionado'],  $rutaAvatar);
    if ($queryAniadirActividad->execute()) { //comprobamos la ejecucion
        
        if ($queryAniadirActividad->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
            echo json_encode(['insertado' => 'ok']);
            $queryAniadirActividad->close();   
            exit();
        } else {
            echo json_encode(['insertado' => 'noOk']);
            $queryAniadirActividad->close();   
            exit();

        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar Modificar de padre']);
        $queryAniadirActividad->close();   
        exit();
    }
}


//===============================================================================================================================================================================================================
//                                                      FIN DE INSERT DE ACTIVIDAD EN BBDD
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================

//                                                      CONSULTA PARA SACAR MONITORES DISPONIBLES
//===============================================================================================================================================================================================================
//query para sacar 
if (isset($data['consultarMonitorDisponible'])){
    //SACAR TODO LOS MONITORES QUE EXISTE 
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
    $queryMonitores -> close();
    //enviamos el solucion
    echo json_encode(['monitoresDisponible' => $monitoresDisponible]);
    exit();


}
//===============================================================================================================================================================================================================
//                                                      FIN DE CONSULTA PARA SACAR MONITORES DISPONIBLES
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                      CREAR GRUPO
//===============================================================================================================================================================================================================
//query para hacer el inset de crear grupo
if (isset($data['nombreGrupoCrearGrupo']) && isset($data['idMonitoGrupoCrearGrupo'])){
    //CREAR UN GRUPO
    $queryCrearGrupos = $conn->prepare("INSERT INTO GRUPOS (nombre, id_monitor) VALUES (?, ?)");
    $queryCrearGrupos->bind_param("si",  $data['nombreGrupoCrearGrupo'], $data['idMonitoGrupoCrearGrupo']);
    if ($queryCrearGrupos->execute()) { //comprobamos la ejecucion
            //comprobamos si se ha creado o no 
        if ($queryCrearGrupos->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
            //en caso de si 
            echo json_encode(['crearGrupo' => 'ok']);
            $queryCrearGrupos->close();   
            exit();
        } else {
            //en caso de no 
            echo json_encode(['crearGrupo' => 'noOk']);
            $queryCrearGrupos->close();   
            exit();
        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar insertar nuevo grupo']);
        $queryCrearGrupos->close();   
        exit();
    }

}
//===============================================================================================================================================================================================================
//                                                      FIN CREAR GRUPO
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                       CREAR PLAN
//===============================================================================================================================================================================================================

if (isset($data['nombreAgregatPlan'])&& isset($data['fechaInicioCrearPlan']) && isset($data['fechaFinCrearPlan']) && isset($data['fechaMaximaCrearPlan']) && isset($data['horaMaximaCrearPlan']) && isset($data['precioCrearPlan']) && isset($data['descripcionCrearPlan'])) {
    //CREAR UN PLAN
    $queryCrearPlan = $conn->prepare("INSERT INTO plan_fechas (nombre, fecha_inicio, fecha_fin, fecha_maxInscripcion, hora_maximaInscripcion, precio, definicion) VALUES (?,?,  ?, ?, ?, ?, ?)");
    $queryCrearPlan->bind_param("sssssss",  $data['nombreAgregatPlan'], $data['fechaInicioCrearPlan'], $data['fechaFinCrearPlan'], $data['fechaMaximaCrearPlan'], $data['horaMaximaCrearPlan'], $data['precioCrearPlan'], $data['descripcionCrearPlan']);
    if ($queryCrearPlan->execute()) { //comprobamos la ejecucion
            //comprobamos si se ha creado o no 
        if ($queryCrearPlan->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
            //en caso de si 
            echo json_encode(['crearPlan' => 'ok']);
            $queryCrearPlan->close();   
            exit();
        } else {
            //en caso de no 
            echo json_encode(['crearPlan' => 'noOk']);
            $queryCrearPlan->close();   
            exit();
        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar insertar nuevo Plan']);
        $queryCrearPlan->close();  
    } 
        
}



//===============================================================================================================================================================================================================
//                                                       FIN CREAR PLAN
//===============================================================================================================================================================================================================



//===============================================================================================================================================================================================================
//                                                      FIN DE CONSULTA PARA SACAR MONITORES DISPONIBLES
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                      CREAR GRUPO
//===============================================================================================================================================================================================================
//query para hacer el inset de crear grupo
if (isset($data['nombreGrupoCrearGrupo']) && isset($data['idMonitoGrupoCrearGrupo'])){
    //CREAR UN GRUPO
    $queryCrearGrupos = $conn->prepare("INSERT INTO GRUPOS (nombre, id_monitor) VALUES (?, ?)");
    $queryCrearGrupos->bind_param("si",  $data['nombreGrupoCrearGrupo'], $data['idMonitoGrupoCrearGrupo']);
    if ($queryCrearGrupos->execute()) { //comprobamos la ejecucion
            //comprobamos si se ha creado o no 
        if ($queryCrearGrupos->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
            //en caso de si 
            echo json_encode(['crearGrupo' => 'ok']);
            $queryCrearGrupos->close();   
            exit();
        } else {
            //en caso de no 
            echo json_encode(['crearGrupo' => 'noOk']);
            $queryCrearGrupos->close();   
            exit();
        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar insertar nuevo grupo']);
        $queryCrearGrupos->close();   
        exit();
    }

}
//===============================================================================================================================================================================================================
//                                                      FIN CREAR GRUPO
//===============================================================================================================================================================================================================


//===============================================================================================================================================================================================================
//                                                       CREAR PLAN
//===============================================================================================================================================================================================================

if (isset($data['nombreAgregatPlan'])&& isset($data['fechaInicioCrearPlan']) && isset($data['fechaFinCrearPlan']) && isset($data['fechaMaximaCrearPlan']) && isset($data['horaMaximaCrearPlan']) && isset($data['precioCrearPlan']) && isset($data['descripcionCrearPlan'])) {
    //CREAR UN PLAN
    $queryCrearPlan = $conn->prepare("INSERT INTO plan_fechas (nombre, fecha_inicio, fecha_fin, fecha_maxInscripcion, hora_maximaInscripcion, precio, definicion) VALUES (?,?,  ?, ?, ?, ?, ?)");
    $queryCrearPlan->bind_param("sssssss",  $data['nombreAgregatPlan'], $data['fechaInicioCrearPlan'], $data['fechaFinCrearPlan'], $data['fechaMaximaCrearPlan'], $data['horaMaximaCrearPlan'], $data['precioCrearPlan'], $data['descripcionCrearPlan']);
    if ($queryCrearPlan->execute()) { //comprobamos la ejecucion
            //comprobamos si se ha creado o no 
        if ($queryCrearPlan->affected_rows > 0) { // Si se inserta al menos 1 o 0 registro
            //en caso de si 
            echo json_encode(['crearPlan' => 'ok']);
            $queryCrearPlan->close();   
            exit();
        } else {
            //en caso de no 
            echo json_encode(['crearPlan' => 'noOk']);
            $queryCrearPlan->close();   
            exit();
        }
    } else {
        //en caso si no ha podido ejecutar
        echo json_encode(['error' => 'Error ejecutar insertar nuevo Plan']);
        $queryCrearPlan->close();  
    } 
        
}

//===============================================================================================================================================================================================================
//                                                       FIN CREAR PLAN
//===============================================================================================================================================================================================================




//===============================================================================================================================================================================================================
//                                                       COMPROBAR LA CONTRASEÑA EN BBDD
//===============================================================================================================================================================================================================
if (isset($data['idAdminParaComprobarContraseña']) &&isset($data['contraseniaTXTParaComprobar'])){
    //sacamos el hash del admin
    $queryHashContraseña = $conn->prepare("SELECT contrasenia FROM admin WHERE id_admin = ?");
    $queryHashContraseña->bind_param("i", $data['idAdminParaComprobarContraseña'] );
    $queryHashContraseña->execute();   //ejecutar en bbdd
    $result = $queryHashContraseña->get_result();  //recoge el resultado de la consulta 
    // Comprobamos la respuesta de la consulta
    $hashContraseña = 0;
    if ($result->num_rows > 0) {    //comprueba si hay resultado o no 
        $hashContraseña = $result->fetch_assoc()['contrasenia'];    //sacar la contrasenia que esta en bbdd (ya hasheada)
    }
    //cerramos e query
    $queryHashContraseña->close();

    //comprobamos la contraseña si esta bien o no 
    if (password_verify($data['contraseniaTXTParaComprobar'], $hashContraseña)){
        echo json_encode(['comprobacionContraseña' => 'ok']);
        exit();
    }else{
        echo json_encode(['comprobacionContraseña' => 'noOk']);
        exit();
    }
}
//===============================================================================================================================================================================================================
//                                                       FIN COMPROBAR LA CONTRASEÑA EN BBDD
//===============================================================================================================================================================================================================


//---------------------------------------------------------------//
//CAMBAIR LA CONTRASEÑA
//---------------------------------------------------------------//
if(isset($data['contraseñaParaCambiar2']) && $data['idAdminCambiarContrasenia']){
    $contraseniaHasheada = password_hash($data['contraseñaParaCambiar2'], PASSWORD_DEFAULT);
     //insertamos la contraseña en bbdd
     $queryCambiarContrasenia = $conn->prepare("UPDATE admin SET contrasenia = ? WHERE id_admin = ?");
     $queryCambiarContrasenia->bind_param("si", $contraseniaHasheada, $data['idAdminCambiarContrasenia']);
     if ($queryCambiarContrasenia->execute()) { //comprobamos la ejecucion
         //comprobamos si se ha creado o no 
         if ($queryCambiarContrasenia->affected_rows >= 0) { // Si se inserta al menos 1 o 0 registro
             //en caso de si 
             echo json_encode(['contraseniaAdminCambiado' => 'ok']);
             $queryCambiarContrasenia->close();
             exit();
         } else {
             //en caso de no 
             echo json_encode(['contraseniaAdminCambiado' => 'noOk']);
             $queryCambiarContrasenia->close();
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
    'info' => $info,
    'grupos' => $grupos,
    'planFecha' => $planFecha
]);
