import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { VentasPedido } from './entities/ventas-pedido.entity';
import { VentasDetalle } from './entities/ventas-detalle.entity';
import { VentasFactura } from './entities/ventas-factura.entity';
import { Cliente } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(VentasPedido)
    private readonly pedidosRepo: Repository<VentasPedido>,
    @InjectRepository(VentasDetalle)
    private readonly detallesRepo: Repository<VentasDetalle>,
    @InjectRepository(VentasFactura)
    private readonly facturasRepo: Repository<VentasFactura>,
    @InjectRepository(Cliente)
    private readonly clientesRepo: Repository<Cliente>,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  private parseId(id: string | number): number {
    return typeof id === 'string' ? parseInt(id, 10) : id;
  }

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<VentasPedido> {
    // Buscar el cliente por userId del token JWT
    const cliente = await this.clientesRepo.findOne({ where: { userId } });
    if (!cliente) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    const detallesData = createOrderDto.items.map((item) => {
      const id_producto = Number(item.productId);
      if (isNaN(id_producto) || id_producto <= 0) {
        throw new BadRequestException(
          `productId inválido: "${item.productId}". Debe ser un número entero positivo.`,
        );
      }
      return {
        id_producto,
        cantidad: item.quantity,
        precio_unit: item.unitPrice,
        subtotal: item.totalPrice,
      };
    });

    const pedido = this.pedidosRepo.create({
      id_cliente: cliente.id_cliente,
      userId,
      shippingInfo: {
        name: createOrderDto.customer.name,
        email: createOrderDto.customer.email,
        phone: createOrderDto.customer.phone,
        address: createOrderDto.customer.address,
        city: createOrderDto.customer.city,
        department: createOrderDto.customer.department,
        zipCode: createOrderDto.customer.zipCode,
      },
      subtotal: createOrderDto.subtotal,
      costo_envio: createOrderDto.shipping,
      total: createOrderDto.total,
      canal: 'WEB',
      estado: 'pendiente',
      isPaid: false,
      paymentMethod: 'pendiente',
      notes: (createOrderDto as any).notes,
    });

    const savedPedido = await this.pedidosRepo.save(pedido);

    const detalles = this.detallesRepo.create(
      detallesData.map((d) => ({ ...d, id_pedido: savedPedido.id_pedido })),
    );
    savedPedido.detalles = await this.detallesRepo.save(detalles);

    const iva = Number((savedPedido.total * 0.19).toFixed(2));
    const monto_neto = Number((savedPedido.total - iva).toFixed(2));
    const factura = this.facturasRepo.create({
      id_pedido: savedPedido.id_pedido,
      monto_neto,
      iva,
      total: savedPedido.total,
    });
    savedPedido.factura = await this.facturasRepo.save(factura);

    return savedPedido;
  }

  async findAll(): Promise<VentasPedido[]> {
    return this.pedidosRepo.find({ relations: ['detalles', 'factura'] });
  }

  async findOne(id: string | number): Promise<VentasPedido> {
    const pedido = await this.pedidosRepo.findOne({
      where: { id_pedido: this.parseId(id) },
      relations: ['detalles', 'factura'],
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async findByUser(userId: string): Promise<VentasPedido[]> {
    return this.pedidosRepo.find({
      where: { userId },
      relations: ['detalles', 'factura'],
    });
  }

  async findByEmail(email: string): Promise<VentasPedido[]> {
    return this.pedidosRepo
      .createQueryBuilder('pedido')
      .where("pedido.shippingInfo->>'email' = :email", { email })
      .leftJoinAndSelect('pedido.detalles', 'detalles')
      .leftJoinAndSelect('pedido.factura', 'factura')
      .getMany();
  }

  async update(
    id: string | number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<VentasPedido> {
    const pedido = await this.findOne(id);
    Object.assign(pedido, updateOrderDto);
    return this.pedidosRepo.save(pedido);
  }

  async remove(id: string | number): Promise<void> {
    await this.findOne(id);
    await this.pedidosRepo.delete({ id_pedido: this.parseId(id) });
  }

  async processCardPayment(
    id: string | number,
    paymentData: {
      cardNumber: string;
      cardHolder: string;
      expiryDate: string;
      cvv: string;
    },
  ): Promise<VentasPedido> {
    const pedido = await this.findOne(id);

    if (pedido.isPaid) {
      throw new BadRequestException('Este pedido ya ha sido pagado');
    }

    const validCards = [
      '4111111111111111',
      '5555555555554444',
      '378282246310005',
      '6011111111111117',
    ];
    const cleanedCard = paymentData.cardNumber.replace(/\s/g, '');
    if (!validCards.includes(cleanedCard)) {
      throw new BadRequestException(
        'Tarjeta invalida. Usa: 4111 1111 1111 1111 para pruebas',
      );
    }

    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    pedido.isPaid = true;
    pedido.paidAt = new Date();
    pedido.estado = 'pagado';
    pedido.paymentMethod = 'tarjeta';
    if (!pedido.notes) {
      pedido.notes = `Pago con tarjeta **** **** **** ${cleanedCard.slice(-4)}. ID: ${transactionId}`;
    }

    const saved = await this.pedidosRepo.save(pedido);
    try {
      await this.emailService.sendOrderConfirmationEmail(saved);
    } catch (err) {
      console.error('Error enviando correo:', err);
    }
    return saved;
  }

  async processBalancePayment(
    id: string | number,
    userId: string,
  ): Promise<VentasPedido> {
    const pedido = await this.findOne(id);

    if (pedido.isPaid) {
      throw new BadRequestException('Este pedido ya ha sido pagado');
    }
    if (pedido.userId !== userId) {
      throw new BadRequestException('No tienes permiso para pagar este pedido');
    }

    const user = await this.usersService.findOne(userId);
    if (Number(user.balance) < Number(pedido.total)) {
      throw new BadRequestException(
        `Saldo insuficiente. Necesitas $${pedido.total} pero tienes $${user.balance}`,
      );
    }

    await this.usersService.deductBalance(userId, Number(pedido.total));

    pedido.isPaid = true;
    pedido.paidAt = new Date();
    pedido.estado = 'pagado';
    pedido.paymentMethod = 'saldo';
    if (!pedido.notes) {
      pedido.notes = `Pago con saldo. Monto: $${pedido.total}`;
    }

    const saved = await this.pedidosRepo.save(pedido);
    try {
      await this.emailService.sendOrderConfirmationEmail(saved);
    } catch (err) {
      console.error('Error enviando correo:', err);
    }
    return saved;
  }

  async hasUserPurchasedProduct(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const count = await this.detallesRepo
      .createQueryBuilder('det')
      .innerJoin('det.pedido', 'ped')
      .where('ped.userId = :userId', { userId })
      .andWhere('ped.isPaid = true')
      .andWhere('det.id_producto = :id_producto', {
        id_producto: Number(productId),
      })
      .getCount();
    return count > 0;
  }
}
