import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../users/entities/user.entity';

@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn()
  id_carrito: number;

  @Column({ length: 50 })
  id_sesion: string;

  @Column({ nullable: true })
  id_cliente: number;

  /** Referencia al id del producto en la BD externa (Inventario) */
  @Column()
  id_producto: number;

  @Column()
  cantidad: number;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.carrito, { nullable: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;
}
