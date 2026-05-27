import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateShoppingCartDto,
} from './dto/create-shopping-cart.dto';
import {
  AddItemToCartDto,
  UpdateCartItemDto,
  RemoveItemFromCartDto,
} from './dto/update-shopping-cart.dto';
import { Carrito } from './entities/shopping-cart.entity';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(Carrito)
    private readonly carritoRepo: Repository<Carrito>,
  ) {}

  // ── helpers ────────────────────────────────────────────────────────────────

  private async getItems(sessionId: string): Promise<Carrito[]> {
    return this.carritoRepo.find({ where: { id_sesion: sessionId } });
  }

  private async toCartView(items: Carrito[]) {
    const totalPrice = items.reduce(
      (sum) => sum,
      0,
    );
    return { items, totalItems: items.length, totalPrice };
  }

  // ── API compatible con el controlador anterior ─────────────────────────────

  async create(dto: CreateShoppingCartDto) {
    const sessionId = dto.sessionId ?? dto.userId ?? 'anon';
    if (dto.items?.length) {
      const rows = dto.items.map((i) =>
        this.carritoRepo.create({
          id_sesion: sessionId,
          id_cliente: dto.userId ? Number(dto.userId) : undefined,
          id_producto: Number(i.productId),
          cantidad: i.quantity,
        }),
      );
      await this.carritoRepo.save(rows);
    }
    return this.get(sessionId);
  }

  async get(id: string) {
    const items = await this.getItems(id);
    return this.toCartView(items);
  }

  async upsertEmpty(id: string) {
    return this.get(id);
  }

  async addItem(id: string, dto: AddItemToCartDto) {
    const existing = await this.carritoRepo.findOne({
      where: { id_sesion: id, id_producto: Number(dto.productId) },
    });
    if (existing) {
      existing.cantidad += dto.quantity;
      await this.carritoRepo.save(existing);
    } else {
      const row = this.carritoRepo.create({
        id_sesion: id,
        id_producto: Number(dto.productId),
        cantidad: dto.quantity,
      });
      await this.carritoRepo.save(row);
    }
    return this.get(id);
  }

  async updateItem(id: string, dto: UpdateCartItemDto) {
    const existing = await this.carritoRepo.findOne({
      where: { id_sesion: id, id_producto: Number(dto.productId) },
    });
    if (!existing) return this.get(id);
    if (dto.quantity <= 0) {
      await this.carritoRepo.remove(existing);
    } else {
      existing.cantidad = dto.quantity;
      await this.carritoRepo.save(existing);
    }
    return this.get(id);
  }

  async removeItem(id: string, dto: RemoveItemFromCartDto) {
    const existing = await this.carritoRepo.findOne({
      where: { id_sesion: id, id_producto: Number(dto.productId) },
    });
    if (existing) await this.carritoRepo.remove(existing);
    return this.get(id);
  }

  async clear(id: string) {
    const items = await this.getItems(id);
    if (items.length) await this.carritoRepo.remove(items);
    return this.get(id);
  }

  async delete(id: string) {
    await this.clear(id);
    return { id, deleted: true };
  }
}
