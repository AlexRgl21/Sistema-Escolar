-- =========================================================
-- NUEVAS TABLAS: anuncios y trámites
-- Ejecuta este script en MySQL Workbench (o con el cliente
-- de línea de comandos) DESPUÉS de haber importado
-- Dump20260708.sql, para habilitar el panel de anuncios y
-- la sección de trámites de alumnos.
-- =========================================================

USE `gestion_escolar`;

-- ---------------------------------------------------------
-- Tabla: anuncios
-- Publicados por un administrador, visibles para todos
-- los alumnos en su portal.
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `anuncios`;
CREATE TABLE `anuncios` (
  `id_anuncio` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(120) NOT NULL,
  `contenido` text NOT NULL,
  `fecha_publicacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_administrador` int DEFAULT NULL,
  PRIMARY KEY (`id_anuncio`),
  KEY `id_administrador_anuncio_idx` (`id_administrador`),
  CONSTRAINT `fk_anuncios_administradores`
    FOREIGN KEY (`id_administrador`) REFERENCES `administradores` (`id_administrador`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------
-- Tabla: tramites
-- Solicitudes que hace un alumno (constancia, kardex, etc.)
-- y que un administrador revisa y responde.
-- ---------------------------------------------------------
DROP TABLE IF EXISTS `tramites`;
CREATE TABLE `tramites` (
  `id_tramite` int NOT NULL AUTO_INCREMENT,
  `id_alumno` int DEFAULT NULL,
  `tipo_tramite` varchar(60) NOT NULL,
  `descripcion` text,
  `estatus` varchar(45) NOT NULL DEFAULT 'Pendiente',
  `fecha_solicitud` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `respuesta` text,
  `fecha_respuesta` datetime DEFAULT NULL,
  `id_administrador` int DEFAULT NULL,
  PRIMARY KEY (`id_tramite`),
  KEY `id_alumno_tramite_idx` (`id_alumno`),
  KEY `id_administrador_tramite_idx` (`id_administrador`),
  CONSTRAINT `fk_tramites_alumnos`
    FOREIGN KEY (`id_alumno`) REFERENCES `alumnos` (`id_alumno`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_tramites_administradores`
    FOREIGN KEY (`id_administrador`) REFERENCES `administradores` (`id_administrador`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------------------------------------------------------
-- Datos de ejemplo (opcional)
-- ---------------------------------------------------------
INSERT INTO `anuncios` (`titulo`, `contenido`, `id_administrador`) VALUES
('Bienvenida al ciclo Enero - Junio 2026', 'Les damos la bienvenida al nuevo periodo escolar. Recuerden revisar sus materias inscritas en el portal.', 1),
('Suspensión de clases', 'El próximo lunes no habrá clases por junta de consejo técnico. Actividades normales el martes.', 1);

-- El id_alumno = 1 corresponde a Leonardo en los datos de ejemplo anteriores
INSERT INTO `tramites` (`id_alumno`, `tipo_tramite`, `descripcion`, `estatus`) VALUES
(1, 'Constancia de estudios', 'Necesito la constancia para trámites de beca.', 'Pendiente');
