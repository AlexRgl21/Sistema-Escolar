// =====================================
// REFERENCIAS AL DOM
// =====================================

const alumnoSesion = obtenerAlumnoSesion();

const formulario = document.getElementById('formMisDatos');
const mensajeGuardado = document.getElementById('mensajeGuardado');
const mensajeError = document.getElementById('mensajeError');


// =====================================
// PRECARGAR LOS DATOS ACTUALES
// =====================================

function precargarDatos() {

    if (!alumnoSesion) return;

    document.getElementById('nombre').value = alumnoSesion.nombre || '';
    document.getElementById('apellidos').value = alumnoSesion.apellidos || '';
    document.getElementById('correo').value = alumnoSesion.correo || '';
    document.getElementById('contrasena').value = alumnoSesion.contrasena || '';

    // Estatus y rol se muestran de solo lectura; los administra la escuela
    document.getElementById('estatusTexto').value = alumnoSesion.estatus || '';
    document.getElementById('estatus').value = alumnoSesion.estatus || '';
}

precargarDatos();


// =====================================
// GUARDAR CAMBIOS (PUT /alumnos/:id)
// =====================================

formulario.addEventListener('submit', async (e) => {

    e.preventDefault();

    mensajeGuardado.style.display = 'none';
    mensajeError.style.display = 'none';

    const datosActualizados = {
        nombre: document.getElementById('nombre').value,
        apellidos: document.getElementById('apellidos').value,
        correo: document.getElementById('correo').value,
        contrasena: document.getElementById('contrasena').value,
        // Se reenvían tal cual llegaron: el alumno no puede modificarlos desde este formulario
        estatus: document.getElementById('estatus').value,
        id_rol: document.getElementById('id_rol').value
    };

    try {

        const respuesta = await fetch(`/alumnos/${alumnoSesion.id_alumno}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo guardar la información');
        }

        // Actualiza la sesión guardada localmente para reflejar los cambios
        // (así el saludo y el resto de las páginas del portal quedan al día)
        const nuevaSesion = { ...alumnoSesion, ...datosActualizados };
        localStorage.setItem('datosUsuario', JSON.stringify(nuevaSesion));

        mensajeGuardado.textContent = 'Tus datos se actualizaron correctamente.';
        mensajeGuardado.style.display = 'block';

    } catch (error) {

        console.error('Error al actualizar tus datos:', error);
        mensajeError.textContent = 'Hubo un error al guardar los cambios. Intenta de nuevo.';
        mensajeError.style.display = 'block';

    }

});
