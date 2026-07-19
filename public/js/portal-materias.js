// =====================================
// REFERENCIAS AL DOM
// =====================================

const alumnoSesion = obtenerAlumnoSesion();

const estadoCargaMaterias = document.getElementById('estadoCargaMaterias');
const materiasContenido = document.getElementById('materiasContenido');


// =====================================
// RENDER: MATERIAS Y CALIFICACIONES (solo lectura, sin controles de edición)
// =====================================

function renderChipNotaSoloLectura(calificacion) {
    const notaNum = parseFloat(calificacion.nota);
    let clase = 'nota-chip';

    if (!Number.isNaN(notaNum)) {
        clase += notaNum >= 6 ? ' nota-aprobada' : ' nota-reprobada';
    }

    return `<span class="${clase}">${escapeHtml(calificacion.tipo_corte)}: ${escapeHtml(calificacion.nota)}</span>`;
}

function renderMateriaSoloLectura(inscripcion) {
    const nombreMateria = inscripcion.nombre_materia || 'Materia sin nombre';
    const creditos = inscripcion.creditos ? `${escapeHtml(inscripcion.creditos)} créditos` : '';

    const periodo = inscripcion.nombre_periodo
        ? `${escapeHtml(inscripcion.nombre_periodo)} (${formatearFecha(inscripcion.fecha_inicio)} – ${formatearFecha(inscripcion.fecha_fin)})`
        : 'Sin periodo asignado';

    const calificaciones = inscripcion.calificaciones || [];
    const calificacionesHtml = calificaciones.length > 0
        ? `<div class="calificaciones-lista">${calificaciones.map(renderChipNotaSoloLectura).join('')}</div>`
        : `<p class="nota-sin-registrar">Aún no tienes calificaciones registradas en esta materia</p>`;

    return `
        <div class="materia-item">
            <div class="materia-item-header">
                <span class="materia-nombre">${escapeHtml(nombreMateria)}</span>
                <span class="materia-creditos">${creditos}</span>
            </div>
            <div class="materia-periodo">Periodo: ${periodo}</div>
            ${calificacionesHtml}
        </div>
    `;
}


// =====================================
// CARGAR MATERIAS DEL ALUMNO
// =====================================

async function cargarMisMaterias() {

    if (!alumnoSesion) return;

    try {

        const respuesta = await fetch(`/alumnos/${alumnoSesion.id_alumno}/detalle`);

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar la información');
        }

        const datos = await respuesta.json();
        const inscripciones = datos.inscripciones || [];

        materiasContenido.innerHTML = inscripciones.length > 0
            ? inscripciones.map(renderMateriaSoloLectura).join('')
            : '<p class="detalle-vacio">Todavía no estás inscrito en ninguna materia.</p>';

        estadoCargaMaterias.hidden = true;

    } catch (error) {

        console.error('Error al cargar tus materias:', error);
        estadoCargaMaterias.textContent = 'Hubo un error al cargar tu información. Intenta recargar la página.';

    }
}


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarMisMaterias();
