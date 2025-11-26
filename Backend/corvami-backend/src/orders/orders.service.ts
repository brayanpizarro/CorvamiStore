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

    // Crear orden
    const order = this.ordersRepo.create({
      orderId: randomUUID(),
      userId: createOrderDto.customer.userId || null,
      items: createOrderDto.items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      shippingInfo: {
        name: createOrderDto.customer.name,
        email: createOrderDto.customer.email,
        phone: createOrderDto.customer.phone,
        address: createOrderDto.customer.address,
        city: createOrderDto.customer.city,
        department: createOrderDto.customer.department,
        zipCode: createOrderDto.customer.zipCode,
      },
      total: createOrderDto.total,
      subtotal: createOrderDto.subtotal,
      shippingCost: createOrderDto.shipping,
      status: 'pending',
      isPaid: false,
      paymentMethod: 'pending',
      notes: createOrderDto.notes,
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

  async findByEmail(email: string): Promise<Order[]> {
    return await this.ordersRepo.find({
      where: { 'shippingInfo.email': email },
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

  async processCardPayment(orderId: string, paymentData: any): Promise<Order> {
    const order = await this.findOne(orderId);

    if (order.isPaid) {
      throw new BadRequestException('Esta orden ya ha sido pagada');
    }

    // Validar tarjeta (simulación)
    const validCards = [
      '4111111111111111', // Visa
      '5555555555554444', // Mastercard
      '378282246310005',  // Amex
      '6011111111111117', // Discover
    ];

    const cleanedCard = paymentData.cardNumber.replace(/\s/g, '');
    
    if (!validCards.includes(cleanedCard)) {
      throw new BadRequestException('Tarjeta inválida. Usa: 4111 1111 1111 1111 para pruebas');
    }

    // Simular procesamiento de pago exitoso
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Actualizar orden
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'paid';
    order.paymentMethod = 'credit_card';
    order.updatedAt = new Date();

    // Guardar información del pago en notas (opcional)
    if (!order.notes) {
      order.notes = `Pago procesado con tarjeta **** **** **** ${cleanedCard.slice(-4)}. ID: ${transactionId}`;
    }

    return await this.ordersRepo.save(order);
  }
}
