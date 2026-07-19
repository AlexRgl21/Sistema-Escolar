// =====================================
// REFERENCIAS AL DOM
// =====================================

const params = new URLSearchParams(window.location.search);
const idTramite = params.get('id');

const estadoCarga = document.getElementById('estadoCarga');
const estadoNoEncontrado = document.getElementById('estadoNoEncontrado');
const contenidoTramite = document.getElementById('contenidoTramite');

const idTramiteTexto = document.getElementById('idTramiteTexto');
const tipoTramiteTexto = document.getElementById('tipoTramiteTexto');
const metaTramite = document.getElementById('metaTramite');
const badgeEstatusTramite = document.getElementById('badgeEstatusTramite');
const descripcionTramite = document.getElementById('descripcionTramite');

const formResponderTramite = document.getElementById('formResponderTramite');
const mensajeGuardado = document.getElementById('mensajeGuardado');
const mensajeErrorEdit = document.getElementById('mensajeErrorEdit');

// Administrador con la sesión iniciada (para registrar quién respondió)
let administradorSesion = null;
try {
    administradorSesion = JSON.parse(localStorage.getItem('datosUsuario'));
} catch (error) {
    administradorSesion = null;
}


// =====================================
// UTILIDADES
// =====================================

function formatearFechaHora(fecha) {
    if (!fecha) return '';
    const fechaObj = new Date(fecha);
    if (Number.isNaN(fechaObj.getTime())) return fecha;
    return fechaObj.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function claseBadgeEstatus(estatus) {
    const valor = (estatus || '').toLowerCase();
    if (valor === 'resuelto') return 'badge-activo';
    if (valor === 'rechazado') return 'badge-inactivo';
    if (valor === 'en proceso') return 'badge-proceso';
    return 'badge-pendiente';
}


// =====================================
// PINTAR LA INFORMACIÓN DEL TRÁMITE
// =====================================

function pintarTramite(tramite) {

    const nombreAlumno = `${tramite.nombre_alumno || ''} ${tramite.apellidos_alumno || ''}`.trim() || 'Alumno sin datos';

    idTramiteTexto.textContent = tramite.id_tramite;
    tipoTramiteTexto.textContent = tramite.tipo_tramite || '';
    metaTramite.textContent = `Solicitado por ${nombreAlumno} (id_alumno: ${tramite.id_alumno}) el ${formatearFechaHora(tramite.fecha_solicitud)}`;

    badgeEstatusTramite.textContent = tramite.estatus || '';
    badgeEstatusTramite.className = `badge ${claseBadgeEstatus(tramite.estatus)}`;

    descripcionTramite.textContent = tramite.descripcion || 'El alumno no agregó una descripción.';

    document.getElementById('editEstatus').value = tramite.estatus || 'Pendiente';
    document.getElementById('editRespuesta').value = tramite.respuesta || '';
}


// =====================================
// CARGAR DETALLE DESDE EL BACKEND
// =====================================

async function cargarDetalleTramite() {

    if (!idTramite) {
        estadoCarga.hidden = true;
        estadoNoEncontrado.hidden = false;
        return;
    }

    estadoCarga.hidden = false;
    estadoCarga.textContent = 'Cargando información del trámite…';
    contenidoTramite.hidden = true;
    estadoNoEncontrado.hidden = true;

    try {

        const respuesta = await fetch(`/tramites/${idTramite}`);

        if (respuesta.status === 404) {
            estadoCarga.hidden = true;
            estadoNoEncontrado.hidden = false;
            return;
        }

        if (!respuesta.ok) {
            throw new Error('Error al obtener el detalle del trámite');
        }

        const tramite = await respuesta.json();
        pintarTramite(tramite);

        estadoCarga.hidden = true;
        contenidoTramite.hidden = false;

    } catch (error) {

        console.error('Error al cargar el detalle del trámite:', error);
        estadoCarga.textContent = 'Hubo un error al cargar la información. Intenta recargar la página.';

    }
}


// =====================================
// GUARDAR RESPUESTA (PUT /tramites/:id)
// =====================================

formResponderTramite.addEventListener('submit', async (e) => {

    e.preventDefault();

    mensajeGuardado.style.display = 'none';
    mensajeErrorEdit.style.display = 'none';

    const datosActualizados = {
        estatus: document.getElementById('editEstatus').value,
        respuesta: document.getElementById('editRespuesta').value,
        id_administrador: administradorSesion ? administradorSesion.id_administrador : null
    };

    try {

        const respuesta = await fetch(`/tramites/${idTramite}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo guardar la respuesta');
        }

        mensajeGuardado.textContent = 'La respuesta se guardó correctamente.';
        mensajeGuardado.style.display = 'block';

        cargarDetalleTramite();

    } catch (error) {

        console.error('Error al actualizar trámite:', error);
        mensajeErrorEdit.textContent = 'Hubo un error al guardar los cambios. Intenta de nuevo.';
        mensajeErrorEdit.style.display = 'block';

    }

});


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarDetalleTramite();
