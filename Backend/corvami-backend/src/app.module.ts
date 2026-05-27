import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
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
import { EmailModule } from './email/email.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    // ─── Conexión LOCAL (tablas propias del ecommerce) ───────────────────────
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'corvami',
      synchronize: true,
      autoLoadEntities: true,
      // Tablas propias: clientes, ventas_pedido, ventas_detalle, ventas_factura, carrito
    }),

    // ─── Conexión EXTERNA (tablas consultadas: empleados y productos) ────────
    TypeOrmModule.forRoot({
      name: 'external',
      type: 'postgres',
      host: process.env.EXT_DB_HOST || 'ep-royal-glade-ac55fitc-pooler.sa-east-1.aws.neon.tech',
      port: Number(process.env.EXT_DB_PORT || 5432),
      username: process.env.EXT_DB_USER || 'neondb_owner',
      password: process.env.EXT_DB_PASSWORD || 'npg_V58gYFmBOPda',
      database: process.env.EXT_DB_NAME || 'si2',
      synchronize: false,   // NUNCA sincronizar la BD externa
      autoLoadEntities: true,
      ssl: { rejectUnauthorized: false }, // Neon requiere SSL
      // Tablas consultadas (solo lectura): empleados, productos
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 segundos
      limit: 100, // 100 requests por minuto
    }]),
    ProductosModule,
    ShoppingCartModule,
    CommentsModule,
    SeedModule,
    UsersModule,
    OrdersModule,
    AuthModule,
    EmailModule,
    EmpleadosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
