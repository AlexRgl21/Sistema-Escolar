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

let correoRecuperacion = "";

document.getElementById('btnOlvide').addEventListener('click', (e) => {
    e.preventDefault(); 
    document.querySelector('.login-header h2').textContent = "Recuperar Acceso";
    document.querySelector('.login-header p').style.display = "none";
    document.getElementById('vista-login').style.display = 'none';
    document.getElementById('vista-recuperacion').style.display = 'block';
});

document.getElementById('btnVolverLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.login-header h2').textContent = "Iniciar sesión";
    document.querySelector('.login-header p').style.display = "block";
    document.getElementById('vista-recuperacion').style.display = 'none';
    document.getElementById('vista-login').style.display = 'block';
    
    document.getElementById('paso1').style.display = 'block';
    document.getElementById('paso2').style.display = 'none';
    document.getElementById('paso3').style.display = 'none';
});


let tablaRecuperacion = "alumnos"; 

async function solicitarCodigo() {

    correoRecuperacion = document.getElementById('correoRecup').value.trim();

    let res = await fetch('/auth/solicitar-codigo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ correo: correoRecuperacion, tabla: 'alumnos' })
    });
    tablaRecuperacion = 'alumnos';

    // si el correo no existe error 404
    if (res.status === 404) {
        res = await fetch('/auth/solicitar-codigo', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ correo: correoRecuperacion, tabla: 'administradores' })
        });
        tablaRecuperacion = 'administradores';
    }


    if (res.ok) {
        document.getElementById('paso1').style.display = 'none';
        document.getElementById('paso2').style.display = 'block';
    } else {
        const data = await res.json();
        alert(data.mensaje); 
    }
}

async function verificarCodigo() {
    const token = document.getElementById('codigoVerif').value;
    const res = await fetch('/auth/verificar-codigo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ correo: correoRecuperacion, token })
    });
    
    if (res.ok) {
        document.getElementById('paso2').style.display = 'none';
        document.getElementById('paso3').style.display = 'block';
    } else {
        alert("Código inválido o expirado");
    }
}

async function actualizarPassword() {
    const nuevaPass = document.getElementById('nuevaPass').value;
    const res = await fetch('/auth/actualizar-password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ correo: correoRecuperacion, nuevaPass, tabla: tablaRecuperacion }) 
    });
    
    if (res.ok) {
        alert("Contraseña actualizada correctamente");
        location.reload();
    } else {
        alert("Error al actualizar la contraseña");
    }
}