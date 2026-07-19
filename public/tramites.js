// =====================================
// REFERENCIAS AL DOM
// =====================================

const lista = document.getElementById('listaTramites');

const buscarId = document.getElementById('buscarIdTramite');
const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusquedaTramite');
const sinResultadosBusqueda = document.getElementById('sinResultadosBusquedaTramite');


// =====================================
// BUSCADOR POR ID
// =====================================

function filtrarPorId(valorBusqueda) {
    const termino = (valorBusqueda || '').trim();
    const tarjetas = lista.querySelectorAll('.card');
    let visibles = 0;

    tarjetas.forEach(tarjeta => {
        const id = tarjeta.dataset.idTramite || '';
        const coincide = termino === '' || id.includes(termino);
        tarjeta.style.display = coincide ? '' : 'none';
        if (coincide) visibles++;
    });

    sinResultadosBusqueda.hidden = !(termino !== '' && visibles === 0);
    btnLimpiarBusqueda.hidden = termino === '';
}

buscarId.addEventListener('input', () => {
    filtrarPorId(buscarId.value);
});

btnLimpiarBusqueda.addEventListener('click', () => {
    buscarId.value = '';
    filtrarPorId('');
    buscarId.focus();
});


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
// CARGAR TRÁMITES
// =====================================

async function cargarTramites() {

    try {

        const respuesta = await fetch('/tramites');
        const datos = await respuesta.json();

        lista.innerHTML = '';

        if (datos.length === 0) {
            lista.innerHTML = '<p class="detalle-vacio">Todavía no hay ningún trámite registrado.</p>';
            return;
        }

        datos.forEach(tramite => {

            const nombreAlumno = `${tramite.nombre_alumno || ''} ${tramite.apellidos_alumno || ''}`.trim() || 'Alumno sin datos';

            lista.innerHTML += `
                <div class="card" data-id-tramite="${tramite.id_tramite}">

                    <p>
                        <strong>id_tramite:</strong>
                        ${tramite.id_tramite}
                    </p>

                    <p>
                        <strong>Alumno:</strong>
                        ${escapeHtml(nombreAlumno)} (id_alumno: ${tramite.id_alumno})
                    </p>

                    <p>
                        <strong>Tipo:</strong>
                        ${escapeHtml(tramite.tipo_tramite)}
                    </p>

                    <p>
                        <strong>Solicitado:</strong>
                        ${formatearFechaHora(tramite.fecha_solicitud)}
                    </p>

                    <p>
                        <strong>Estatus:</strong>
                        <span class="badge ${claseBadgeEstatus(tramite.estatus)}">${escapeHtml(tramite.estatus)}</span>
                    </p>

                    <div class="card-footer">
                        <a href="tramite.html?id=${tramite.id_tramite}" class="btn-detalle">
                            Revisar y responder
                        </a>
                    </div>

                </div>
            `;
        });

        filtrarPorId(buscarId.value);

    } catch(error) {

        console.error('Error al cargar trámites:', error);

    }

}


// =====================================
// INICIO DE LA APLICACIÓN
// =====================================

cargarTramites();
