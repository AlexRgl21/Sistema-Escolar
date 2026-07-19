// =====================================
// REFERENCIAS AL DOM
// =====================================

const lista = document.getElementById('listaAnuncios');
const formulario = document.getElementById('formAnuncio');

// Buscador por ID
const buscarId = document.getElementById('buscarIdAnuncio');
const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusquedaAnuncio');
const sinResultadosBusqueda = document.getElementById('sinResultadosBusquedaAnuncio');

// Administrador con la sesión iniciada (para registrar quién publica)
let administradorSesion = null;
try {
    administradorSesion = JSON.parse(localStorage.getItem('datosUsuario'));
} catch (error) {
    administradorSesion = null;
}


// =====================================
// BUSCADOR POR ID
// =====================================

function filtrarPorId(valorBusqueda) {
    const termino = (valorBusqueda || '').trim();
    const tarjetas = lista.querySelectorAll('.card');
    let visibles = 0;

    tarjetas.forEach(tarjeta => {
        const id = tarjeta.dataset.idAnuncio || '';
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
// CARGAR ANUNCIOS
// =====================================

async function cargarAnuncios() {

    try {

        const respuesta = await fetch('/anuncios');
        const datos = await respuesta.json();

        lista.innerHTML = '';

        datos.forEach(anuncio => {

            const autor = anuncio.nombre_administrador
                ? `${anuncio.nombre_administrador} ${anuncio.apellidos_administrador || ''}`.trim()
                : 'Administración';

            lista.innerHTML += `
                <div class="card" data-id-anuncio="${anuncio.id_anuncio}">

                    <p>
                        <strong>id_anuncio:</strong>
                        ${anuncio.id_anuncio}
                    </p>

                    <p>
                        <strong>Título:</strong>
                        ${escapeHtml(anuncio.titulo)}
                    </p>

                    <p>
                        <strong>Publicado:</strong>
                        ${formatearFechaHora(anuncio.fecha_publicacion)}
                    </p>

                    <p>
                        <strong>Por:</strong>
                        ${escapeHtml(autor)}
                    </p>

                    <div class="card-footer">
                        <a href="anuncio.html?id=${anuncio.id_anuncio}" class="btn-detalle">
                            Ver / editar
                        </a>
                    </div>

                </div>
            `;
        });

        filtrarPorId(buscarId.value);

    } catch(error) {

        console.error('Error al cargar anuncios:', error);

    }

}


// =====================================
// PUBLICAR ANUNCIO
// =====================================

formulario.addEventListener(
    'submit',
    async (e) => {

        e.preventDefault();

        const anuncio = {

            titulo:
                document.getElementById('titulo').value,

            contenido:
                document.getElementById('contenido').value,

            id_administrador:
                administradorSesion ? administradorSesion.id_administrador : null
        };

        try {

            const respuesta = await fetch('/anuncios', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(anuncio)

            });

            if (!respuesta.ok) {
                throw new Error('Hubo un problema al guardar en el servidor');
            }

            formulario.reset();

            cargarAnuncios();

        } catch(error) {

            console.error(
                'Error al publicar anuncio:',
                error
            );

        }

    }
);


// =====================================
// INICIO DE LA APLICACIÓN
// =====================================

cargarAnuncios();
