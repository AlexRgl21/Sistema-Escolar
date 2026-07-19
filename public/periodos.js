// =====================================
// REFERENCIAS AL DOM
// =====================================

const lista = document.getElementById('listaPeriodos');
const formulario = document.getElementById('formPeriodo');

// Buscador por ID
const buscarId = document.getElementById('buscarIdPeriodo');
const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusquedaPeriodo');
const sinResultadosBusqueda = document.getElementById('sinResultadosBusquedaPeriodo');


// =====================================
// BUSCADOR POR ID
// =====================================

function filtrarPorId(valorBusqueda) {
    const termino = (valorBusqueda || '').trim();
    const tarjetas = lista.querySelectorAll('.card');
    let visibles = 0;

    tarjetas.forEach(tarjeta => {
        const id = tarjeta.dataset.idPeriodo || '';
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
// CARGAR PERIODOS
// =====================================

async function cargarPeriodos() {

    try {

        // Hace una petición GET al backend
        const respuesta = await fetch('/periodos');

        // Convierte la respuesta a JSON
        const datos = await respuesta.json();

        // Limpia el contenedor
        lista.innerHTML = '';

        // Recorre todos los periodos
        datos.forEach(periodo => {

            const esActivo = (periodo.estatus || '').toLowerCase() === 'activo';

            lista.innerHTML += `
                <div class="card" data-id-periodo="${periodo.id_periodos}">

                    <p>
                        <strong>id_periodo:</strong>
                        ${periodo.id_periodos}
                    </p>

                    <p>
                        <strong>Nombre:</strong>
                        ${escapeHtml(periodo.nombre_periodo)}
                    </p>

                    <p>
                        <strong>Fecha de inicio:</strong>
                        ${formatearFecha(periodo.fecha_inicio)}
                    </p>

                    <p>
                        <strong>Fecha de fin:</strong>
                        ${formatearFecha(periodo.fecha_fin)}
                    </p>

                    <p>
                        <strong>Estatus:</strong>
                        <span class="badge ${esActivo ? 'badge-activo' : 'badge-inactivo'}">${escapeHtml(periodo.estatus)}</span>
                    </p>

                    <div class="card-footer">
                        <a href="periodo.html?id=${periodo.id_periodos}" class="btn-detalle">
                            Ver detalles (alumnos inscritos)
                        </a>
                    </div>

                </div>
            `;
        });

        // Vuelve a aplicar el filtro de búsqueda vigente (por si ya había texto escrito)
        filtrarPorId(buscarId.value);

    } catch(error) {

        console.error('Error al cargar periodos:', error);

    }

}


// =====================================
// GUARDAR PERIODO
// =====================================

formulario.addEventListener(
    'submit',
    async (e) => {

        // Evita que la página se recargue
        e.preventDefault();

        const periodo = {

            nombre_periodo:
                document.getElementById('nombre_periodo').value,

            fecha_inicio:
                document.getElementById('fecha_inicio').value,

            fecha_fin:
                document.getElementById('fecha_fin').value,

            estatus:
                document.getElementById('estatus').value
        };

        try {

            // Envía los datos al backend
            const respuesta = await fetch('/periodos', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(periodo)

            });

            if (!respuesta.ok) {
                throw new Error('Hubo un problema al guardar en el servidor');
            }

            // Limpia el formulario
            formulario.reset();

            // Actualiza la lista
            cargarPeriodos();

        } catch(error) {

            console.error(
                'Error al guardar periodo:',
                error
            );

        }

    }
);


// =====================================
// INICIO DE LA APLICACIÓN
// =====================================

// Carga los periodos al abrir la página
cargarPeriodos();
