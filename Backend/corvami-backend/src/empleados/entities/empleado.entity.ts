import { Entity, PrimaryColumn, Column } from 'typeorm';

/** Entidad de solo lectura — RRHH.RRHH_empleado (conexión 'external') */
@Entity({ name: 'RRHH_empleado', schema: 'RRHH' })
export class Empleado {
  @PrimaryColumn()
  id_empleado: number;

  @Column({ nullable: true })
  rut: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  id_rol: number;

  @Column({ nullable: true })
  correo: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  estado: string;
}
