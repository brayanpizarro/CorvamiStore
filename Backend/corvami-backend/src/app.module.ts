import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { ProductosModule } from './productos/productos.module';

@Module({
  imports: [ShoppingCartModule, ProductosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
