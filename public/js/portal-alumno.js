// =====================================
// REFERENCIAS AL DOM
// =====================================

const alumnoSesion = obtenerAlumnoSesion();

const saludoAlumno = document.getElementById('saludoAlumno');
const statMaterias = document.getElementById('statMaterias');
const statPromedio = document.getElementById('statPromedio');
const ultimosAnunciosContenido = document.getElementById('ultimosAnunciosContenido');


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

function renderAnuncioResumen(anuncio) {
    return `
        <div class="anuncio-item">
            <div class="anuncio-item-header">
                <span class="anuncio-titulo">${escapeHtml(anuncio.titulo)}</span>
                <span class="anuncio-fecha">${formatearFechaHora(anuncio.fecha_publicacion)}</span>
            </div>
            <p class="anuncio-contenido">${escapeHtml(anuncio.contenido)}</p>
        </div>
    `;
}


// =====================================
// CARGAR LOS ÚLTIMOS ANUNCIOS
// =====================================

async function cargarUltimosAnuncios() {

    try {

        const respuesta = await fetch('/anuncios');

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los anuncios');
        }

        const anuncios = await respuesta.json();
        const ultimos = anuncios.slice(0, 3);

        ultimosAnunciosContenido.innerHTML = ultimos.length > 0
            ? ultimos.map(renderAnuncioResumen).join('')
            : '<p class="detalle-vacio">No hay anuncios publicados por el momento.</p>';

    } catch (error) {

        console.error('Error al cargar los últimos anuncios:', error);
        ultimosAnunciosContenido.innerHTML = '<p class="detalle-vacio">No se pudieron cargar los anuncios.</p>';

    }
}


// =====================================
// CARGAR RESUMEN DEL ALUMNO
// =====================================

async function cargarResumen() {

    if (!alumnoSesion) return;

    saludoAlumno.textContent = `Hola, ${alumnoSesion.nombre || ''} ${alumnoSesion.apellidos || ''}`.trim() || 'Hola';

    try {

        const respuesta = await fetch(`/alumnos/${alumnoSesion.id_alumno}/detalle`);

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar la información');
        }

        const datos = await respuesta.json();
        const inscripciones = datos.inscripciones || [];

        statMaterias.textContent = inscripciones.length;

        // Junta todas las notas numéricas de todas las materias para sacar un promedio general
        const notas = inscripciones
            .flatMap((inscripcion) => inscripcion.calificaciones || [])
            .map((calificacion) => parseFloat(calificacion.nota))
            .filter((nota) => !Number.isNaN(nota));

        if (notas.length > 0) {
            const promedio = notas.reduce((suma, nota) => suma + nota, 0) / notas.length;
            statPromedio.textContent = promedio.toFixed(1);
        } else {
            statPromedio.textContent = 'N/A';
        }

    } catch (error) {

        console.error('Error al cargar el resumen del alumno:', error);
        statMaterias.textContent = '--';
        statPromedio.textContent = '--';

    }
}


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarResumen();
cargarUltimosAnuncios();
