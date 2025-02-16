//-----------------------------------------------------------------------------------//
// Script para operar el registro de usuarios
//-----------------------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', function() {

    //-----------------------------------------------------------------------------------//
    // Añadir listener para el submit del formulario de registro 
    //-----------------------------------------------------------------------------------//

    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envio del formulario
        

        //----------------------------------------------------------------------------------//
        // Obtener los valores de email y password del formulario de registro
        //----------------------------------------------------------------------------------//

        let email = document.getElementById('reg_email').value;
        let pswd = document.getElementById('reg_pswd').value;

        //----------------------------------------------------------------------------------//
        // Enviar los datos al servidor mediante fetch
        //----------------------------------------------------------------------------------//
        fetch("../Server/GestionarRegistro.php", {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `email=${encodeURIComponent(email)}&pswd=${encodeURIComponent(pswd)}`
    })
    .then(response => response.json()) // Parsear la respuesta como JSON
    .then(data => {
        //----------------------------------------------------------------------------------//
        // Procesar la respuesta JSON
        //----------------------------------------------------------------------------------//
        if (data.error) { 
            alert(data.error);
        } else if (data.redirect) {
            window.location.href = data.redirect;
        } else {
            alert("Registro exitoso!");
        }
     })
    .catch(error => {
        console.error('Error:', error);
    });
    });
});