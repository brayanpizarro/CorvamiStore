import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Public()
  @Get()
  findAll() {
    return this.empleadosService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.empleadosService.findOne(id);
  }
}
