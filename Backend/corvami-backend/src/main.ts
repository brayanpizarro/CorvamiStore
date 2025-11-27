import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true, credentials: true });
  // Ya no servimos /uploads locales para imágenes de productos (Cloudinary)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Ejecutar seed automáticamente
  const seedService = app.get(SeedService);
  await seedService.seed();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
