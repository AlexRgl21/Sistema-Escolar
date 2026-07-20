// =====================================
// REFERENCIAS AL DOM
// =====================================

// Lista de alumnos y formulario de alta
const lista = document.getElementById('listaEntrenadores');
const formulario = document.getElementById('formEntrenador');

// Nuevas referencias para alternar el formulario
const btnAñadir = document.getElementById('btnAñadir');
const contenedorFormulario = document.getElementById('contenedorFormulario');

// Buscador por ID
const buscarId = document.getElementById('buscarId');
const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusqueda');
const sinResultadosBusqueda = document.getElementById('sinResultadosBusqueda');


// =====================================
// ALTERNAR FORMULARIO
// =====================================

btnAñadir.addEventListener('click', () => {
    if (contenedorFormulario.style.display === 'none') {
        // Mostrar el formulario
        contenedorFormulario.style.display = 'block';
        btnAñadir.textContent = '✕ Cancelar registro';
        btnAñadir.style.backgroundColor = '#6c757d'; // Color gris para cancelar
    } else {
        // Ocultar el formulario
        contenedorFormulario.style.display = 'none';
        btnAñadir.textContent = '+ Añadir nuevo alumno';
        btnAñadir.style.backgroundColor = ''; // Restaura el color original
    }
});


// =====================================
// BUSCADOR POR ID
// =====================================

function filtrarPorId(valorBusqueda) {
    const termino = (valorBusqueda || '').trim();
    const tarjetas = lista.querySelectorAll('.card');
    let visibles = 0;

    tarjetas.forEach(tarjeta => {
        const id = tarjeta.dataset.idAlumno || '';
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
// CARGAR ALUMNOS
// =====================================

async function cargarEntrenadores() {

    try {
        // Hace una petición GET al backend
        const respuesta = await fetch('/alumnos');

        // Convierte la respuesta a JSON
        const datos = await respuesta.json();

        // Limpia el contenedor
        lista.innerHTML = '';

        // Recorre todos los alumnos
        datos.forEach(entrenador => {

            lista.innerHTML += `
                <div class="card" data-id-alumno="${entrenador.id_alumno}">

                    <p>
                        <strong>id_alumno:</strong>
                        ${entrenador.id_alumno}
                    </p>

                    <p>
                        <strong>Nombre:</strong>
                        ${escapeHtml(entrenador.nombre)}
                    </p>

                    <p>
                        <strong>Apellidos:</strong>
                        ${escapeHtml(entrenador.apellidos)}
                    </p>

                    <p>
                        <strong>Correo:</strong>
                        ${escapeHtml(entrenador.correo)}
                    </p>

                    <p>
                        <strong>Estatus:</strong>
                        ${escapeHtml(entrenador.estatus)}
                    </p>
                    <p>
                        <strong>id_rol:</strong>
                        ${entrenador.id_rol}
                    </p>

                    <div class="card-footer">
                        <a href="alumno.html?id=${entrenador.id_alumno}" class="btn-detalle">
                            Ver detalles (materias y calificaciones)
                        </a>
                    </div>

                </div>
            `;
        });

        // Vuelve a aplicar el filtro de búsqueda vigente (por si ya había texto escrito)
        filtrarPorId(buscarId.value);

    } catch(error) {
        console.error('Error al cargar alumnos:', error);
    }
}


// =====================================
// GUARDAR ALUMNO
// =====================================

formulario.addEventListener(
    'submit',
    async (e) => {

        // Evita que la página se recargue
        e.preventDefault();

        const usuario = {
            nombre: document.getElementById('nombre').value,
            apellidos: document.getElementById('apellidos').value,
            correo: document.getElementById('correo').value,
            estatus: document.getElementById('estatus').value,
            id_rol: document.getElementById('id_rol').value
        };

        try {

            // Envía los datos al backend
            const respuesta = await fetch('/alumnos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            if (!respuesta.ok) {
                throw new Error('Hubo un problema al guardar en el servidor');
            }

            // Limpia el formulario
            formulario.reset();

            // Actualiza la lista
            cargarEntrenadores();

            // Ocultar formulario tras guardar exitosamente
            contenedorFormulario.style.display = 'none';
            btnAñadir.textContent = '+ Añadir nuevo alumno';
            btnAñadir.style.backgroundColor = '';

        } catch(error) {
            console.error('Error al guardar alumno:', error);
        }
    }
);


// =====================================
// INICIO DE LA APLICACIÓN
// =====================================

// Carga los alumnos al abrir la página
cargarEntrenadores();