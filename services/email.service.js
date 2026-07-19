const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarCredenciales = async (correoDestino, nombre, usuario, password) => {
    const mailOptions = {
        from: 'sistemaescolar55@gmail.com',
        to: correoDestino,
        subject: 'Bienvenido al Sistema Escolar - Tus Credenciales',
        html: `
            <h1>¡Bienvenido, ${nombre}!</h1>
            <p>Tu cuenta ha sido creada exitosamente. Aquí tienes tus accesos:</p>
            <ul>
                <li><strong>Usuario (Correo):</strong> ${usuario}</li>
                <li><strong>Contraseña:</strong> ${password}</li>
            </ul>
            <p>Por favor, cambia tu contraseña al ingresar por primera vez.</p>
        `
    };

    return await transporter.sendMail(mailOptions);
};

const enviarToken = async (correoDestino, token) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: correoDestino,
        subject: 'Recuperación de Contraseña - Código de Verificación',
        html: `<h1>Tu código de recuperación</h1>
               <p>Tu código de 6 dígitos es: <strong>${token}</strong></p>
               <p>Este código expira en 10 minutos.</p>`
    };
    return await transporter.sendMail(mailOptions);
};

module.exports = { enviarCredenciales, enviarToken };