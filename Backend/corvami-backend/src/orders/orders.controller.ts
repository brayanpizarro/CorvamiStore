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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Public()
  @Get()
  findAll(@Query('email') email?: string) {
    if (email) {
      return this.ordersService.findByEmail(email);
    }
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  findMyOrders(@CurrentUser() user: any) {
    return this.ordersService.findByUser(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('can-review/:productId')
  canReviewProduct(
    @Param('productId') productId: string,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.hasUserPurchasedProduct(user.userId, productId);
  }

  @Public()
  @Get(':orderId')
  findOne(@Param('orderId') orderId: string) {
    return this.ordersService.findOne(orderId);
  }

  @Public()
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':orderId')
  update(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(orderId, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':orderId/payment/balance')
  processBalancePayment(
    @Param('orderId') orderId: string,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.processBalancePayment(orderId, user.userId);
  }

  @Public()
  @Post(':orderId/payment')
  processPayment(
    @Param('orderId') orderId: string,
    @Body() paymentDto: ProcessPaymentDto,
  ) {
    return this.ordersService.processCardPayment(orderId, paymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':orderId')
  remove(@Param('orderId') orderId: string) {
    return this.ordersService.remove(orderId);
  }
}
