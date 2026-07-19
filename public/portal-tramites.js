// =====================================
// REFERENCIAS AL DOM
// =====================================

const alumnoSesion = obtenerAlumnoSesion();

const formulario = document.getElementById('formTramite');
const mensajeExito = document.getElementById('mensajeExito');
const mensajeError = document.getElementById('mensajeError');

const estadoCargaTramites = document.getElementById('estadoCargaTramites');
const tramitesContenido = document.getElementById('tramitesContenido');


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

function renderTramite(tramite) {
    const respuestaHtml = tramite.respuesta
        ? `
            <div class="tramite-respuesta">
                <strong>Respuesta:</strong> ${escapeHtml(tramite.respuesta)}
                <div class="anuncio-fecha">${formatearFechaHora(tramite.fecha_respuesta)}</div>
            </div>
        `
        : `<p class="nota-sin-registrar">Todavía sin respuesta</p>`;

    return `
        <div class="tramite-item">
            <div class="alumno-inscrito-header">
                <span class="alumno-inscrito-nombre">${escapeHtml(tramite.tipo_tramite)}</span>
                <span class="badge ${claseBadgeEstatus(tramite.estatus)}">${escapeHtml(tramite.estatus)}</span>
            </div>
            <div class="alumno-inscrito-detalle">Solicitado el ${formatearFechaHora(tramite.fecha_solicitud)}</div>
            <p class="materia-periodo">${escapeHtml(tramite.descripcion || 'Sin descripción')}</p>
            ${respuestaHtml}
        </div>
    `;
}


// =====================================
// CARGAR MIS TRÁMITES
// =====================================

async function cargarMisTramites() {

    if (!alumnoSesion) return;

    try {

        const respuesta = await fetch(`/tramites/alumno/${alumnoSesion.id_alumno}`);

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar tus trámites');
        }

        const tramites = await respuesta.json();

        tramitesContenido.innerHTML = tramites.length > 0
            ? tramites.map(renderTramite).join('')
            : '<p class="detalle-vacio">Todavía no has solicitado ningún trámite.</p>';

        estadoCargaTramites.hidden = true;

    } catch (error) {

        console.error('Error al cargar tus trámites:', error);
        estadoCargaTramites.textContent = 'Hubo un error al cargar tus trámites. Intenta recargar la página.';

    }
}


// =====================================
// ENVIAR SOLICITUD (POST /tramites)
// =====================================

formulario.addEventListener('submit', async (e) => {

    e.preventDefault();

    mensajeExito.style.display = 'none';
    mensajeError.style.display = 'none';

    if (!alumnoSesion) return;

    const tramite = {
        id_alumno: alumnoSesion.id_alumno,
        tipo_tramite: document.getElementById('tipo_tramite').value,
        descripcion: document.getElementById('descripcion').value
    };

    try {

        const respuesta = await fetch('/tramites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tramite)
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo enviar la solicitud');
        }

        mensajeExito.textContent = 'Tu solicitud se envió correctamente. Puedes darle seguimiento aquí abajo.';
        mensajeExito.style.display = 'block';

        formulario.reset();

        cargarMisTramites();

    } catch (error) {

        console.error('Error al enviar trámite:', error);
        mensajeError.style.display = 'block';

    }

});


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarMisTramites();
