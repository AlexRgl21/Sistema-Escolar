// =====================================
// REFERENCIAS AL DOM
// =====================================

const params = new URLSearchParams(window.location.search);
const idAlumno = params.get('id');

const estadoCarga = document.getElementById('estadoCarga');
const estadoNoEncontrado = document.getElementById('estadoNoEncontrado');
const contenidoAlumno = document.getElementById('contenidoAlumno');

const idAlumnoTexto = document.getElementById('idAlumnoTexto');
const tituloAlumno = document.getElementById('tituloAlumno');
const correoAlumno = document.getElementById('correoAlumno');
const badgeEstatus = document.getElementById('badgeEstatus');

const formEditar = document.getElementById('formEditar');
const mensajeGuardado = document.getElementById('mensajeGuardado');
const mensajeErrorEdit = document.getElementById('mensajeErrorEdit');

const btnEliminar = document.getElementById('btnEliminar');
const academicoContenido = document.getElementById('academicoContenido');

// Se guardan para usarlos en el mensaje de confirmación al eliminar
let nombreActual = '';
let apellidosActual = '';


// =====================================
// RENDER: MATERIAS, PERIODOS Y CALIFICACIONES (solo lectura)
// =====================================

function renderChipNota(calificacion) {
    const notaNum = parseFloat(calificacion.nota);
    let clase = 'nota-chip';

    if (!Number.isNaN(notaNum)) {
        clase += notaNum >= 6 ? ' nota-aprobada' : ' nota-reprobada';
    }

    return `
        <span class="${clase}">
            ${escapeHtml(calificacion.tipo_corte)}: ${escapeHtml(calificacion.nota)}
            <button
                type="button"
                class="chip-eliminar"
                data-id-calificacion="${calificacion.id_calificacion}"
                title="Eliminar esta calificación"
            >×</button>
        </span>
    `;
}

function renderMateriaItem(inscripcion) {
    const nombreMateria = inscripcion.nombre_materia || 'Materia sin nombre';
    const creditos = inscripcion.creditos ? `${escapeHtml(inscripcion.creditos)} créditos` : '';

    const periodo = inscripcion.nombre_periodo
        ? `${escapeHtml(inscripcion.nombre_periodo)} (${formatearFecha(inscripcion.fecha_inicio)} – ${formatearFecha(inscripcion.fecha_fin)})`
        : 'Sin periodo asignado';

    const calificaciones = inscripcion.calificaciones || [];
    const calificacionesHtml = calificaciones.length > 0
        ? `<div class="calificaciones-lista">${calificaciones.map(renderChipNota).join('')}</div>`
        : `<p class="nota-sin-registrar">Sin calificaciones registradas</p>`;

    return `
        <div class="materia-item">
            <div class="materia-item-header">
                <span class="materia-nombre">${escapeHtml(nombreMateria)}</span>
                <span class="materia-creditos">${creditos}</span>
                <button
                    type="button"
                    class="btn-quitar-materia"
                    data-id-inscripcion="${inscripcion.id_inscripcion}"
                    title="Quitar esta materia del alumno"
                >Quitar materia</button>
            </div>
            <div class="materia-periodo">Periodo: ${periodo}</div>
            ${calificacionesHtml}

            <form class="form-calificacion" data-id-inscripcion="${inscripcion.id_inscripcion}">
                <input type="text" class="input-tipo-corte" placeholder="Ej. Corte 1" maxlength="45" required>
                <input type="number" class="input-nota" placeholder="Nota" step="0.1" min="0" max="10" required>
                <button type="submit" class="btn-agregar-nota">Agregar</button>
            </form>
        </div>
    `;
}


// =====================================
// PINTAR LA INFORMACIÓN DEL ALUMNO
// =====================================

function pintarAlumno(datos) {
    const alumno = datos.alumno;
    const inscripciones = datos.inscripciones || [];

    nombreActual = alumno.nombre || '';
    apellidosActual = alumno.apellidos || '';

    idAlumnoTexto.textContent = alumno.id_alumno;
    tituloAlumno.textContent = `${alumno.nombre || ''} ${alumno.apellidos || ''}`.trim();
    correoAlumno.textContent = alumno.correo || '';

    const esActivo = (alumno.estatus || '').toLowerCase() === 'activo';
    badgeEstatus.textContent = alumno.estatus || '';
    badgeEstatus.className = `badge ${esActivo ? 'badge-activo' : 'badge-inactivo'}`;

    // Precarga el formulario de edición con los datos actuales
    document.getElementById('editNombre').value = alumno.nombre || '';
    document.getElementById('editApellidos').value = alumno.apellidos || '';
    document.getElementById('editCorreo').value = alumno.correo || '';
    document.getElementById('editContrasena').value = alumno.contrasena || '';
    document.getElementById('editEstatus').value = alumno.estatus || '';
    document.getElementById('editIdRol').value = alumno.id_rol ?? '';

    academicoContenido.innerHTML = inscripciones.length > 0
        ? inscripciones.map(renderMateriaItem).join('')
        : '<p class="detalle-vacio">Este alumno no tiene materias inscritas todavía.</p>';
}


// =====================================
// CAPTURAR CALIFICACIÓN (POST /calificaciones)
// =====================================

academicoContenido.addEventListener('submit', async (e) => {

    const formNota = e.target.closest('.form-calificacion');
    if (!formNota) return;

    e.preventDefault();

    const idInscripcion = formNota.dataset.idInscripcion;
    const tipoCorte = formNota.querySelector('.input-tipo-corte').value;
    const nota = formNota.querySelector('.input-nota').value;

    const calificacion = {
        id_inscripcion: idInscripcion,
        tipo_corte: tipoCorte,
        nota: nota
    };

    try {

        const respuesta = await fetch('/calificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(calificacion)
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo guardar la calificación');
        }

        // Refresca la sección de materias y calificaciones
        cargarDetalleAlumno();

    } catch (error) {

        console.error('Error al capturar calificación:', error);
        alert('Hubo un error al guardar la calificación. Intenta de nuevo.');

    }

});


// =====================================
// ELIMINAR CALIFICACIÓN Y QUITAR MATERIA (delegado en el mismo contenedor)
// =====================================

academicoContenido.addEventListener('click', async (e) => {

    const botonNota = e.target.closest('.chip-eliminar');
    const botonMateria = e.target.closest('.btn-quitar-materia');

    if (botonNota) {

        const idCalificacion = botonNota.dataset.idCalificacion;
        if (!idCalificacion) return;

        const confirmado = window.confirm('¿Eliminar esta calificación?');
        if (!confirmado) return;

        try {

            const respuesta = await fetch(`/calificaciones/${idCalificacion}`, {
                method: 'DELETE'
            });

            if (!respuesta.ok) {
                throw new Error('No se pudo eliminar la calificación');
            }

            cargarDetalleAlumno();

        } catch (error) {

            console.error('Error al eliminar calificación:', error);
            alert('Hubo un error al eliminar la calificación. Intenta de nuevo.');

        }

        return;
    }

    if (botonMateria) {

        const idInscripcion = botonMateria.dataset.idInscripcion;
        if (!idInscripcion) return;

        const confirmado = window.confirm('¿Quitar esta materia del alumno? También se eliminarán sus calificaciones en ella.');
        if (!confirmado) return;

        try {

            const respuesta = await fetch(`/inscripciones/${idInscripcion}`, {
                method: 'DELETE'
            });

            if (!respuesta.ok) {
                throw new Error('No se pudo quitar la materia');
            }

            cargarDetalleAlumno();

        } catch (error) {

            console.error('Error al quitar la materia:', error);
            alert('Hubo un error al quitar la materia. Intenta de nuevo.');

        }

    }

});


// =====================================
// CARGAR DETALLE DESDE EL BACKEND
// =====================================

async function cargarDetalleAlumno() {

    if (!idAlumno) {
        estadoCarga.hidden = true;
        estadoNoEncontrado.hidden = false;
        return;
    }

    estadoCarga.hidden = false;
    estadoCarga.textContent = 'Cargando información del alumno…';
    contenidoAlumno.hidden = true;
    estadoNoEncontrado.hidden = true;

    try {

        const respuesta = await fetch(`/alumnos/${idAlumno}/detalle`);

        if (respuesta.status === 404) {
            estadoCarga.hidden = true;
            estadoNoEncontrado.hidden = false;
            return;
        }

        if (!respuesta.ok) {
            throw new Error('Error al obtener el detalle del alumno');
        }

        const datos = await respuesta.json();
        pintarAlumno(datos);

        estadoCarga.hidden = true;
        contenidoAlumno.hidden = false;

    } catch (error) {

        console.error('Error al cargar el detalle del alumno:', error);
        estadoCarga.textContent = 'Hubo un error al cargar la información. Intenta recargar la página.';

    }
}


// =====================================
// GUARDAR CAMBIOS (PUT /alumnos/:id)
// =====================================

formEditar.addEventListener('submit', async (e) => {

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

        const respuesta = await fetch(`/alumnos/${idAlumno}`, {
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
        cargarDetalleAlumno();

    } catch (error) {

        console.error('Error al actualizar alumno:', error);
        mensajeErrorEdit.textContent = 'Hubo un error al guardar los cambios. Intenta de nuevo.';
        mensajeErrorEdit.style.display = 'block';

    }

});


// =====================================
// ELIMINAR ALUMNO (DELETE /alumnos/:id)
// =====================================

btnEliminar.addEventListener('click', async () => {

    const nombreCompleto = `${nombreActual} ${apellidosActual}`.trim() || `el alumno #${idAlumno}`;

    const confirmado = window.confirm(
        `¿Seguro que deseas eliminar a ${nombreCompleto}? Esta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    try {

        const respuesta = await fetch(`/alumnos/${idAlumno}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo eliminar al alumno');
        }

        window.location.href = 'index.html';

    } catch (error) {

        console.error('Error al eliminar alumno:', error);
        alert('Hubo un error al eliminar al alumno. Intenta de nuevo.');

    }

});


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarDetalleAlumno();
