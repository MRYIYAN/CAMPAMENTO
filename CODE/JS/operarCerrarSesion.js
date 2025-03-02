//definimos cuanto 
let cuentaAtras = 5;
//sacamos el div para imprimir la cuenta atras
let divCuentaAtras = document.getElementById('cuentaAtras');
//sacamos el div para imprimir la bara de progreso
let progresoCuentaAtras = document.getElementById('progreso');

//funcion que resta cada segundo y cuando el segundo llega a 0 se redireige la pagina
function cerrarSesion_Automatico (){
    //impriimir el info
    divCuentaAtras.innerText = `Redirigiendo a la pagina de inicio en ${cuentaAtras} segundos...`;
    //actualizar el progreso del cuenta atras
    progresoCuentaAtras.style.width = ((5 - cuentaAtras)/5) *100 +'%';   //hacemos un division para sacar el porcentaje y asignar el porcentaje resulytante

    //comprobamos los seguntos
    if (cuentaAtras === 0){
        //en caso es 0s
        window.location.href = '../html/Prototipo_index.html';
    }else{
        //en caso si hay mas segundo
        cuentaAtras --; //resta un valor de segundo
        setTimeout(cerrarSesion_Automatico, 1000);  //ejecutar el funcion cada 1000ms (1s)
    }
}

//eliminar cokkies
function eliminarTodasLasCookies() {
    // Obtener todas las cookies
    document.cookie.split(';').forEach(cookie => {
        // Obtener el nombre de cada cookie
        const nombre = cookie.split('=')[0].trim();
        // Establecer la cookie con una fecha de expiración pasada
        document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
}

// Llama a la función para eliminar todas las cookies
eliminarTodasLasCookies();

//activarse el funcion, hay que llamar por primera vez
cerrarSesion_Automatico ();