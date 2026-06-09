-- ============================================================
-- Migración: Tabla de imágenes de productos
-- Base de datos : si2
-- Schema        : Ventas
-- Compatible con: PostgreSQL 13+ / pgAdmin
-- ============================================================
-- La tabla externa Inventario.Producto usa PK: id_producto
-- No se declara FOREIGN KEY real porque pertenece a otro schema
-- gestionado por una conexión distinta.
-- ============================================================

-- 1. Crear el schema si no existe
CREATE SCHEMA IF NOT EXISTS "Ventas";

-- 2. Crear la tabla de imágenes
CREATE TABLE IF NOT EXISTS "Ventas"."ProductoImagen" (
    id           SERIAL          NOT NULL,
    producto_id  INTEGER         NOT NULL,
    imagen_url   VARCHAR(1000)   NOT NULL,
    public_id    VARCHAR(500)    NULL,
    es_principal BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_producto_imagen PRIMARY KEY (id)
);

-- 3. Índice para búsquedas por producto
CREATE INDEX IF NOT EXISTS idx_producto_imagen_producto_id
    ON "Ventas"."ProductoImagen" (producto_id);

-- 4. Comentarios de columnas
COMMENT ON TABLE  "Ventas"."ProductoImagen"              IS 'Imágenes de productos almacenadas en Cloudinary';
COMMENT ON COLUMN "Ventas"."ProductoImagen".producto_id  IS 'Referencia a Inventario.Producto.id_producto';
COMMENT ON COLUMN "Ventas"."ProductoImagen".imagen_url   IS 'URL pública de Cloudinary';
COMMENT ON COLUMN "Ventas"."ProductoImagen".public_id    IS 'Public ID en Cloudinary (usado para eliminar el asset)';
COMMENT ON COLUMN "Ventas"."ProductoImagen".es_principal IS 'TRUE = imagen principal/portada del producto';
