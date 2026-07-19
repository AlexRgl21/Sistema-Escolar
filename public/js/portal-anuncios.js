// =====================================
// REFERENCIAS AL DOM
// =====================================

const estadoCargaAnuncios = document.getElementById('estadoCargaAnuncios');
const anunciosContenido = document.getElementById('anunciosContenido');


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

function renderAnuncio(anuncio) {
    const autor = anuncio.nombre_administrador
        ? `${anuncio.nombre_administrador} ${anuncio.apellidos_administrador || ''}`.trim()
        : 'Administración';

    return `
        <div class="anuncio-item">
            <div class="anuncio-item-header">
                <span class="anuncio-titulo">${escapeHtml(anuncio.titulo)}</span>
                <span class="anuncio-fecha">${formatearFechaHora(anuncio.fecha_publicacion)}</span>
            </div>
            <p class="anuncio-contenido">${escapeHtml(anuncio.contenido)}</p>
            <p class="anuncio-autor">Publicado por ${escapeHtml(autor)}</p>
        </div>
    `;
}


// =====================================
// CARGAR ANUNCIOS
// =====================================

async function cargarAnuncios() {

    try {

        const respuesta = await fetch('/anuncios');

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los anuncios');
        }

        const anuncios = await respuesta.json();

        anunciosContenido.innerHTML = anuncios.length > 0
            ? anuncios.map(renderAnuncio).join('')
            : '<p class="detalle-vacio">No hay anuncios publicados por el momento.</p>';

        estadoCargaAnuncios.hidden = true;

    } catch (error) {

        console.error('Error al cargar anuncios:', error);
        estadoCargaAnuncios.textContent = 'Hubo un error al cargar los anuncios. Intenta recargar la página.';

    }
}


// =====================================
// INICIO DE LA PÁGINA
// =====================================

cargarAnuncios();
