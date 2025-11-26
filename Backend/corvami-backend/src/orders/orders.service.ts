import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { UsersService } from '../users/users.service';
import { ProductosService } from '../productos/productos.service';
import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: MongoRepository<Order>,
    private readonly usersService: UsersService,
    private readonly productosService: ProductosService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validar stock de productos
    for (const item of createOrderDto.items) {
      const product = await this.productosService.findOne(item.productId);
      if (!product) {
        throw new BadRequestException(`Producto ${item.productId} no encontrado`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`,
        );
      }
    }

    let user: any = null;
    
    // Si es usuario registrado, validar y deducir saldo
    if (createOrderDto.userId) {
      user = await this.usersService.findOne(createOrderDto.userId);
      
      if (user.balance < createOrderDto.total) {
        throw new BadRequestException('Saldo insuficiente');
      }

      // Deducir saldo
      await this.usersService.deductBalance(user.userId, createOrderDto.total);
    } else if (createOrderDto.isGuestCheckout) {
      // Para invitados, crear un usuario temporal
      user = await this.usersService.create({
        email: createOrderDto.shippingInfo.email,
        name: createOrderDto.shippingInfo.name,
        phone: createOrderDto.shippingInfo.phone,
        address: createOrderDto.shippingInfo.address,
        city: createOrderDto.shippingInfo.city,
        country: createOrderDto.shippingInfo.country,
        balance: createOrderDto.total, // El invitado carga solo el monto de la compra
        isRegistered: false,
      });

      // Deducir el saldo (dejará el balance en 0)
      await this.usersService.deductBalance(user.userId, createOrderDto.total);
    }

    // Reducir stock de productos
    for (const item of createOrderDto.items) {
      await this.productosService.reduceStock(item.productId, item.quantity);
    }

    // Crear la orden
    const order = this.ordersRepo.create({
      orderId: randomUUID(),
      userId: user?.userId || null,
      items: createOrderDto.items,
      total: createOrderDto.total,
      shippingInfo: createOrderDto.shippingInfo,
      paymentMethod: createOrderDto.paymentMethod || 'balance',
      status: 'paid',
      isPaid: true,
      paidAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.ordersRepo.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepo.find();
  }

  async findOne(orderId: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({
      where: { orderId },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${orderId} no encontrada`);
    }

    return order;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return await this.ordersRepo.find({
      where: { userId },
    });
  }

  async update(orderId: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(orderId);

    Object.assign(order, {
      ...updateOrderDto,
      updatedAt: new Date(),
    });

    return await this.ordersRepo.save(order);
  }

  async remove(orderId: string): Promise<void> {
    const order = await this.findOne(orderId);
    await this.ordersRepo.delete({ orderId: order.orderId });
  }

  async hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
    // Buscar órdenes del usuario que estén pagadas
    const orders = await this.ordersRepo.find({
      where: {
        userId,
        isPaid: true,
      },
    });

    // Verificar si alguna orden contiene el producto
    const hasPurchased = orders.some(order => 
      order.items.some(item => item.productId === productId)
    );

    return hasPurchased;
  }
}
