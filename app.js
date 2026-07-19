const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const administradoresRoutes = require('./routes/administradores');
const alumnosRoutes = require('./routes/alumnos');
const periodosRoutes = require('./routes/periodos');
const materiasRoutes = require('./routes/materias');
const inscripcionesRoutes = require('./routes/inscripciones');
const calificacionesRoutes = require('./routes/calificaciones');
const anunciosRoutes = require('./routes/anuncios');
const tramitesRoutes = require('./routes/tramites');

app.use('/administradores', administradoresRoutes);
app.use('/alumnos', alumnosRoutes);
app.use('/periodos', periodosRoutes);
app.use('/materias', materiasRoutes);
app.use('/inscripciones', inscripcionesRoutes);
app.use('/calificaciones', calificacionesRoutes);
app.use('/anuncios', anunciosRoutes);
app.use('/tramites', tramitesRoutes);

app.get('/', (req, res) => {
    res.redirect('/pages/login.html');
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});
