// =====================================
// REFERENCIAS AL DOM
// =====================================

const params = new URLSearchParams(window.location.search);
const idPeriodo = params.get('id');

const estadoCarga = document.getElementById('estadoCarga');
const estadoNoEncontrado = document.getElementById('estadoNoEncontrado');
const contenidoPeriodo = document.getElementById('contenidoPeriodo');

const idPeriodoTexto = document.getElementById('idPeriodoTexto');
const tituloPeriodo = document.getElementById('tituloPeriodo');
const fechasPeriodo = document.getElementById('fechasPeriodo');
const badgeEstatusPeriodo = document.getElementById('badgeEstatusPeriodo');

const formEditarPeriodo = document.getElementById('formEditarPeriodo');
const mensajeGuardado = document.getElementById('mensajeGuardado');
const mensajeErrorEdit = document.getElementById('mensajeErrorEdit');

const btnEliminar = document.getElementById('btnEliminar');
const alumnosInscritosContenido = document.getElementById('alumnosInscritosContenido');
const linkAgregarMateria = document.getElementById('linkAgregarMateria');

// El id del periodo ya se conoce desde la URL, así que el enlace para
// inscribir alumnos se puede armar de inmediato (no depende de la carga).
// El enlace de "materia nueva" no depende del periodo, así que apunta
// directo a materias.html desde el propio HTML.
if (linkAgregarMateria && idPeriodo) {
    linkAgregarMateria.href = `inscribir-materia.html?id_periodo=${idPeriodo}`;
}

// Se guarda para usarlo en el mensaje de confirmación al eliminar
let nombrePeriodoActual = '';


// =====================================
// RENDER: ALUMNOS INSCRITOS (solo lectura)
// =====================================

function renderAlumnoInscrito(alumno) {
    const nombreCompleto = `${alumno.nombre || ''} ${alumno.apellidos || ''}`.trim() || 'Alumno sin nombre';

    const materias = alumno.materias || [];
    const materiasHtml = materias.length > 0
        ? `<div class="alumno-inscrito-materias">${materias
            .map((m) => `
                <span class="materia-chip">
                    ${escapeHtml(m.nombre_materia || 'Materia sin nombre')}
                    <button
                        type="button"
                        class="chip-eliminar"
                        data-id-inscripcion="${m.id_inscripcion}"
                        title="Quitar esta materia del alumno"
                    >×</button>
                </span>
            `)
            .join('')}</div>`
        : `<p class="nota-sin-registrar">Sin materias registradas en este periodo</p>`;

    return `
        <div class="alumno-inscrito-item">
            <div class="alumno-inscrito-header">
                <span class="alumno-inscrito-nombre">${escapeHtml(nombreCompleto)}</span>
                <span class="alumno-inscrito-id">id_alumno: ${alumno.id_alumno}</span>
            </div>
            <div class="alumno-inscrito-detalle">Correo: ${escapeHtml(alumno.correo || '')}</div>
            ${materiasHtml}
        </div>
    `;
}


// =====================================
// QUITAR UNA MATERIA DEL ALUMNO (DELETE /inscripciones/:id)
// =====================================

alumnosInscritosContenido.addEventListener('click', async (e) => {

    const boton = e.target.closest('.chip-eliminar');
    if (!boton) return;

    const idInscripcion = boton.dataset.idInscripcion;
    if (!idInscripcion) return;

    const confirmado = window.confirm('¿Quitar esta materia del alumno en este periodo? Se perderán también sus calificaciones de esa materia.');
    if (!confirmado) return;

    try {

        const respuesta = await fetch(`/inscripciones/${idInscripcion}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo quitar la materia');
        }

        // Refresca la lista de alumnos inscritos
        cargarDetallePeriodo();

    } catch (error) {

        console.error('Error al quitar la materia del alumno:', error);
        alert('Hubo un error al quitar la materia. Intenta de nuevo.');

    }

});


// =====================================
// PINTAR LA INFORMACIÓN DEL PERIODO
// =====================================

function pintarPeriodo(datos) {
    const periodo = datos.periodo;
    const alumnosInscritos = datos.alumnosInscritos || [];

    nombrePeriodoActual = periodo.nombre_periodo || '';

    idPeriodoTexto.textContent = periodo.id_periodos;
    tituloPeriodo.textContent = periodo.nombre_periodo || '';
    fechasPeriodo.textContent = `${formatearFecha(periodo.fecha_inicio)} – ${formatearFecha(periodo.fecha_fin)}`;

    const esActivo = (periodo.estatus || '').toLowerCase() === 'activo';
    badgeEstatusPeriodo.textContent = periodo.estatus || '';
    badgeEstatusPeriodo.className = `badge ${esActivo ? 'badge-activo' : 'badge-inactivo'}`;

    // Precarga el formulario de edición con los datos actuales
    document.getElementById('editNombrePeriodo').value = periodo.nombre_periodo || '';
    document.getElementById('editFechaInicio').value = (periodo.fecha_inicio || '').slice(0, 10);
    document.getElementById('editFechaFin').value = (periodo.fecha_fin || '').slice(0, 10);
    document.getElementById('editEstatus').value = periodo.estatus || '';

    alumnosInscritosContenido.innerHTML = alumnosInscritos.length > 0
        ? alumnosInscritos.map(renderAlumnoInscrito).join('')
        : '<p class="detalle-vacio">Todavía no hay alumnos inscritos en este periodo.</p>';
}


// =====================================
// CARGAR DETALLE DESDE EL BACKEND
// =====================================

async function cargarDetallePeriodo() {

    if (!idPeriodo) {
        estadoCarga.hidden = true;
        estadoNoEncontrado.hidden = false;
        return;
    }

    estadoCarga.hidden = false;
    estadoCarga.textContent = 'Cargando información del periodo…';
    contenidoPeriodo.hidden = true;
    estadoNoEncontrado.hidden = true;

    try {

        const respuesta = await fetch(`/periodos/${idPeriodo}/detalle`);

        if (respuesta.status === 404) {
            estadoCarga.hidden = true;
            estadoNoEncontrado.hidden = false;
            return;
        }

        if (!respuesta.ok) {
            throw new Error('Error al obtener el detalle del periodo');
        }

        const datos = await respuesta.json();
        pintarPeriodo(datos);

        estadoCarga.hidden = true;
        contenidoPeriodo.hidden = false;

    } catch (error) {

        console.error('Error al cargar el detalle del periodo:', error);
        estadoCarga.textContent = 'Hubo un error al cargar la información. Intenta recargar la página.';

    }
}


// =====================================
// GUARDAR CAMBIOS (PUT /periodos/:id)
// =====================================

formEditarPeriodo.addEventListener('submit', async (e) => {

    e.preventDefault();

    mensajeGuardado.style.display = 'none';
    mensajeErrorEdit.style.display = 'none';

    const datosActualizados = {
        nombre_periodo: document.getElementById('editNombrePeriodo').value,
        fecha_inicio: document.getElementById('editFechaInicio').value,
        fecha_fin: document.getElementById('editFechaFin').value,
        estatus: document.getElementById('editEstatus').value
    };

    try {

        const respuesta = await fetch(`/periodos/${idPeriodo}`, {
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

        // Refresca el encabezado (nombre, fechas, badge) con los datos ya guardados
        cargarDetallePeriodo();

    } catch (error) {

        console.error('Error al actualizar periodo:', error);
        mensajeErrorEdit.textContent = 'Hubo un error al guardar los cambios. Intenta de nuevo.';
        mensajeErrorEdit.style.display = 'block';

    }

});


// =====================================
// ELIMINAR PERIODO (DELETE /periodos/:id)
// =====================================

btnEliminar.addEventListener('click', async () => {

    const nombreMostrado = nombrePeriodoActual || `el periodo #${idPeriodo}`;

    const confirmado = window.confirm(
        `¿Seguro que deseas eliminar ${nombreMostrado}? Esta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    try {

        const respuesta = await fetch(`/periodos/${idPeriodo}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo eliminar el periodo');
        }

        window.location.href = 'periodos.html';

    } catch (error) {

        console.error('Error al eliminar periodo:', error);
        alert('Hubo un error al eliminar el periodo. Intenta de nuevo.');

    }

});


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarDetallePeriodo();
