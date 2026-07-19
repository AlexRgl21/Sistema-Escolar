// =====================================
// REFERENCIAS AL DOM
// =====================================

const lista = document.getElementById('listaMaterias');
const formulario = document.getElementById('formMateria');

// Buscador por ID
const buscarId = document.getElementById('buscarIdMateria');
const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusquedaMateria');
const sinResultadosBusqueda = document.getElementById('sinResultadosBusquedaMateria');


// =====================================
// BUSCADOR POR ID
// =====================================

function filtrarPorId(valorBusqueda) {
    const termino = (valorBusqueda || '').trim();
    const tarjetas = lista.querySelectorAll('.card');
    let visibles = 0;

    tarjetas.forEach(tarjeta => {
        const id = tarjeta.dataset.idMateria || '';
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
// CARGAR MATERIAS
// =====================================

async function cargarMaterias() {

    try {

        // Hace una petición GET al backend
        const respuesta = await fetch('/materias');

        // Convierte la respuesta a JSON
        const datos = await respuesta.json();

        // Limpia el contenedor
        lista.innerHTML = '';

        // Recorre todas las materias
        datos.forEach(materia => {

            lista.innerHTML += `
                <div class="card" data-id-materia="${materia.id_materia}">

                    <p>
                        <strong>id_materia:</strong>
                        ${materia.id_materia}
                    </p>

                    <p>
                        <strong>Nombre:</strong>
                        ${escapeHtml(materia.nombre_materia)}
                    </p>

                    <p>
                        <strong>Créditos:</strong>
                        ${escapeHtml(materia.creditos)}
                    </p>

                    <div class="card-footer">
                        <a href="materia.html?id=${materia.id_materia}" class="btn-detalle">
                            Ver detalles
                        </a>
                    </div>

                </div>
            `;
        });

        // Vuelve a aplicar el filtro de búsqueda vigente (por si ya había texto escrito)
        filtrarPorId(buscarId.value);

    } catch(error) {

        console.error('Error al cargar materias:', error);

    }

}


// =====================================
// GUARDAR MATERIA
// =====================================

formulario.addEventListener(
    'submit',
    async (e) => {

        // Evita que la página se recargue
        e.preventDefault();

        const materia = {

            nombre_materia:
                document.getElementById('nombre_materia').value,

            creditos:
                document.getElementById('creditos').value
        };

        try {

            // Envía los datos al backend
            const respuesta = await fetch('/materias', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(materia)

            });

            if (!respuesta.ok) {
                throw new Error('Hubo un problema al guardar en el servidor');
            }

            // Limpia el formulario
            formulario.reset();

            // Actualiza la lista
            cargarMaterias();

        } catch(error) {

            console.error(
                'Error al guardar materia:',
                error
            );

        }

    }
);


// =====================================
// INICIO DE LA APLICACIÓN
// =====================================

// Carga las materias al abrir la página
cargarMaterias();
