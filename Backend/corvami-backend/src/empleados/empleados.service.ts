import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './entities/empleado.entity';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado, 'external')
    private readonly empleadoRepository: Repository<Empleado>,
  ) {}

  findAll(): Promise<Empleado[]> {
    return this.empleadoRepository.find();
  }

  findOne(id: number): Promise<Empleado | null> {
    return this.empleadoRepository.findOneBy({ id_empleado: id });
  }
}
