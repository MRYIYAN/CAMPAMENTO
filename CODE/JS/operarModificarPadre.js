//recogemos nombres en html

const nombre_tutor = document.getElementById("nombre_tutor");
const dni = document.getElementById("dni");
const telefono = document.getElementById("telefono");
const email = document.getElementById("email");
const cambiarContrasenia = document.getElementById("cambiarContrasenia");

// Los divs donde se mostrarán los errores
const errorNombre_Tutor = document.getElementById("errorNombre_Tutor");
const errorDni = document.getElementById("errorDni");
const errorTelefono = document.getElementById("errorTelefono");
const errorEmail = document.getElementById("errorEmail");
const errorContrasenia = document.getElementById("errorContrasenia");


//funcion para mostrar el eror
function mostrarError(lugar, mensaje) {
  // Si el mensaje no está vacío, mostrar el error
  if (mensaje) {
    lugar.innerHTML = `
      <img src="../assets/icons/errorIcon.png" alt="error" id="errorIcon">
      ${mensaje}`;
    lugar.style.color = "red"; // Añadir estilo de color rojo para el mensaje de error
    //en caso si no hemos puesto el error
  } else {
    // Limpiar el contenido del lugar si no hay mensaje de error
    lugar.innerHTML = "";
  }
}

function comprobarNombre() {
  if (nombre_tutor.value.trim() == "") {
    mostrarError(errorNombre_Tutor, "El nombre del niño no puede estar vacío");
  } else {
    mostrarError(errorNombre_Tutor, "");
  }
}

function comprobarDni() {
  if (dni.value.trim() == "") {
    mostrarError(errorDni, "El DNI no puede estar vacío");
  } else {
    mostrarError(errorDni, "");
    if (/^[XxYyZz]?\d{8}[A-Za-z]$/.test(dni.value)){
    mostrarError(errorDni, "");
    } else {
      mostrarError(errorDni, "Error de formato, tiene que contener 8 dígitos de número o letra y una letra al final");
    }
  }
}

function comprobarTelefono() {
  if (telefono.value.trim() == "") {
    mostrarError(errorTelefono, "El teléfono no puede estar vacío");
  } else {
    mostrarError(errorTelefono, "");
    if (/^[0-9]{9}$/.test(telefono.value)){
      mostrarError(errorTelefono, "");
    } else {
      mostrarError(errorTelefono, "El teléfono tiene que ser de 9 digitos de número");
    }
  }
}

function comprobarEmail(){
  if (email.value.trim() == ""){
    mostrarError(errorEmail,"El correo no puede estar vacio")
  }else{
    mostrarError(errorEmail, "")
    if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.value)){
      mostrarError(errorEmail, "");
    }else{
      mostrarError(errorEmail, "Error de formato de correo");

    }
  }
}

let quiereCambiarContrasenia = 'no';  //variable pasa raber si tiene alergia o no
function comprobarCambiarContrasenia() {
  let seleccionado = document.querySelector('input[name="cambiarContrasenia"]:checked');
  if (!seleccionado) return; // No hacer nada si no hay un radio seleccionado
  let espacio = document.getElementById('espacioContrasenia');
  if (seleccionado.value === "si") {
    console.log('Si')
    if (!document.getElementById('contraseniaNueva1')) {  //comprobar si existe los imputs o no 
      //en caso de si seleccionamos que si que si sadria los impput para modificar la contraseña
      espacio.innerHTML = `
        <label for="contraseniaNueva1">Introduce la nueva contraseña</label>
        <input type="text" name="contraseniaNueva1" id="contraseniaNueva1">
        <div id="errorContraseniaNueva1"></div>
        <label for="contraseniaNueva2">Introduce de nuevo la contraseña</label>
        <input type="text" name="contraseniaNueva2" id="contraseniaNueva2">
        <div id="errorContraseniaNueva2"></div>
      `;
      //comprobamos el contenido
      //cuando pierde el foco
      //document.getElementById('contraseniaAntigua').onblur = comprobarConraseniaDesdeBBDD;
      document.getElementById('contraseniaAntigua').onblur = comprobarContraseñaAntigua
      document.getElementById('contraseniaNueva1').onblur = comprobarContraseña1;
      document.getElementById('contraseniaNueva2').onblur = comprobarContraseña2;
      //cuando escribe
      //document.getElementById('contraseniaAntigua').oninput =comprobarConraseniaDesdeBBDD;
      document.getElementById('contraseniaNueva1').oninput = comprobarContraseña1;
      document.getElementById('contraseniaNueva2').oninput = comprobarContraseña2;
      document.getElementById('contraseniaAntigua').oninput = comprobarContraseñaAntigua
      quiereCambiarContrasenia = "si"
    }
  } else if (seleccionado.value === "no") {
    console.log('No')
    espacio.innerHTML = ''; // Elimina el textarea si selecciona "No"
    quiereCambiarContrasenia = "no";
  }
}
function comprobarContraseñaAntigua() {
  if (document.getElementById('contraseniaAntigua').value.trim() !== "") {
    mostrarError(document.getElementById('errorContraseniaAntigua'), "");
  } else {
    mostrarError(document.getElementById('errorContraseniaAntigua'), "La contraseña no puede estar vacio");
  }
}

//funcion para comprobar la contraseña1 si es valida con el formato o no
function comprobarContraseña1 (){
  if (document.getElementById('contraseniaNueva1').value.trim() == ""){
    //en caso si la contraseña es vacio
    mostrarError(document.getElementById('errorContraseniaNueva1'), "La contraseña nueva no pude estar vacio")
  }else{
    //en caso la contrsaeña  no esta vacio
    if (/^\d{6}$/.test(document.getElementById('contraseniaNueva1').value)){
      //si pasa la validacion
      mostrarError(document.getElementById('errorContraseniaNueva1'), "")
    }else{
      mostrarError(document.getElementById('errorContraseniaNueva1'), "La contraseña tiene que ser de 6 digitos");
    }
  }
}

//funcion para comprobar la contraseña2 si es valida con el formato o no
function comprobarContraseña2 (){
  if (document.getElementById('contraseniaNueva2').value.trim() == ""){
    //en caso si la contraseña es vacio
    mostrarError(document.getElementById('errorContraseniaNueva2'), "La contraseña nueva no pude estar vacio")
  }else{
    //en caso la contrsaeña  no esta vacio
    if (/^\d{6}$/.test(document.getElementById('contraseniaNueva2').value)){
      //si pasa la validacion
      mostrarError(document.getElementById('errorContraseniaNueva2'), "")
      //comprobamos si los dos comtraseña es igual o no 
      //compruebo los contraseña cifrada
      if (document.getElementById('contraseniaNueva1').value === document.getElementById('contraseniaNueva2').value){
        //en caso es igual 
        // console.log(`1: ${CifrarContrasenia (document.getElementById('contraseniaNueva1').value)}`)
        // console.log(`2: ${CifrarContrasenia (document.getElementById('contraseniaNueva2').value)}`)
        mostrarError(document.getElementById('errorContraseniaNueva2'), "")
      }else{
        //en caso de no sea igual
        mostrarError(document.getElementById('errorContraseniaNueva2'), "La contraseña no coinciden")
      }
    }else{
      //en caso si la contraseña no pasa de comprobacion de digito (6 digito)
      mostrarError(document.getElementById('errorContraseniaNueva2'), "La contraseña tiene que ser de 6 digitos");
    }
  }
}




// Función para comprobar la contraseña la contraseña en PHP, esta función siempre es llamada por otra función
async function FetchComprobarcontraseniaBBDD(contrasenia) {
  console.log('comprobacion de contrasenia antigua en bbdd')
  comprobacion = "";  //variable externo para el return del funcion
  try {
    let response = await fetch("../Server/GestionarModificarPadre.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contraseniaComprobacion: contrasenia }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del servidor.");
    }

    let data = await response.json(); //recibimos la respuesta

    if (data.contraseñaCorecta === true) {  //en caso el resultado del bbdd nos devuelve un true (pasa la comprobacion)
      //en caso si la contraseña es correcta 
      console.log(`Contraseña introducida ok`);
      mostrarError(document.getElementById('errorContraseniaAntigua'), "")  //quitamos el error
      comprobacion = true;  //asignamos al variable externo un true
    } else {
      //en caso de no 
      mostrarError(document.getElementById('errorContraseniaAntigua'), "Contraseña incorrecta") //en caso si la contraseña esta mal
      comprobacion = false; //asignamos al variable externo un false
    }
  } catch (error) {
    //en caso de tener error
    comprobacion = false; //asignamos al variable externo un false
  }
  //hace el return del variable externo que contiene booleano de que esta bien o no la contraseña
  return comprobacion;
}


//comprobar si la contraseña antigua es vacio o no, y en caso de no estar vacio se comprueba si coincide la contraseña que esta en bbdd
async function comprobarConraseniaDesdeBBDD (){
  if(document.getElementById('contraseniaAntigua').value.trim() == ""){
    mostrarError(document.getElementById('errorContraseniaAntigua'), "La contraseña no puede estar vacio")
    return false; //return un false en caso es un vacio
  }else{
    mostrarError(document.getElementById('errorContraseniaAntigua'),"");
    //comprobamos si la contraseña antigua esta bien o no desde bbdd
    return await FetchComprobarcontraseniaBBDD (document.getElementById('contraseniaAntigua').value)  //return del resultado del funcion de FetchComprobarcontraseniaBBDD
  }
}




//onburs
nombre_tutor.onblur = comprobarNombre;
dni.onblur = comprobarDni;
telefono.onblur = comprobarTelefono;
email.onblur = comprobarEmail;
// Asignar evento "change" a los radios
document.querySelectorAll('input[name="cambiarContrasenia"]').forEach(radio => {
  radio.addEventListener("change", comprobarCambiarContrasenia);
});


//cada vez que se escribe
nombre_tutor.oninput = comprobarNombre;
dni.oninput = comprobarDni;
telefono.oninput = comprobarTelefono;
email.oninput = comprobarEmail;



// Cuando presionamos el botón de enviar
const formulario = document.getElementById("formularioModificacion");

// Asigna un evento submit
formulario.onsubmit = async function (event) {
  // Prevenir el envío del formulario al inicio
  event.preventDefault();

  // Comprobamos los campos normales primero
  comprobarNombre();
  comprobarDni();
  comprobarTelefono();
  comprobarEmail();
  let contraseniaValida = false; // Variable para verificar si la contraseña es válida, el default es false
  contraseniaValida = await comprobarConraseniaDesdeBBDD(); //se asigna el boleano del result del funcion comprobarConraseniaDesdeBBDD
  

  if (quiereCambiarContrasenia === 'si') {  //en caso de que el usuario quire cambiar la contraseña
    // Comprobamos la contraseña antigua de manera asíncrona
   
    comprobarContraseña1();
    comprobarContraseña2();
  }

  // Función para comprobar si los elementos de error están vacíos
  function checkError(element) {
    return element && element.textContent.trim() === "";
  }

  // Comprobamos todos los errores
  if (
    checkError(errorNombre_Tutor) &&
    checkError(errorDni) &&
    checkError(errorTelefono) &&
    checkError(errorEmail)&&
    contraseniaValida == true // Verificamos si la contraseña antigua es correcta 
  ) {
    if (quiereCambiarContrasenia === 'si') {
      // Si el usuario quiere cambiar la contraseña
      if (
        checkError(document.getElementById('errorContraseniaAntigua')) &&
        checkError(document.getElementById('errorContraseniaNueva1')) &&
        checkError(document.getElementById('errorContraseniaNueva2')) 
          
      ) {
        mostrarError(document.getElementById("errorEnviar"), "");
        ModificacionPadreBBDD();  // Enviar los datos a la BBDD
      } else {
        mostrarError(document.getElementById("errorEnviar"), "El formulario contiene errores (Contraseñas)");
      }
    } else if (quiereCambiarContrasenia === 'no') {
      // Si no quiere cambiar la contraseña, enviamos los datos
      mostrarError(document.getElementById("errorEnviar"), "");
      ModificacionPadreBBDD();  // Enviar los datos a la BBDD
    }
  } else {
    mostrarError(document.getElementById("errorEnviar"), "El formulario contiene errores");
  }
};



//variabe para guardad avatar
//la logica del avatar, es crear un variable que asigna el direccion del avatar default y se comprueba si en bbdd existe avatar o no, en caso de si se asigna un nuevo valor, 
//y luego se le asigna al img que esta en html para la vista previa, y se insertamos algun img en el file sele coge la ruta para la vista previa 
//y cuando pasamos el avatar al php, se comprueba si hay archivo, pasamos el archivo y si no se pasa la ruta del bbdd
let avatarbbdd = "../assets/img/avatar.png" //avatar default
//id del nino
//--------------------------------------------------------------------------------//
let idNino = 0;
//--------------------------------------------------------------------------------//
//CONEXION BBDD
//este fetch se ejecuta SIEMPRE
fetch("../Server/GestionarModificarPadre.php", {
  method: "POST",
  headers: {
    "Content-type": "application/json",
  },
  // body: JSON.stringify({ inscribirse: "ok"})
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al obtener datos del servidor.");
    }
    return response.json();
  })
  .then((data) => {
    //comprobar si es un error o no
    if (data.error) {
      //en caso de si
      console.log("Error: " + data.error);
    } else if (data.noLogin) {
      window.location.href = data.noLogin; // Redirige a la URL proporcionada en el JSON
    } else {
      //comprobacion de login 
      console.log(`Login: ${data.login}`); //comprobar el login
      console.log(`El id del tutor es: ${data.id_tutor}`); //recogemos el dato
      console.log(data.infoTutor);
      //asignamos en los input
      nombre_tutor.value = data.infoTutor["nombre"];
      dni.value = data.infoTutor["dni"];
      telefono.value = data.infoTutor["telefono"];
      email.value = data.infoTutor["email"];

      

      //asignamos a un variable que esta fuera la ruta de avatar la ruta de avatar que esta en bbdd
      if(data.infoTutor["avatar_src"]){ //comprobamos si existe el avatar en bbdd o no, en caso de que sea nulo, no asignaria y usaria el default
        avatarbbdd = data.infoTutor["avatar_src"] //en caso de que si existiera avatar en bbdd se asignaria en bbdd
      }

      //----------------------------------------------------------------------------------------------------------------------------------//

      //VER AVATAR VISTA PREVIA
      //----------------------------------------------------------------------------------------------------------------------------------//
      document.getElementById('vistaPrevia').src = avatarbbdd; //modificamos el src de del img vacio en el html, con avatarbbdd podemos sacar la ruta del avatar que esta en bbdd
      document.getElementById('vistaPrevia').style.display = 'block'; //mostramos el img para la vista previa que esta en html como un bloqu
      document
        .getElementById("avatar")
        .addEventListener("change", function (event) {
          //escogemos el archivo seleccionado
          const file = event.target.files[0];
          // comprobamos si existe o no el archivo
          if (file) {
            //en caso de existir (adjuntado)
            document.getElementById('vistaPrevia').src = URL.createObjectURL(file); //modificamos el src de del img vacio en el html, con URL.createObjectURL(file) podemos sacar la ruta del archivo adjuntado
            document.getElementById('vistaPrevia').style.display = 'block'; //mostramos el img para la vista previa que esta en html como un bloqu
        } else {
          //en caso si no existe el archivo (no ha adjuntado)
           document.getElementById('vistaPrevia').src = avatarbbdd; //modificamos el src de del img vacio en el html, con avatarbbdd podemos sacar la ruta del avatar que esta en bbdd
          document.getElementById('vistaPrevia').style.display = 'block'; //mostramos el img para la vista previa que esta en html como un bloqu
        }
        });
      //----------------------------------------------------------------------------------------------------------------------------------//
    }
  });
  //--------------------------------------------------------------------------------//


let contraseniaNuevaContenido = "0" //variable para enviar al bbdd, en caso de que el usuario elige no de cambiar contraseña, se envia un 0
//funcion para insert de datos
function ModificacionPadreBBDD() {
  console.log(`nombre: ${nombre_tutor.value}`);
  console.log(`dni: ${dni.value}`);
  console.log(`telefono: ${telefono.value}`);
  console.log(`email: ${email.value}`);
  console.log(`Quiere cambiar contraseña ?: ` + quiereCambiarContrasenia);
  //comprobamos si va a cambiar la contraseña o no 
  if (quiereCambiarContrasenia == "si") {
    //comprobamos si hay alergia o no
    console.log(`contraseña nueva: ${document.getElementById("contraseniaNueva2").value}`);
    contraseniaNuevaContenido = document.getElementById("contraseniaNueva2").value; //en caso de si se le asigna al variable
  }

  //PREPARAMOS LOS DATOS PARA ENVIAR AL SERVIDOR CON FETCH PARA HACER EL UBDATE
  let formData = new FormData();
  //definimos que datos se envia
  formData.append("nombre_tutor", nombre_tutor.value);
  formData.append("dni", dni.value);
  formData.append("telefono", telefono.value);
  //formData.append("email", email.value);
  formData.append("contraseniaNuevaContenido", contraseniaNuevaContenido);

  // Solo agregar el avatar si hay uno seleccionado
  let avatarInput = document.getElementById("avatar");
  if (avatarInput.files.length > 0) {
    //en caso si hay contenido en el input
    formData.append("avatar", avatarInput.files[0]);  //pasamos el file al php
    formData.append("cambiarAvatar", true); //pasamos un booleano dicidendo que hay que modificar el perfil
  }else{
    //en caso si no hay nada en el input
  formData.append("avatarBBDD", avatarbbdd);  //pasamos la ruta de avatar que esta en el bbdd
    formData.append("cambiarAvatar", false);  //pasamos un boleano para decir que no hay que cambiar nada

}
  //FETCH PARA EL MODIFICACION DEL NIÑO
  fetch("../Server/GestionarModificarPadre.php", {
    method: "POST",
    //enviamos los datos
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener datos del servidor.");
      }
      return response.json();
    })
    .then((data) => {
      //comprobar si es un error o no
      if (data.error) {
        //en caso de si tener error
        console.log("Error: " + data.error);
      } else if (data.registrado) {
        //en caso si ha ejecutado
        window.location.href = data.registrado; // Redirige a la URL proporcionada en el JSON
      } else if (data.noRegistrado) {
        //en caso de no ejecutado
        window.location.href = data.noRegistrado; // Redirige a la URL proporcionada en el JSON
      } else {
        console.log(data);
        alert("datos NO ENVIADO");
        //en otros casos
        window.location.href =
          "../html/modificacionPadreFallada.html"; // Redirige a la URL proporcionada en el JSON
      }
    });
}
