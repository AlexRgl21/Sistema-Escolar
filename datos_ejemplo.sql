-- =========================================================
-- DATOS DE EJEMPLO para gestion_escolar
-- Ejecuta este script en MySQL Workbench (o con el cliente
-- de línea de comandos) DESPUÉS de haber importado
-- Dump20260708.sql, para tener periodos, materias e
-- inscripciones de prueba y así ver la nueva página de
-- Periodos con alumnos inscritos.
-- =========================================================

USE `gestion_escolar`;

-- ---------------------------------------------------------
-- Alumnos adicionales (ya existe id_alumno = 1, Leonardo)
-- ---------------------------------------------------------
INSERT INTO `alumnos` (`nombre`, `apellidos`, `correo`, `contrasena`, `estatus`, `id_rol`) VALUES
('Ana',      'García López',      'ana.garcia@gmail.com',    'ana123',    'Activo',   1),
('Carlos',   'Martínez Sánchez',  'carlos.martinez@gmail.com','carlos123','Activo',   1),
('Fernanda', 'Torres Jiménez',    'fernanda.torres@gmail.com','fer123',   'Activo',   1),
('Miguel',   'Hernández Cruz',    'miguel.hernandez@gmail.com','miguel123','Inactivo',1);

-- ---------------------------------------------------------
-- Administrador adicional (ya existe id_administrador = 1, Diego)
-- ---------------------------------------------------------
INSERT INTO `administradores` (`nombre`, `apellidos`, `correo`, `contrasena`, `estatus`, `id_rol`) VALUES
('Valeria', 'Reyes Moreno', 'valeria.reyes@gmail.com', 'valeria123', 'Activo', 2);

-- ---------------------------------------------------------
-- Materias
-- ---------------------------------------------------------
INSERT INTO `materias` (`nombre_materia`, `creditos`) VALUES
('Programación Web',        '8'),
('Bases de Datos',          '8'),
('Matemáticas Discretas',   '6'),
('Inglés III',              '4');

-- ---------------------------------------------------------
-- Periodos
-- ---------------------------------------------------------
INSERT INTO `periodos` (`nombre_periodo`, `fecha_inicio`, `fecha_fin`, `estatus`) VALUES
('Enero - Junio 2026',   '2026-01-19', '2026-06-12', 'Activo'),
('Agosto - Diciembre 2025', '2025-08-11', '2025-12-05', 'Inactivo');

-- ---------------------------------------------------------
-- Inscripciones
-- (Ajusta los IDs si tu base de datos ya tenía otros
-- registros y los autoincrementales no arrancan en 1)
-- ---------------------------------------------------------
-- Alumnos: 1 Leonardo, 2 Ana, 3 Carlos, 4 Fernanda, 5 Miguel
-- Materias: 1 Programación Web, 2 Bases de Datos, 3 Matemáticas Discretas, 4 Inglés III
-- Periodos: 1 Enero-Junio 2026, 2 Agosto-Diciembre 2025

INSERT INTO `inscripciones` (`id_alumno`, `id_materia`, `id_periodo`) VALUES
(1, 1, 1),  -- Leonardo  - Programación Web       - Ene-Jun 2026
(1, 2, 1),  -- Leonardo  - Bases de Datos         - Ene-Jun 2026
(2, 1, 1),  -- Ana       - Programación Web       - Ene-Jun 2026
(2, 3, 1),  -- Ana       - Matemáticas Discretas  - Ene-Jun 2026
(3, 2, 1),  -- Carlos    - Bases de Datos         - Ene-Jun 2026
(4, 4, 1),  -- Fernanda  - Inglés III             - Ene-Jun 2026
(1, 3, 2),  -- Leonardo  - Matemáticas Discretas  - Ago-Dic 2025
(3, 1, 2);  -- Carlos    - Programación Web       - Ago-Dic 2025

-- ---------------------------------------------------------
-- Calificaciones (para algunas inscripciones)
-- Nota: los id_inscripcion se asignan automáticamente en el
-- orden de inserción de arriba, por lo que van del 1 al 8.
-- ---------------------------------------------------------
INSERT INTO `calificaciones` (`id_inscripcion`, `tipo_corte`, `nota`) VALUES
(1, 'Corte 1', '9.0'),
(1, 'Corte 2', '8.5'),
(2, 'Corte 1', '7.0'),
(3, 'Corte 1', '8.0'),
(4, 'Corte 1', '6.5'),
(7, 'Corte 1', '9.5'),
(7, 'Corte 2', '9.0'),
(7, 'Final',   '9.2'),
(8, 'Final',   '5.5');
