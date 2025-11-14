import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import Redis from 'ioredis';

@Module({
  controllers: [ShoppingCartController],
  providers: [
    ShoppingCartService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () =>
        new Redis({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: Number(process.env.REDIS_PORT || 6379),
          password: process.env.REDIS_PASSWORD || undefined,
          db: Number(process.env.REDIS_DB || 0),
        }),
    },
  ],
  exports: ['REDIS_CLIENT', ShoppingCartService],
})
export class ShoppingCartModule {}
