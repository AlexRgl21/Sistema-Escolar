// =====================================
// REFERENCIAS AL DOM
// =====================================

const params = new URLSearchParams(window.location.search);
const idAdministrador = params.get('id');

const estadoCarga = document.getElementById('estadoCarga');
const estadoNoEncontrado = document.getElementById('estadoNoEncontrado');
const contenidoAdministrador = document.getElementById('contenidoAdministrador');

const idAdminTexto = document.getElementById('idAdminTexto');
const tituloAdmin = document.getElementById('tituloAdmin');
const correoAdmin = document.getElementById('correoAdmin');
const badgeEstatusAdmin = document.getElementById('badgeEstatusAdmin');

const formEditarAdmin = document.getElementById('formEditarAdmin');
const mensajeGuardado = document.getElementById('mensajeGuardado');
const mensajeErrorEdit = document.getElementById('mensajeErrorEdit');

const btnEliminar = document.getElementById('btnEliminar');

// Se guardan para usarlos en el mensaje de confirmación al eliminar
let nombreActual = '';
let apellidosActual = '';


// =====================================
// PINTAR LA INFORMACIÓN DEL ADMINISTRADOR
// =====================================

function pintarAdministrador(admin) {

    nombreActual = admin.nombre || '';
    apellidosActual = admin.apellidos || '';

    idAdminTexto.textContent = admin.id_administrador;
    tituloAdmin.textContent = `${admin.nombre || ''} ${admin.apellidos || ''}`.trim();
    correoAdmin.textContent = admin.correo || '';

    const esActivo = (admin.estatus || '').toLowerCase() === 'activo';
    badgeEstatusAdmin.textContent = admin.estatus || '';
    badgeEstatusAdmin.className = `badge ${esActivo ? 'badge-activo' : 'badge-inactivo'}`;

    // Precarga el formulario de edición con los datos actuales
    document.getElementById('editNombre').value = admin.nombre || '';
    document.getElementById('editApellidos').value = admin.apellidos || '';
    document.getElementById('editCorreo').value = admin.correo || '';
    document.getElementById('editContrasena').value = admin.contrasena || '';
    document.getElementById('editEstatus').value = admin.estatus || '';
    document.getElementById('editIdRol').value = admin.id_rol ?? '';
}


// =====================================
// CARGAR DETALLE DESDE EL BACKEND
// =====================================

async function cargarDetalleAdministrador() {

    if (!idAdministrador) {
        estadoCarga.hidden = true;
        estadoNoEncontrado.hidden = false;
        return;
    }

    estadoCarga.hidden = false;
    estadoCarga.textContent = 'Cargando información del administrador…';
    contenidoAdministrador.hidden = true;
    estadoNoEncontrado.hidden = true;

    try {

        const respuesta = await fetch(`/administradores/${idAdministrador}`);

        if (respuesta.status === 404) {
            estadoCarga.hidden = true;
            estadoNoEncontrado.hidden = false;
            return;
        }

        if (!respuesta.ok) {
            throw new Error('Error al obtener el detalle del administrador');
        }

        const admin = await respuesta.json();

        pintarAdministrador(admin);

        estadoCarga.hidden = true;
        contenidoAdministrador.hidden = false;

    } catch (error) {

        console.error('Error al cargar el detalle del administrador:', error);
        estadoCarga.textContent = 'Hubo un error al cargar la información. Intenta recargar la página.';

    }
}


// =====================================
// GUARDAR CAMBIOS (PUT /administradores/:id)
// =====================================

formEditarAdmin.addEventListener('submit', async (e) => {

    e.preventDefault();

    mensajeGuardado.style.display = 'none';
    mensajeErrorEdit.style.display = 'none';

    const datosActualizados = {
        nombre: document.getElementById('editNombre').value,
        apellidos: document.getElementById('editApellidos').value,
        correo: document.getElementById('editCorreo').value,
        contrasena: document.getElementById('editContrasena').value,
        estatus: document.getElementById('editEstatus').value,
        id_rol: document.getElementById('editIdRol').value
    };

    try {

        const respuesta = await fetch(`/administradores/${idAdministrador}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo guardar la información');
        }

        mensajeGuardado.textContent = 'Cambios guardados correctamente.';
        mensajeGuardado.style.display = 'block';

        // Refresca el encabezado (nombre, correo, badge) con los datos ya guardados
        cargarDetalleAdministrador();

    } catch (error) {

        console.error('Error al actualizar administrador:', error);
        mensajeErrorEdit.textContent = 'Hubo un error al guardar los cambios. Intenta de nuevo.';
        mensajeErrorEdit.style.display = 'block';

    }

});


// =====================================
// ELIMINAR ADMINISTRADOR (DELETE /administradores/:id)
// =====================================

btnEliminar.addEventListener('click', async () => {

    const nombreCompleto = `${nombreActual} ${apellidosActual}`.trim() || `el administrador #${idAdministrador}`;

    const confirmado = window.confirm(
        `¿Seguro que deseas eliminar a ${nombreCompleto}? Esta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    try {

        const respuesta = await fetch(`/administradores/${idAdministrador}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo eliminar al administrador');
        }

        window.location.href = 'administradores.html';

    } catch (error) {

        console.error('Error al eliminar administrador:', error);
        alert('Hubo un error al eliminar al administrador. Intenta de nuevo.');

    }

});


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarDetalleAdministrador();
