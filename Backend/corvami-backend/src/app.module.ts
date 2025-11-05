import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';

@Module({
  imports: [ShoppingCartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
