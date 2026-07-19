const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'gestion_escolar'
});

connection.connect((err) => {
    if (err) {
        console.log('Error de conexión');
        console.log(err);
        return;
    }
    console.log('MySQL conectado');
});

module.exports = connection;
