// =====================================
// REFERENCIAS AL DOM
// =====================================

const params = new URLSearchParams(window.location.search);
const idAnuncio = params.get('id');

const estadoCarga = document.getElementById('estadoCarga');
const estadoNoEncontrado = document.getElementById('estadoNoEncontrado');
const contenidoAnuncio = document.getElementById('contenidoAnuncio');

const idAnuncioTexto = document.getElementById('idAnuncioTexto');
const tituloAnuncioTexto = document.getElementById('tituloAnuncioTexto');
const metaAnuncio = document.getElementById('metaAnuncio');

const formEditarAnuncio = document.getElementById('formEditarAnuncio');
const mensajeGuardado = document.getElementById('mensajeGuardado');
const mensajeErrorEdit = document.getElementById('mensajeErrorEdit');

const btnEliminar = document.getElementById('btnEliminar');

let tituloActual = '';


// =====================================
// FORMATEAR FECHA Y HORA
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


// =====================================
// PINTAR LA INFORMACIÓN DEL ANUNCIO
// =====================================

function pintarAnuncio(anuncio) {

    tituloActual = anuncio.titulo || '';

    const autor = anuncio.nombre_administrador
        ? `${anuncio.nombre_administrador} ${anuncio.apellidos_administrador || ''}`.trim()
        : 'Administración';

    idAnuncioTexto.textContent = anuncio.id_anuncio;
    tituloAnuncioTexto.textContent = anuncio.titulo || '';
    metaAnuncio.textContent = `Publicado el ${formatearFechaHora(anuncio.fecha_publicacion)} por ${autor}`;

    document.getElementById('editTitulo').value = anuncio.titulo || '';
    document.getElementById('editContenido').value = anuncio.contenido || '';
}


// =====================================
// CARGAR DETALLE DESDE EL BACKEND
// =====================================

async function cargarDetalleAnuncio() {

    if (!idAnuncio) {
        estadoCarga.hidden = true;
        estadoNoEncontrado.hidden = false;
        return;
    }

    estadoCarga.hidden = false;
    estadoCarga.textContent = 'Cargando información del anuncio…';
    contenidoAnuncio.hidden = true;
    estadoNoEncontrado.hidden = true;

    try {

        const respuesta = await fetch(`/anuncios/${idAnuncio}`);

        if (respuesta.status === 404) {
            estadoCarga.hidden = true;
            estadoNoEncontrado.hidden = false;
            return;
        }

        if (!respuesta.ok) {
            throw new Error('Error al obtener el detalle del anuncio');
        }

        const anuncio = await respuesta.json();
        pintarAnuncio(anuncio);

        estadoCarga.hidden = true;
        contenidoAnuncio.hidden = false;

    } catch (error) {

        console.error('Error al cargar el detalle del anuncio:', error);
        estadoCarga.textContent = 'Hubo un error al cargar la información. Intenta recargar la página.';

    }
}


// =====================================
// GUARDAR CAMBIOS (PUT /anuncios/:id)
// =====================================

formEditarAnuncio.addEventListener('submit', async (e) => {

    e.preventDefault();

    mensajeGuardado.style.display = 'none';
    mensajeErrorEdit.style.display = 'none';

    const datosActualizados = {
        titulo: document.getElementById('editTitulo').value,
        contenido: document.getElementById('editContenido').value
    };

    try {

        const respuesta = await fetch(`/anuncios/${idAnuncio}`, {
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

        cargarDetalleAnuncio();

    } catch (error) {

        console.error('Error al actualizar anuncio:', error);
        mensajeErrorEdit.textContent = 'Hubo un error al guardar los cambios. Intenta de nuevo.';
        mensajeErrorEdit.style.display = 'block';

    }

});


// =====================================
// ELIMINAR ANUNCIO (DELETE /anuncios/:id)
// =====================================

btnEliminar.addEventListener('click', async () => {

    const nombreMostrado = tituloActual || `el anuncio #${idAnuncio}`;

    const confirmado = window.confirm(
        `¿Seguro que deseas eliminar "${nombreMostrado}"? Esta acción no se puede deshacer.`
    );

    if (!confirmado) return;

    try {

        const respuesta = await fetch(`/anuncios/${idAnuncio}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo eliminar el anuncio');
        }

        window.location.href = 'anuncios.html';

    } catch (error) {

        console.error('Error al eliminar anuncio:', error);
        alert('Hubo un error al eliminar el anuncio. Intenta de nuevo.');

    }

});


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarDetalleAnuncio();
