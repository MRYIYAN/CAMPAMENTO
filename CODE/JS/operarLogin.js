document.addEventListener("DOMContentLoaded", function () {
    //----------------------------------------------------------------------------------------//
    // Añadir listener para el submit del formulario de login
    //----------------------------------------------------------------------------------------//
    document.getElementById("loginForm").addEventListener("submit", function (e) {
        e.preventDefault();  // Prevenir el comportamiento por defecto del formulario
        //----------------------------------------------------------------------------------------//
        // Obtener los valores de los campos de email y contraseña
        //----------------------------------------------------------------------------------------//
        let email = document.getElementById("email").value;
        let pswd = document.getElementById("pswd").value;

        //----------------------------------------------------------------------------------------//
        // Enviar los datos al servidor usando fetch
        //----------------------------------------------------------------------------------------//
        fetch("../Server/GestionarLogin.php", {  // Verifica que la ruta sea correcta
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `email=${encodeURIComponent(email)}&pswd=${encodeURIComponent(pswd)}`
        })
        .then(response => response.json())  // Parsear la respuesta como JSON
        .then(data => {
            //------------------------------------------------------------------------------------//
            // Procesar la respuesta JSON
            //------------------------------------------------------------------------------------//
            if (data.error) { 
                alert(data.error);
            } else if (data.redirect) {
                window.location.href = data.redirect;
            } else if (data.message) {
                console.log(data.message);  // Manejar el mensaje de éxito si es necesario
            } else {
                alert("Respuesta desconocida del servidor.");
            }
        })
        .catch(error => console.error("Error:", error));  // Manejar errores en la petición 
    });
});

//-----------------------------------------------------------------------------------------//

//--------------------------------------------------------------------------------------------//
// Selección de elementos de formulario (Iniciar sesión y Crear Cuenta)
//--------------------------------------------------------------------------------------------//
const correoLogin = document.querySelector('.login input[name="email"]'); // Selecciona el campo de correo en el formulario de login
const contrasenaLogin = document.querySelector('.login input[name="pswd"]'); // Selecciona el campo de contraseña en el formulario de login
const correoSignup = document.querySelector('.signup input[name="email"]'); // Selecciona el campo de correo en el formulario de signup
const contrasenaSignup = document.querySelector('.signup input[name="pswd"]'); // Selecciona el campo de contraseña en el formulario de signup

//--------------------------------------------------------------------------------------------//
// Elementos de los formularios (Login y Crear Cuenta)
//--------------------------------------------------------------------------------------------//
const formularioLogin = document.getElementById('loginForm'); // Referencia al formulario de login
const formularioSignup = document.getElementById('signupForm'); // Referencia al formulario de signup

//--------------------------------------------------------------------------------------------//
// Creación de contenedores para mostrar errores debajo de los campos
//--------------------------------------------------------------------------------------------//
const errorCorreoLogin = document.createElement('div'); // Contenedor para mostrar el error del correo en login
const errorContrasenaLogin = document.createElement('div'); // Contenedor para mostrar el error de la contraseña en login
const errorCorreoSignup = document.createElement('div'); // Contenedor para mostrar el error del correo en signup
const errorContrasenaSignup = document.createElement('div'); // Contenedor para mostrar el error de la contraseña en signup

// Insertamos los contenedores de error después de cada campo para que aparezcan debajo de los mismos
correoLogin.after(errorCorreoLogin);
contrasenaLogin.after(errorContrasenaLogin);
correoSignup.after(errorCorreoSignup);
contrasenaSignup.after(errorContrasenaSignup);

//--------------------------------------------------------------------------------------------//
// Estilo de los mensajes de error del css
//--------------------------------------------------------------------------------------------//
const estiloError = `
    color: red; 
    font-size: 12px; 
    margin-top: 5px; 
    display: flex; 
    align-items: center; 
`;
// Aplica el estilo a todos los contenedores de errores
[errorCorreoLogin, errorContrasenaLogin, errorCorreoSignup, errorContrasenaSignup].forEach(el => (el.style.cssText = estiloError));

//--------------------------------------------------------------------------------------------//
// Función para validar el correo (verifica formato y vacío)
//--------------------------------------------------------------------------------------------//
function validarCorreo(correo) {
    const iconoError = `<img src="../assets/icons/errorIcon.png" alt="error" id="iconoError">`; // Icono de error
    if (!correo) return `${iconoError} El correo no puede estar vacío.`; // Verifica si el correo está vacío
    if (!correo.includes('@')) return `${iconoError} El correo debe contener un "@" válido.`; // Verifica si el correo contiene un "@"
    return ''; // Sin errores, devuelve una cadena vacía
}

//--------------------------------------------------------------------------------------------//
// Función para validar la contraseña (verifica si tiene los dígitos necesarios)
//--------------------------------------------------------------------------------------------//
function validarContrasena(contrasena, digitosMinimos = 6) {
    const iconoError = `<img src="../assets/icons/errorIcon.png" alt="error" id="iconoError">`; // Icono de error
    if (!contrasena) return `${iconoError} La contraseña no puede estar vacía.`; // Verifica si la contraseña está vacía

    // Contar la cantidad de dígitos numéricos en la contraseña
    const cantidadDigitos = contrasena.replace(/[^0-9]/g, '').length;
    
    // Verifica si la contraseña tiene los dígitos numéricos suficientes
    if (cantidadDigitos < digitosMinimos) return `${iconoError} La contraseña debe contener al menos ${digitosMinimos} dígitos numéricos.`;
    
    return ''; // Sin errores, devuelve una cadena vacía
}

//--------------------------------------------------------------------------------------------//
// Función para limpiar los errores previos (se actualiza si el usuario va borrando por ejemplo)
//--------------------------------------------------------------------------------------------//
function limpiarErrores() {
    // Limpiar el contenido de los contenedores de error
    errorCorreoLogin.innerHTML = '';
    errorContrasenaLogin.innerHTML = '';
    errorCorreoSignup.innerHTML = '';
    errorContrasenaSignup.innerHTML = '';
}

//--------------------------------------------------------------------------------------------//
// Función para manejar la validación de los campos dinámicamente (aplica la validación dinamicamente y a medida que el usuario va escribiendo)
//--------------------------------------------------------------------------------------------//
function validarCampos(elementoInput, contenedorError, funcionValidar) {
    // Llama a la función de validación y pasa el valor actual del campo
    const error = funcionValidar(elementoInput.value);
    if (error) {
        // Si hay un error, muestra el mensaje y establece la validez del campo como "error"
        contenedorError.innerHTML = error;
        elementoInput.setCustomValidity('error');
    } else {
        // Si no hay error, limpia el mensaje y elimina la validez de "error"
        contenedorError.innerHTML = '';
        elementoInput.setCustomValidity('');
    }
}

//--------------------------------------------------------------------------------------------//
// Validaciones para el formulario de Iniciar sesión (Login)
//--------------------------------------------------------------------------------------------//
formularioLogin.addEventListener('submit', function (e) {
    e.preventDefault(); // Detiene el envío del formulario predeterminado

    // Limpiar las validaciones anteriores
    limpiarErrores();
    correoLogin.setCustomValidity(''); // Restablece el estado de validez del campo de correo
    contrasenaLogin.setCustomValidity(''); // Restablece el estado de validez del campo de contraseña

    // Realiza la validación del correo y la contraseña
    const errorCorreo = validarCorreo(correoLogin.value); // Validar el correo
    const errorContrasena = validarContrasena(contrasenaLogin.value); // Validar la contraseña

    if (errorCorreo || errorContrasena) {
        // Si hay errores, los muestra debajo de los campos correspondientes
        errorCorreoLogin.innerHTML = errorCorreo;
        errorContrasenaLogin.innerHTML = errorContrasena;

        // Establece que el formulario no debe enviarse
        if (errorCorreo) correoLogin.setCustomValidity('error');
        if (errorContrasena) contrasenaLogin.setCustomValidity('error');
    } else {
        // Si todo está correcto, limpia los errores
        limpiarErrores();
    }
});

//--------------------------------------------------------------------------------------------//
// Validaciones para el formulario de Crear Cuenta (Signup)
//--------------------------------------------------------------------------------------------//
formularioSignup.addEventListener('submit', function (e) {
    e.preventDefault(); // Detiene el envío del formulario predeterminado

    // Limpiar las validaciones anteriores
    limpiarErrores();
    correoSignup.setCustomValidity(''); // Restablece el estado de validez del campo de correo
    contrasenaSignup.setCustomValidity(''); // Restablece el estado de validez del campo de contraseña

    // Realiza la validación del correo y la contraseña
    const errorCorreo = validarCorreo(correoSignup.value); // Validar el correo
    const errorContrasena = validarContrasena(contrasenaSignup.value); // Validar la contraseña

    if (errorCorreo || errorContrasena) {
        // Si hay errores, los muestra debajo de los campos correspondientes (mas dinamico)
        errorCorreoSignup.innerHTML = errorCorreo;
        errorContrasenaSignup.innerHTML = errorContrasena;

        // Establece que el formulario no debe enviarse
        if (errorCorreo) correoSignup.setCustomValidity('error');
        if (errorContrasena) contrasenaSignup.setCustomValidity('error');
    } else {
        // Si todo está correcto, limpia los errores
        limpiarErrores();
    }
});

//--------------------------------------------------------------------------------------------//
// Listener para los cambios en los campos de correo y contraseña 
// Este listener actualiza las validaciones dinámicamente mientras el usuario escribe en los campos
//--------------------------------------------------------------------------------------------//
correoLogin.addEventListener('input', function() {
    validarCampos(correoLogin, errorCorreoLogin, validarCorreo); // Llama a la función de validación para el correo de login
});
contrasenaLogin.addEventListener('input', function() {
    validarCampos(contrasenaLogin, errorContrasenaLogin, validarContrasena); // Llama a la función de validación para la contraseña de login
});
correoSignup.addEventListener('input', function() {
    validarCampos(correoSignup, errorCorreoSignup, validarCorreo); // Llama a la función de validación para el correo de signup
});
contrasenaSignup.addEventListener('input', function() {
    validarCampos(contrasenaSignup, errorContrasenaSignup, validarContrasena); // Llama a la función de validación para la contraseña de signup
});


//--------------------------------------------------------------------------------------------//
// Listener para la validación al perder el foco (onblur)
//--------------------------------------------------------------------------------------------//
correoLogin.addEventListener('blur', function () {
    validarCampos(correoLogin, errorCorreoLogin, validarCorreo); // Valida el correo de login al perder el foco
});

contrasenaLogin.addEventListener('blur', function () {
    validarCampos(contrasenaLogin, errorContrasenaLogin, validarContrasena); // Valida la contraseña de login al perder el foco
});

correoSignup.addEventListener('blur', function () {
    validarCampos(correoSignup, errorCorreoSignup, validarCorreo); // Valida el correo de signup al perder el foco
});

contrasenaSignup.addEventListener('blur', function () {
    validarCampos(contrasenaSignup, errorContrasenaSignup, validarContrasena); // Valida la contraseña de signup al perder el foco
});