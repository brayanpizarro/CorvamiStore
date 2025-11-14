import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateShoppingCartDto, CartItemDto } from './dto/create-shopping-cart.dto';
import {
  AddItemToCartDto,
  UpdateCartItemDto,
  RemoveItemFromCartDto,
} from './dto/update-shopping-cart.dto';
import type Redis from 'ioredis';

@Injectable()
export class ShoppingCartService {
  private readonly ttlSeconds = Number(process.env.CART_TTL_SECONDS || 60 * 60 * 24 * 7); // 7 días

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  private key(id: string) {
    return `cart:${id}`;
  }

  private nowISO() {
    return new Date().toISOString();
  }

  async create(dto: CreateShoppingCartDto) {
    const id = dto.userId || dto.sessionId || randomUUID();
    const cart = {
      id,
      userId: dto.userId ?? null,
      sessionId: dto.sessionId ?? null,
      items: (dto.items ?? []).map((i) => ({ ...i })),
      currency: dto.currency ?? 'USD',
      status: dto.status ?? 'active',
      totalPrice: this.calculateTotal(dto.items ?? []),
      totalItems: (dto.items ?? []).reduce((acc, it) => acc + it.quantity, 0),
      createdAt: this.nowISO(),
      updatedAt: this.nowISO(),
    };
    await this.redis.set(this.key(id), JSON.stringify(cart), 'EX', this.ttlSeconds);
    return cart;
  }

  private calculateTotal(items: CartItemDto[]) {
    return Number(
      (items || [])
        .reduce((sum, it) => sum + (it.unitPrice ? it.unitPrice * it.quantity : 0), 0)
        .toFixed(2),
    );
  }

  async get(id: string) {
    const raw = await this.redis.get(this.key(id));
    if (!raw) return null;
    return JSON.parse(raw);
  }

  async upsertEmpty(id: string) {
    const existing = await this.get(id);
    if (existing) return existing;
    const cart = {
      id,
      userId: null,
      sessionId: id,
      items: [] as CartItemDto[],
      currency: 'USD',
      status: 'active' as const,
      totalPrice: 0,
      totalItems: 0,
      createdAt: this.nowISO(),
      updatedAt: this.nowISO(),
    };
    await this.redis.set(this.key(id), JSON.stringify(cart), 'EX', this.ttlSeconds);
    return cart;
  }

  private async save(id: string, cart: any) {
    cart.updatedAt = this.nowISO();
    await this.redis.set(this.key(id), JSON.stringify(cart), 'EX', this.ttlSeconds);
    return cart;
  }

  async addItem(id: string, dto: AddItemToCartDto) {
    const cart = (await this.get(id)) ?? (await this.upsertEmpty(id));
    const idx = cart.items.findIndex((i: CartItemDto) => i.productId === dto.productId);
    if (idx >= 0) {
      cart.items[idx].quantity += dto.quantity;
    } else {
      cart.items.push({ productId: dto.productId, quantity: dto.quantity });
    }
    cart.totalItems = cart.items.reduce((a: number, it: CartItemDto) => a + it.quantity, 0);
    cart.totalPrice = this.calculateTotal(cart.items);
    return this.save(id, cart);
  }

  async updateItem(id: string, dto: UpdateCartItemDto) {
    const cart = await this.get(id);
    if (!cart) return null;
    const idx = cart.items.findIndex((i: CartItemDto) => i.productId === dto.productId);
    if (idx < 0) return cart;
    cart.items[idx].quantity = dto.quantity;
    cart.items = cart.items.filter((i: CartItemDto) => i.quantity > 0);
    cart.totalItems = cart.items.reduce((a: number, it: CartItemDto) => a + it.quantity, 0);
    cart.totalPrice = this.calculateTotal(cart.items);
    return this.save(id, cart);
  }

  async removeItem(id: string, dto: RemoveItemFromCartDto) {
    const cart = await this.get(id);
    if (!cart) return null;
    cart.items = cart.items.filter((i: CartItemDto) => i.productId !== dto.productId);
    cart.totalItems = cart.items.reduce((a: number, it: CartItemDto) => a + it.quantity, 0);
    cart.totalPrice = this.calculateTotal(cart.items);
    return this.save(id, cart);
  }

  async clear(id: string) {
    const cart = await this.get(id);
    if (!cart) return null;
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    return this.save(id, cart);
  }

  async delete(id: string) {
    await this.redis.del(this.key(id));
    return { id, deleted: true };
  }
}
