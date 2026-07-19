// =====================================
// REFERENCIAS AL DOM
// =====================================

const params = new URLSearchParams(window.location.search);
const idMateria = params.get('id');

const estadoCarga = document.getElementById('estadoCarga');
const estadoNoEncontrado = document.getElementById('estadoNoEncontrado');
const contenidoMateria = document.getElementById('contenidoMateria');

const idMateriaTexto = document.getElementById('idMateriaTexto');
const tituloMateria = document.getElementById('tituloMateria');

const formEditarMateria = document.getElementById('formEditarMateria');
const mensajeGuardado = document.getElementById('mensajeGuardado');
const mensajeErrorEdit = document.getElementById('mensajeErrorEdit');

const btnEliminar = document.getElementById('btnEliminar');
const mensajeErrorEliminar = document.getElementById('mensajeErrorEliminar');

// Se guarda para usarlo en el mensaje de confirmación al eliminar
let nombreMateriaActual = '';


// =====================================
// PINTAR LA INFORMACIÓN DE LA MATERIA
// =====================================

function pintarMateria(materia) {

    nombreMateriaActual = materia.nombre_materia || '';

    idMateriaTexto.textContent = materia.id_materia;
    tituloMateria.textContent = materia.nombre_materia || '';

    // Precarga el formulario de edición con los datos actuales
    document.getElementById('editNombreMateria').value = materia.nombre_materia || '';
    document.getElementById('editCreditos').value = materia.creditos || '';
}


// =====================================
// CARGAR DETALLE DESDE EL BACKEND
// =====================================

async function cargarDetalleMateria() {

    if (!idMateria) {
        estadoCarga.hidden = true;
        estadoNoEncontrado.hidden = false;
        return;
    }

    estadoCarga.hidden = false;
    estadoCarga.textContent = 'Cargando información de la materia…';
    contenidoMateria.hidden = true;
    estadoNoEncontrado.hidden = true;

    try {

        const respuesta = await fetch(`/materias/${idMateria}`);

        if (respuesta.status === 404) {
            estadoCarga.hidden = true;
            estadoNoEncontrado.hidden = false;
            return;
        }

        if (!respuesta.ok) {
            throw new Error('Error al obtener el detalle de la materia');
        }

        const materia = await respuesta.json();

        pintarMateria(materia);

        estadoCarga.hidden = true;
        contenidoMateria.hidden = false;

    } catch (error) {

        console.error('Error al cargar el detalle de la materia:', error);
        estadoCarga.textContent = 'Hubo un error al cargar la información. Intenta recargar la página.';

    }
}


// =====================================
// GUARDAR CAMBIOS (PUT /materias/:id)
// =====================================

formEditarMateria.addEventListener('submit', async (e) => {

    e.preventDefault();

    mensajeGuardado.style.display = 'none';
    mensajeErrorEdit.style.display = 'none';

    const datosActualizados = {
        nombre_materia: document.getElementById('editNombreMateria').value,
        creditos: document.getElementById('editCreditos').value
    };

    try {

        const respuesta = await fetch(`/materias/${idMateria}`, {
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

        // Refresca el encabezado con los datos ya guardados
        cargarDetalleMateria();

    } catch (error) {

        console.error('Error al actualizar materia:', error);
        mensajeErrorEdit.textContent = 'Hubo un error al guardar los cambios. Intenta de nuevo.';
        mensajeErrorEdit.style.display = 'block';

    }

});


// =====================================
// ELIMINAR MATERIA (DELETE /materias/:id)
// =====================================

btnEliminar.addEventListener('click', async () => {

    mensajeErrorEliminar.style.display = 'none';

    const nombreMostrado = nombreMateriaActual || `la materia #${idMateria}`;

    const confirmado = window.confirm(
        `¿Seguro que deseas eliminar ${nombreMostrado}? Esta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    try {

        const respuesta = await fetch(`/materias/${idMateria}`, {
            method: 'DELETE'
        });

        if (respuesta.status === 409) {
            const datos = await respuesta.json();
            mensajeErrorEliminar.textContent = datos.mensaje || 'No se puede eliminar esta materia.';
            mensajeErrorEliminar.style.display = 'block';
            return;
        }

        if (!respuesta.ok) {
            throw new Error('No se pudo eliminar la materia');
        }

        window.location.href = 'materias.html';

    } catch (error) {

        console.error('Error al eliminar materia:', error);
        mensajeErrorEliminar.textContent = 'Hubo un error al eliminar la materia. Intenta de nuevo.';
        mensajeErrorEliminar.style.display = 'block';

    }

});


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarDetalleMateria();
