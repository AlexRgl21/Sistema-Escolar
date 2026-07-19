// =====================================
// PROTEGE LAS PÁGINAS DEL PORTAL DEL ALUMNO
// (se incluye después de common.js en cada página del portal)
// =====================================

(function protegerPortalAlumno() {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    const datosUsuarioRaw = localStorage.getItem('datosUsuario');

    // Si no hay una sesión de alumno guardada, regresa al login
    if (tipoUsuario !== 'alumno' || !datosUsuarioRaw) {
        window.location.href = 'login.html';
    }
})();

// Devuelve los datos del alumno con la sesión iniciada (id_alumno, nombre, etc.)
function obtenerAlumnoSesion() {
    try {
        return JSON.parse(localStorage.getItem('datosUsuario'));
    } catch (error) {
        return null;
    }
}
