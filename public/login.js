document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-login");
    const mensajeError = document.getElementById("mensaje-error");

    formulario.addEventListener("submit", async (evento) => {
        // 1. Evitar que la página recargue
        evento.preventDefault();

        // 2. Limpiar mensajes de error previos
        mensajeError.style.display = "none";
        mensajeError.textContent = "";

        // 3. Obtener los valores ingresados por el usuario
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;

        try {

            // 4. Primero se intenta como administrador...
            const respuestaAdmin = await fetch('/administradores/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena })
            });
            const datosAdmin = await respuestaAdmin.json();

            if (datosAdmin.exito) {
                guardarSesion(datosAdmin.usuario, 'administrador');
                window.location.href = 'index.html';
                return;
            }

            // 5. ...y si no coincide, como alumno
            const respuestaAlumno = await fetch('/alumnos/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena })
            });
            const datosAlumno = await respuestaAlumno.json();

            if (datosAlumno.exito) {
                guardarSesion(datosAlumno.usuario, 'alumno');
                window.location.href = 'portal-alumno.html';
                return;
            }

            // 6. Ninguno de los dos reconoció esas credenciales
            mensajeError.textContent = 'Correo o contraseña incorrectos';
            mensajeError.style.display = 'block';

        } catch (error) {
            // Este catch atrapa errores si el servidor de Node.js está apagado
            console.error("Error de conexión:", error);
            mensajeError.textContent = "Error al conectar con el servidor.";
            mensajeError.style.display = "block";
        }
    });

    function guardarSesion(usuario, tipo) {
        localStorage.setItem('usuarioLogueado', 'true');
        localStorage.setItem('datosUsuario', JSON.stringify(usuario));
        localStorage.setItem('tipoUsuario', tipo);
    }
});