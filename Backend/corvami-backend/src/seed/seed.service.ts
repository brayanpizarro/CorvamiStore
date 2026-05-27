import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Cliente } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepo: Repository<Cliente>,
  ) {}

  async seed() {
    const count = await this.clientesRepo.count();
    if (count > 0) {
      this.logger.log(`Seed omitido: ya existen ${count} clientes.`);
      return { message: 'Seed omitido, ya hay datos existentes.', count };
    }

    const clientesSeed = [
      { nombre: 'Juan Perez', email: 'juan@example.com', telefono: '+56912345678', rut: '12345678-9' },
      { nombre: 'Maria Lopez', email: 'maria@example.com', telefono: '+56998765432', rut: '98765432-1' },
      { nombre: 'Admin User', email: 'admin@corvami.cl', telefono: '+56911111111', rut: '11111111-1' },
    ];

    const clientes = clientesSeed.map((c) =>
      this.clientesRepo.create({
        ...c,
        userId: randomUUID(),
        password: 'seed_placeholder',
        isRegistered: true,
        isActive: true,
        tipo: 'persona',
        balance: 0,
      }),
    );

    await this.clientesRepo.save(clientes);
    this.logger.log(`Seed completado: ${clientes.length} clientes creados.`);
    return { message: 'Seed completado.', created: clientes.length };
  }
}
