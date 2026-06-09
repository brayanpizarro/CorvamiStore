import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * Tabla local (schema Ventas) que almacena las imágenes de cada producto.
 * El producto en sí vive en la BD externa (Inventario),
 * se guarda únicamente el id numérico como referencia sin FK real.
 */
@Entity({ name: 'ProductoImagen', schema: 'Ventas' })
export class ProductoImagen {
  @PrimaryGeneratedColumn()
  id!: number;

  /** Referencia al id de Inventario.Producto */
  @Column({ name: 'producto_id' })
  productoId!: number;

  /** Imagen almacenada como base64 o URL */
  @Column({ name: 'imagen_data', type: 'text' })
  imagenData!: string;

  /** Indica si es la imagen principal/portada del producto */
  @Column({ name: 'es_principal', default: false })
  esPrincipal!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
