import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  async create(dto: CreateProductoDto) {
    const entity = this.repo.create({
      productId: randomUUID(),
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      imageUrl: dto.imageUrl,
      category: dto.category,
      subcategory: dto.subcategory,
      brand: dto.brand,
      tags: dto.tags,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
    });
    const saved = await this.repo.save(entity);
    return { productId: saved.productId };
  }

  findAll() {
    return this.repo.find();
  }

  findOne(productId: string) {
    return this.repo.findOneBy({ productId });
  }

  async update(productId: string, dto: UpdateProductoDto) {
    const result = await this.repo.update({ productId }, { ...dto });
    return { affected: result.affected };
  }

  async remove(productId: string) {
    const result = await this.repo.delete({ productId });
    return { deleted: result.affected };
  }

  async setImage(productId: string, imageUrl: string) {
    const result = await this.repo.update({ productId }, { imageUrl });
    return { affected: result.affected, imageUrl };
  }

  async reduceStock(productId: string, quantity: number) {
    const product = await this.findOne(productId);
    if (!product) {
      throw new Error(`Producto ${productId} no encontrado`);
    }
    if (product.stock < quantity) {
      throw new Error(`Stock insuficiente para ${product.name}`);
    }
    const result = await this.repo.update({ productId }, { stock: product.stock - quantity });
    return { affected: result.affected };
  }
}
