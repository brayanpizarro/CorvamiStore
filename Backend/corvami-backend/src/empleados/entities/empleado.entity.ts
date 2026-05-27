import { Entity, PrimaryColumn, Column } from 'typeorm';

/**
 * Entidad de solo lectura mapeada a la tabla 'empleados'
 * en la base de datos externa de RRHH (conexión 'external').
 */
@Entity('empleados')
export class Empleado {
  @PrimaryColumn()
  id_empleado: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ nullable: true })
  cargo: string;
}
