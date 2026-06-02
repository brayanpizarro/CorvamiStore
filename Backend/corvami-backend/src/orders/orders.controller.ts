import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido creado.' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los pedidos (o filtrar por email)' })
  @ApiQuery({ name: 'email', required: false, description: 'Filtrar pedidos por correo del cliente' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos.' })
  findAll(@Query('email') email?: string) {
    if (email) {
      return this.ordersService.findByEmail(email);
    }
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Obtener pedidos del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Pedidos del usuario.' })
  findMyOrders(@CurrentUser() user: any) {
    return this.ordersService.findByUser(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('can-review/:productId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Verificar si el usuario puede reseñar un producto (debe haberlo comprado)' })
  @ApiParam({ name: 'productId', description: 'UUID del producto' })
  @ApiResponse({ status: 200, description: 'Boolean indicando si puede reseñar.' })
  canReviewProduct(
    @Param('productId') productId: string,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.hasUserPurchasedProduct(user.userId, productId);
  }

  @Public()
  @Get(':orderId')
  @ApiOperation({ summary: 'Obtener pedido por ID' })
  @ApiParam({ name: 'orderId', description: 'UUID del pedido' })
  @ApiResponse({ status: 200, description: 'Datos del pedido.' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado.' })
  findOne(@Param('orderId') orderId: string) {
    return this.ordersService.findOne(orderId);
  }

  @Public()
  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener pedidos de un usuario por su ID' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Pedidos del usuario.' })
  findByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':orderId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Actualizar estado de un pedido' })
  @ApiParam({ name: 'orderId', description: 'UUID del pedido' })
  @ApiResponse({ status: 200, description: 'Pedido actualizado.' })
  update(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(orderId, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':orderId/payment/balance')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Procesar pago de pedido con saldo de la cuenta' })
  @ApiParam({ name: 'orderId', description: 'UUID del pedido' })
  @ApiResponse({ status: 201, description: 'Pago procesado con saldo.' })
  processBalancePayment(
    @Param('orderId') orderId: string,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.processBalancePayment(orderId, user.userId);
  }

  @Public()
  @Post(':orderId/payment')
  @ApiOperation({ summary: 'Procesar pago de pedido con tarjeta' })
  @ApiParam({ name: 'orderId', description: 'UUID del pedido' })
  @ApiResponse({ status: 201, description: 'Pago procesado con tarjeta.' })
  processPayment(
    @Param('orderId') orderId: string,
    @Body() paymentDto: ProcessPaymentDto,
  ) {
    return this.ordersService.processCardPayment(orderId, paymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':orderId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Eliminar un pedido' })
  @ApiParam({ name: 'orderId', description: 'UUID del pedido' })
  @ApiResponse({ status: 200, description: 'Pedido eliminado.' })
  remove(@Param('orderId') orderId: string) {
    return this.ordersService.remove(orderId);
  }
}
