<?php
//este php se quita todo los sesiones y envia a la pagina para informar al usuario que vuelva a la pagina del inddexPaginaprincipal del campamento
header('Content-Type: application/json');
session_start();   
session_unset();    //quitamos todo los valores del sesion
session_destroy();  //destroimos los sesiones
echo json_encode(['logout' => '../html/cerrarSesion.html']); //redireccionamos, redireccionamos despues de quitar el sesion 
exit()
?>