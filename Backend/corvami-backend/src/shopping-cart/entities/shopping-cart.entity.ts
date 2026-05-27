import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Cliente } from '../../users/entities/user.entity';

@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn()
  id_carrito: number;

  @Column({ nullable: true })
  id_sesion: string;

  @Column({ nullable: true })
  id_cliente: number;

  /** Referencia al id del producto en la BD externa (Inventario) */
  @Column()
  id_producto: number;

  @Column()
  cantidad: number;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.carrito, { nullable: true })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;
}
