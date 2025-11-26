import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { CommentsModule } from './comments/comments.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URL || 'mongodb://localhost:27017/corvami',
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProductosModule,
    ShoppingCartModule,
    CommentsModule,
    SeedModule,
    UsersModule,
    OrdersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
