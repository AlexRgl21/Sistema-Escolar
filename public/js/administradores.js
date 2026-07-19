// =====================================
// REFERENCIAS AL DOM
// =====================================

const lista = document.getElementById('listaAdministradores');
const formulario = document.getElementById('formAdministrador');

// Buscador por ID
const buscarId = document.getElementById('buscarIdAdmin');
const btnLimpiarBusqueda = document.getElementById('btnLimpiarBusquedaAdmin');
const sinResultadosBusqueda = document.getElementById('sinResultadosBusquedaAdmin');


// =====================================
// BUSCADOR POR ID
// =====================================

function filtrarPorId(valorBusqueda) {
    const termino = (valorBusqueda || '').trim();
    const tarjetas = lista.querySelectorAll('.card');
    let visibles = 0;

    tarjetas.forEach(tarjeta => {
        const id = tarjeta.dataset.idAdministrador || '';
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
// CARGAR ADMINISTRADORES
// =====================================

async function cargarAdministradores() {

    try {

        // Hace una petición GET al backend
        const respuesta = await fetch('/administradores');

        // Convierte la respuesta a JSON
        const datos = await respuesta.json();

        // Limpia el contenedor
        lista.innerHTML = '';

        // Recorre todos los administradores
        datos.forEach(admin => {

            lista.innerHTML += `
                <div class="card" data-id-administrador="${admin.id_administrador}">

                    <p>
                        <strong>id_administrador:</strong>
                        ${admin.id_administrador}
                    </p>

                    <p>
                        <strong>Nombre:</strong>
                        ${escapeHtml(admin.nombre)}
                    </p>

                    <p>
                        <strong>Apellidos:</strong>
                        ${escapeHtml(admin.apellidos)}
                    </p>

                    <p>
                        <strong>Correo:</strong>
                        ${escapeHtml(admin.correo)}
                    </p>

                    <p>
                        <strong>Contraseña:</strong>
                        ${escapeHtml(admin.contrasena)}
                    </p>

                    <p>
                        <strong>Estatus:</strong>
                        ${escapeHtml(admin.estatus)}
                    </p>
                    <p>
                        <strong>id_rol:</strong>
                        ${admin.id_rol}
                    </p>

                    <div class="card-footer">
                        <a href="administrador.html?id=${admin.id_administrador}" class="btn-detalle">
                            Ver detalles
                        </a>
                    </div>

                </div>
            `;
        });

        // Vuelve a aplicar el filtro de búsqueda vigente (por si ya había texto escrito)
        filtrarPorId(buscarId.value);

    } catch(error) {

        console.error('Error al cargar administradores:', error);

    }

}


// =====================================
// GUARDAR ADMINISTRADOR
// =====================================

formulario.addEventListener(
    'submit',
    async (e) => {

        // Evita que la página se recargue
        e.preventDefault();

        const administrador = {

            nombre:
                document.getElementById('nombre').value,

            apellidos:
                document.getElementById('apellidos').value,

            correo:
                document.getElementById('correo').value,

            contrasena:
                document.getElementById('contrasena').value,

            estatus:
                document.getElementById('estatus').value,

            id_rol:
                document.getElementById('id_rol').value
        };

        try {

            // Envía los datos al backend
            const respuesta = await fetch('/administradores', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(administrador)

            });

            if (!respuesta.ok) {
                throw new Error('Hubo un problema al guardar en el servidor');
            }

            // Limpia el formulario
            formulario.reset();

            // Actualiza la lista
            cargarAdministradores();

        } catch(error) {

            console.error(
                'Error al guardar administrador:',
                error
            );

        }

    }
);


// =====================================
// INICIO DE LA APLICACIÓN
// =====================================

// Carga los administradores al abrir la página
cargarAdministradores();
