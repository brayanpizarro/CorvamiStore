import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Cliente } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
