//recogemos nombres en html

const nombre_nino = document.getElementById("nombre_nino");
const fecha_nacimiento = document.getElementById("fecha_nacimiento");
const alergia = document.getElementById("alergiaNew");
const observaciones = document.getElementById("observaciones");

// Los divs donde se mostrarán los errores

const errornombre_nino = document.getElementById("errornombre_nino");
const errorfecha_nacimiento = document.getElementById("errorfecha_nacimiento");
const errorprograma = document.getElementById("errorprograma");
const errorAlergia = document.getElementById("errorAlergiaNew");

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

function comprobarNombreNino() {
  if (nombre_nino.value == "") {
    mostrarError(errornombre_nino, "El nombre del niño no puede estar vacío");
  } else {
    mostrarError(errornombre_nino, "");
  }
}
function comprobarFechaNacimiento() {
  const fechaIngresada = new Date(fecha_nacimiento.value); // Convertimos la fecha ingresada a un objeto Date
  const fechaActual = new Date(); // Obtenemos la fecha y hora actual
  if (fecha_nacimiento.value == "") {
    mostrarError(
      errorfecha_nacimiento,
      "La fecha de nacimiento no puede estar vacía"
    );
  } else {
    mostrarError(errorfecha_nacimiento, "");
    if (fechaIngresada > fechaActual) {
      mostrarError(errorfecha_nacimiento, "La fecha no puede ser futura");
    } else {
      mostrarError(errorfecha_nacimiento, "");
    }
  }
}

let alergiatxt = "no"; //variable pasa raber si tiene alergia o no
function comprobarAlergia() {
  let seleccionado = document.querySelector('input[name="alergiaNew"]:checked');
  if (!seleccionado) return; // No hacer nada si no hay un radio seleccionado
  let espacio = document.getElementById("espacioInputAlergiaNew");
  if (seleccionado.value === "si") {
    if (!document.getElementById("alergiasNew")) {
      espacio.innerHTML = `
        <textarea
            name="alergiasNew"
            id="alergiasNew"
            cols="30"
            rows="10"
        ></textarea>
      `;
      //comprobamos el contenido de txtarea
      document.getElementById("alergiasNew").onblur = comprobarInputAlergia;
      alergiatxt = "si";
    }
  } else if (seleccionado.value === "no") {
    espacio.innerHTML = ""; // Elimina el textarea si selecciona "No"
    mostrarError(errorAlergia); // Limpia el mensaje de error
    alergiatxt = "no";
  }
}
//funcion para comprobar el txtarea del alergia, en caso de vacio salta el error
function comprobarInputAlergia() {
  let inputAlergia = document.getElementById("alergiasNew");
  if (!inputAlergia) return; // No hacer nada si el textarea no existe
  let valorAlergia = inputAlergia.value.trim();
  if (valorAlergia === "") {
    mostrarError(errorAlergia, "Alergia no indicada");
  } else {
    mostrarError(errorAlergia);
  }
}

// Asignar el evento onblur a cada campo
nombre_nino.onblur = comprobarNombreNino;
fecha_nacimiento.onblur = comprobarFechaNacimiento;
// Asignar evento "change" a los radios
document.querySelectorAll('input[name="alergiaNew"]').forEach((radio) => {
  radio.addEventListener("change", comprobarAlergia);
});

//cando presiomos el boton
const formulario = document.getElementById("formularioModificacion");
// Asigna un evento submit
formulario.onsubmit = function (event) {
  comprobarNombreNino();
  comprobarFechaNacimiento();
  comprobarInputAlergia();

  // Función para comprobar si los elementos de error están vacíos
  function checkError(element) {
    return element && element.textContent.trim() === "";
  }

  // Comprobamos todos los errores
  //en caso si hay algun error, saltaria el alert y bloquearia el envio
  if (
    //comprobaciones si hay error o no
    checkError(errornombre_nino) &&
    checkError(errorfecha_nacimiento) &&
    checkError(errorAlergia)
  ) {
    // Si todos los errores están vacíos
    //AQUI DE DEJA EL PASO SOGUIENTE
    mostrarError(document.getElementById("errorEnviar"));
    event.preventDefault(); // Evita el envío del formulario
    ModificacionnNinoBBDD();
  } else {
    mostrarError(
      document.getElementById("errorEnviar"),
      "El formulario contiene errores"
    );
    event.preventDefault(); // Evita el envío del formulario
  }
};

//variabe para guardad avatar
let avatarbbdd = ""
//id del nino
//--------------------------------------------------------------------------------//
let idNino = 0;
//--------------------------------------------------------------------------------//
//CONEXION BBDD
//este fetch se ejecuta SIEMPRE
fetch("../Server/GestionarModificarNino.php", {
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
      console.log(`Login: ${data.login}`); //comprobar el login
      console.log(`El id del niño es: ${data.id_nino}`); //recogemos el dato
      idNino = data.id_nino; //asignamos al varible
      console.log(data.infoNino);
      //asignamos en los input
      nombre_nino.value = data.infoNino["nombre"];
      fecha_nacimiento.value = data.infoNino["fecha_nacimiento"];
      //solo rellenamos cuando en observaciones no es nada
      if (data.infoNino["observaciones"] != "nada") {
        observaciones.value = data.infoNino["observaciones"];
      }

      //comprobamos si ha alergia o no
      if (data.infoNino["alergias"] === "nada") {
        document.getElementById("alergiaNew_no").checked = true; //en caso si no han tenido alergia
      } else {
        document.getElementById("alergiaNew_si").checked = true; //en caso de tener alergia
        comprobarAlergia();

        //solo asignamos en el texarea cuando existe
        if (document.getElementById("alergiasNew")) {
          document.getElementById("alergiasNew").value =
            data.infoNino["alergias"]; // asigna el valor al textarea
        }
      }


      avatarbbdd = data.infoNino["avatar_src"]

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

//funcion para insert de datos
function ModificacionnNinoBBDD() {
  let alergiaContenido = "nada";
  let observacionesTXT = "nada";
  console.log(`nombre: ${nombre_nino.value}`);
  console.log(`fecha: ${fecha_nacimiento.value}`);
  console.log(`Hay contenido Alergia ?: ` + alergiatxt);
  if (alergiatxt == "si") {
    //comprobamos si hay alergia o no
    console.log(`alergia: ${document.getElementById("alergiasNew").value}`);
    alergiaContenido = document.getElementById("alergiasNew").value; //en caso de si se le asigna al variable
  }
  console.log(`Hay contenido Alergia es: ` + alergiaContenido);
  console.log(`observaciones: ${observaciones.value}`);
  if (observaciones.value.trim() !== "") {
    observacionesTXT = observaciones.value;
  }

  //PREPARAMOS LOS DATOS PARA ENVIAR AL SERVIDOR CON FETCH PARA HACER EL UBDATE
  let formData = new FormData();
  //definimos que datos se envia
  formData.append("nombre_nino", nombre_nino.value);
  formData.append("nacimiento_nino", fecha_nacimiento.value);
  formData.append("alergia", alergiaContenido);
  formData.append("observaciones", observacionesTXT);

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
  fetch("../Server/GestionarModificarNino.php", {
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
          "../html/modificacionNinoFallada.html"; // Redirige a la URL proporcionada en el JSON
      }
    });
}
