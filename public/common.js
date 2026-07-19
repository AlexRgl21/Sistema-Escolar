// =====================================
// UTILIDADES COMPARTIDAS
// (usadas por script.js en index.html y por alumno.js en alumno.html)
// =====================================

// Evita que datos guardados en la BD (nombre, correo, etc.) rompan el HTML
function escapeHtml(valor) {
    if (valor === null || valor === undefined) return '';
    return String(valor)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

// Convierte 'YYYY-MM-DD...' a 'DD/MM/YYYY' para mostrarlo más legible
function formatearFecha(fecha) {
    if (!fecha) return '';
    const soloFecha = String(fecha).slice(0, 10);
    const [anio, mes, dia] = soloFecha.split('-');
    if (!anio || !mes || !dia) return soloFecha;
    return `${dia}/${mes}/${anio}`;
}


// =====================================
// MENÚ SUPERIOR: SALUDO Y CERRAR SESIÓN
// =====================================

const navUserGreeting = document.getElementById('navUserGreeting');
const btnLogout = document.getElementById('btnLogout');

if (navUserGreeting) {
    try {
        const datosUsuario = JSON.parse(localStorage.getItem('datosUsuario'));
        if (datosUsuario && datosUsuario.nombre) {
            navUserGreeting.textContent = `Hola, ${datosUsuario.nombre}`;
        }
    } catch (error) {
        // No había sesión guardada; el saludo simplemente no se muestra
    }
}

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogueado');
        localStorage.removeItem('datosUsuario');
        localStorage.removeItem('tipoUsuario');
        window.location.href = 'login.html';
    });
}
