import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  CreateShoppingCartDto,
  CartItemDto,
} from './dto/create-shopping-cart.dto';
import {
  AddItemToCartDto,
  UpdateCartItemDto,
  RemoveItemFromCartDto,
} from './dto/update-shopping-cart.dto';
import { ShoppingCart, CartItem } from './entities/shopping-cart.entity';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private readonly cartRepo: Repository<ShoppingCart>,
  ) {}

  private calculateTotal(items: CartItem[]) {
    return Number(
      (items || [])
        .reduce(
          (sum, it) => sum + (it.unitPrice ? it.unitPrice * it.quantity : 0),
          0,
        )
        .toFixed(2),
    );
  }

  async create(dto: CreateShoppingCartDto) {
    const id = dto.userId || dto.sessionId || randomUUID();
    const items: CartItem[] = (dto.items ?? []).map((i) => ({ ...i }));
    const cart = this.cartRepo.create({
      id,
      userId: dto.userId ?? undefined,
      sessionId: dto.sessionId ?? undefined,
      items,
      currency: dto.currency ?? 'USD',
      status: dto.status ?? 'active',
      totalPrice: this.calculateTotal(items),
      totalItems: items.reduce((acc, it) => acc + it.quantity, 0),
    });
    return await this.cartRepo.save(cart);
  }

  async get(id: string) {
    return await this.cartRepo.findOneBy({ id });
  }

  async upsertEmpty(id: string) {
    const existing = await this.get(id);
    if (existing) return existing;
    const cart = this.cartRepo.create({
      id,
      userId: undefined,
      sessionId: id,
      items: [],
      currency: 'USD',
      status: 'active',
      totalPrice: 0,
      totalItems: 0,
    });
    return await this.cartRepo.save(cart);
  }

  private async saveCart(cart: ShoppingCart) {
    cart.totalPrice = this.calculateTotal(cart.items);
    cart.totalItems = cart.items.reduce((a, it) => a + it.quantity, 0);
    return await this.cartRepo.save(cart);
  }

  async addItem(id: string, dto: AddItemToCartDto) {
    const cart = (await this.get(id)) ?? (await this.upsertEmpty(id));
    const idx = cart.items.findIndex(
      (i: CartItem) => i.productId === dto.productId,
    );
    if (idx >= 0) {
      cart.items[idx].quantity += dto.quantity;
    } else {
      cart.items = [
        ...cart.items,
        {
          productId: dto.productId,
          quantity: dto.quantity,
          unitPrice: dto.unitPrice,
          name: dto.name,
          image: dto.image,
        },
      ];
    }
    return this.saveCart(cart);
  }

  async updateItem(id: string, dto: UpdateCartItemDto) {
    const cart = await this.get(id);
    if (!cart) return null;
    const idx = cart.items.findIndex(
      (i: CartItem) => i.productId === dto.productId,
    );
    if (idx < 0) return cart;
    cart.items[idx].quantity = dto.quantity;
    cart.items = cart.items.filter((i: CartItem) => i.quantity > 0);
    return this.saveCart(cart);
  }

  async removeItem(id: string, dto: RemoveItemFromCartDto) {
    const cart = await this.get(id);
    if (!cart) return null;
    cart.items = cart.items.filter(
      (i: CartItem) => i.productId !== dto.productId,
    );
    return this.saveCart(cart);
  }

  async clear(id: string) {
    const cart = await this.get(id);
    if (!cart) return null;
    cart.items = [];
    return this.saveCart(cart);
  }

  async delete(id: string) {
    await this.cartRepo.delete({ id });
    return { id, deleted: true };
  }
}
