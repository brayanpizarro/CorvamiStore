import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { UsersService } from '../users/users.service';
import { ProductosService } from '../productos/productos.service';
import { EmailService } from '../email/email.service';
import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: MongoRepository<Order>,
    private readonly usersService: UsersService,
    private readonly productosService: ProductosService,
    private readonly emailService: EmailService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validar stock de productos
    for (const item of createOrderDto.items) {
      const product = await this.productosService.findOne(item.productId);
      if (!product) {
        throw new BadRequestException(
          `Producto ${item.productId} no encontrado`,
        );
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`,
        );
      }
    }

    // Determinar si es invitado
    const isGuest =
      createOrderDto.customer.isGuest || !createOrderDto.customer.userId;

    // Crear orden
    const order = this.ordersRepo.create({
      orderId: randomUUID(),
      userId: createOrderDto.customer.userId || undefined,
      items: createOrderDto.items.map((item) => ({
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
      status: isGuest ? 'paid' : 'pending',
      isPaid: isGuest,
      paidAt: isGuest ? new Date() : undefined,
      paymentMethod: isGuest ? 'guest_checkout' : 'pending',
      notes: isGuest
        ? `Compra como invitado. Total: $${createOrderDto.total.toLocaleString()}`
        : createOrderDto.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedOrder = await this.ordersRepo.save(order);

    // Si es invitado, reducir stock inmediatamente
    if (isGuest) {
      for (const item of savedOrder.items) {
        const product = await this.productosService.findOne(item.productId);
        if (product) {
          await this.productosService.update(item.productId, {
            stock: product.stock - item.quantity,
          });
        }
      }

      // Enviar correo de confirmación
      try {
        await this.emailService.sendOrderConfirmationEmail(savedOrder);
      } catch (error) {
        console.error('Error enviando correo de confirmación:', error);
      }
    }

    return savedOrder;
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

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
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

  async processCardPayment(
    orderId: string,
    paymentData: {
      cardNumber: string;
      cardHolder: string;
      expiryDate: string;
      cvv: string;
    },
  ): Promise<Order> {
    const order = await this.findOne(orderId);

    if (order.isPaid) {
      throw new BadRequestException('Esta orden ya ha sido pagada');
    }

    // Validar tarjeta (simulación)
    const validCards = [
      '4111111111111111', // Visa
      '5555555555554444', // Mastercard
      '378282246310005', // Amex
      '6011111111111117', // Discover
    ];

    const cleanedCard: string = paymentData.cardNumber.replace(/\s/g, '');

    if (!validCards.includes(cleanedCard)) {
      throw new BadRequestException(
        'Tarjeta inválida. Usa: 4111 1111 1111 1111 para pruebas',
      );
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

    // Reducir stock de productos
    for (const item of order.items) {
      const product = await this.productosService.findOne(item.productId);
      if (product) {
        await this.productosService.update(item.productId, {
          stock: product.stock - item.quantity,
        });
      }
    }

    const savedOrder = await this.ordersRepo.save(order);

    // Enviar correo de confirmación
    try {
      await this.emailService.sendOrderConfirmationEmail(order);
    } catch (error) {
      console.error('Error enviando correo de confirmación:', error);
      // No fallar la orden si el correo falla
    }

    return savedOrder;
  }

  async processBalancePayment(orderId: string, userId: string): Promise<Order> {
    const order = await this.findOne(orderId);

    if (order.isPaid) {
      throw new BadRequestException('Esta orden ya ha sido pagada');
    }

    // Verificar que la orden pertenezca al usuario
    if (order.userId !== userId) {
      throw new BadRequestException('No tienes permiso para pagar esta orden');
    }

    // Obtener usuario y verificar saldo
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.balance < order.total) {
      throw new BadRequestException(
        `Saldo insuficiente. Necesitas $${order.total.toLocaleString()} pero tienes $${user.balance.toLocaleString()}`,
      );
    }

    // Descontar del saldo del usuario
    user.balance -= order.total;
    await this.usersService.update(userId, { balance: user.balance });

    // Actualizar orden
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'paid';
    order.paymentMethod = 'balance';
    order.updatedAt = new Date();

    if (!order.notes) {
      order.notes = `Pago procesado con saldo. Monto: $${order.total.toLocaleString()}`;
    }

    // Reducir stock de productos
    for (const item of order.items) {
      const product = await this.productosService.findOne(item.productId);
      if (product) {
        await this.productosService.update(item.productId, {
          stock: product.stock - item.quantity,
        });
      }
    }

    const savedOrder = await this.ordersRepo.save(order);

    // Enviar correo de confirmación
    try {
      await this.emailService.sendOrderConfirmationEmail(order);
    } catch (error) {
      console.error('Error enviando correo de confirmación:', error);
      // No fallar la orden si el correo falla
    }

    return savedOrder;
  }

  async hasUserPurchasedProduct(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    // Buscar órdenes del usuario que estén pagadas
    const orders = await this.ordersRepo.find({
      where: {
        userId,
        isPaid: true,
      },
    });

    // Verificar si alguna orden contiene el producto
    return orders.some((order) =>
      order.items.some((item) => item.productId === productId),
    );
  }
}
