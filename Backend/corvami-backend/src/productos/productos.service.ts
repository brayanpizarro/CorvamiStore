import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: MongoRepository<Producto>,
  ) {}

  async create(dto: CreateProductoDto) {
    const entity: Partial<Producto> = {
      productId: randomUUID(),
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      imageUrl: dto.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await this.repo.insert(entity as Producto);
    return { productId: entity.productId, insertedId: result.identifiers[0]?._id };
  }

  findAll() {
    return this.repo.find();
  }

  findOne(productId: string) {
    return this.repo.findOneBy({ productId });
  }

  async update(productId: string, dto: UpdateProductoDto) {
    const result = await this.repo.updateOne(
      { productId },
      { $set: { ...dto, updatedAt: new Date() } },
    );
    return { matched: result.matchedCount, modified: result.modifiedCount };
  }

  async remove(productId: string) {
    const result = await this.repo.deleteOne({ productId });
    return { deleted: result.deletedCount };
  }

  async setImage(productId: string, imageUrl: string) {
    const result = await this.repo.updateOne(
      { productId },
      { $set: { imageUrl, updatedAt: new Date() } },
    );
    return { matched: result.matchedCount, modified: result.modifiedCount, imageUrl };
  }
}
