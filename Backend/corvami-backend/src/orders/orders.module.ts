import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { VentasPedido } from './entities/ventas-pedido.entity';
import { VentasDetalle } from './entities/ventas-detalle.entity';
import { VentasFactura } from './entities/ventas-factura.entity';
import { Cliente } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VentasPedido, VentasDetalle, VentasFactura, Cliente]),
    UsersModule,
    InventoryModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
