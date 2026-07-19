// =====================================
// REFERENCIAS AL DOM
// =====================================

const params = new URLSearchParams(window.location.search);
const idPeriodo = params.get('id_periodo');

const tituloPeriodoTexto = document.getElementById('tituloPeriodoTexto');
const selectAlumno = document.getElementById('id_alumno');
const selectMateria = document.getElementById('id_materia');
const formulario = document.getElementById('formInscripcion');
const mensajeExito = document.getElementById('mensajeExito');
const mensajeError = document.getElementById('mensajeError');
const volverPeriodo = document.getElementById('volverPeriodo');

if (idPeriodo) {
    volverPeriodo.href = `periodo.html?id=${idPeriodo}`;
}


// =====================================
// CARGAR DATOS DEL PERIODO (solo para mostrar el título)
// =====================================

async function cargarPeriodo() {

    if (!idPeriodo) {
        tituloPeriodoTexto.textContent = 'No se especificó ningún periodo. Vuelve a la lista de periodos e intenta de nuevo.';
        return;
    }

    try {

        const respuesta = await fetch(`/periodos/${idPeriodo}`);

        if (!respuesta.ok) {
            throw new Error('No se pudo obtener el periodo');
        }

        const periodo = await respuesta.json();
        tituloPeriodoTexto.textContent = `Periodo: ${periodo.nombre_periodo} (ID ${periodo.id_periodos})`;

    } catch (error) {

        console.error('Error al cargar el periodo:', error);
        tituloPeriodoTexto.textContent = 'No se pudo cargar la información del periodo.';

    }
}


// =====================================
// CARGAR ALUMNOS Y MATERIAS PARA LOS SELECT
// =====================================

async function cargarAlumnos() {

    try {

        const respuesta = await fetch('/alumnos');
        const alumnos = await respuesta.json();

        alumnos.forEach((alumno) => {
            const opcion = document.createElement('option');
            opcion.value = alumno.id_alumno;
            opcion.textContent = `${alumno.id_alumno} - ${alumno.nombre || ''} ${alumno.apellidos || ''}`.trim();
            selectAlumno.appendChild(opcion);
        });

    } catch (error) {

        console.error('Error al cargar alumnos:', error);

    }
}

async function cargarMaterias() {

    try {

        const respuesta = await fetch('/materias');
        const materias = await respuesta.json();

        if (materias.length === 0) {
            const opcion = document.createElement('option');
            opcion.value = '';
            opcion.disabled = true;
            opcion.textContent = 'No hay materias registradas todavía';
            selectMateria.appendChild(opcion);
            return;
        }

        materias.forEach((materia) => {
            const opcion = document.createElement('option');
            opcion.value = materia.id_materia;
            opcion.textContent = materia.nombre_materia || `Materia #${materia.id_materia}`;
            selectMateria.appendChild(opcion);
        });

    } catch (error) {

        console.error('Error al cargar materias:', error);

    }
}


// =====================================
// GUARDAR INSCRIPCIÓN (POST /inscripciones)
// =====================================

formulario.addEventListener('submit', async (e) => {

    e.preventDefault();

    mensajeExito.style.display = 'none';
    mensajeError.style.display = 'none';

    if (!idPeriodo) {
        mensajeError.textContent = 'No se especificó ningún periodo.';
        mensajeError.style.display = 'block';
        return;
    }

    const inscripcion = {
        id_alumno: selectAlumno.value,
        id_materia: selectMateria.value,
        id_periodo: idPeriodo
    };

    try {

        const respuesta = await fetch('/inscripciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inscripcion)
        });

        if (respuesta.status === 409) {
            const datos = await respuesta.json();
            mensajeError.textContent = datos.mensaje || 'Este alumno ya está inscrito en esta materia en este periodo.';
            mensajeError.style.display = 'block';
            return;
        }

        if (!respuesta.ok) {
            throw new Error('No se pudo guardar la inscripción');
        }

        mensajeExito.textContent = 'Materia agregada correctamente al periodo. Puedes cerrar esta ventana o agregar otra.';
        mensajeExito.style.display = 'block';

        formulario.reset();

    } catch (error) {

        console.error('Error al agregar materia al periodo:', error);
        mensajeError.textContent = 'Hubo un error al procesar la solicitud, intente de nuevo';
        mensajeError.style.display = 'block';

    }

});


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarPeriodo();
cargarAlumnos();
cargarMaterias();
