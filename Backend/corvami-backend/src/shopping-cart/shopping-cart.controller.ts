import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ShoppingCartService } from './shopping-cart.service';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import {
  AddItemToCartDto,
  UpdateCartItemDto,
  RemoveItemFromCartDto,
} from './dto/update-shopping-cart.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Cart')
@Controller('cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  // Crear carrito (o inicializar con items)
  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear un carrito de compras' })
  @ApiResponse({ status: 201, description: 'Carrito creado.' })
  create(@Body() dto: CreateShoppingCartDto) {
    return this.shoppingCartService.create(dto);
  }

  // Obtener carrito por id (userId o sessionId)
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener carrito por ID (userId o sessionId)' })
  @ApiParam({ name: 'id', description: 'UUID del usuario o sessionId del invitado' })
  @ApiResponse({ status: 200, description: 'Datos del carrito.' })
  get(@Param('id') id: string) {
    return this.shoppingCartService.get(id);
  }

  // Agregar item
  @Public()
  @Post(':id/items')
  @ApiOperation({ summary: 'Agregar un ítem al carrito' })
  @ApiParam({ name: 'id', description: 'UUID del usuario o sessionId' })
  @ApiResponse({ status: 201, description: 'Ítem agregado.' })
  addItem(@Param('id') id: string, @Body() dto: AddItemToCartDto) {
    return this.shoppingCartService.addItem(id, dto);
  }

  // Actualizar cantidad de un item
  @Public()
  @Patch(':id/items')
  @ApiOperation({ summary: 'Actualizar cantidad de un ítem del carrito' })
  @ApiParam({ name: 'id', description: 'UUID del usuario o sessionId' })
  @ApiResponse({ status: 200, description: 'Ítem actualizado.' })
  updateItem(@Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    return this.shoppingCartService.updateItem(id, dto);
  }

  // Eliminar item
  @Public()
  @Delete(':id/items/:productId')
  @ApiOperation({ summary: 'Eliminar un ítem del carrito' })
  @ApiParam({ name: 'id', description: 'UUID del usuario o sessionId' })
  @ApiParam({ name: 'productId', description: 'UUID del producto a eliminar' })
  @ApiResponse({ status: 200, description: 'Ítem eliminado.' })
  removeItem(@Param('id') id: string, @Param('productId') productId: string) {
    return this.shoppingCartService.removeItem(id, { productId });
  }

  // Vaciar carrito
  @Public()
  @Delete(':id')
  @ApiOperation({ summary: 'Vaciar el carrito (elimina todos los ítems)' })
  @ApiParam({ name: 'id', description: 'UUID del usuario o sessionId' })
  @ApiResponse({ status: 200, description: 'Carrito vaciado.' })
  clear(@Param('id') id: string) {
    return this.shoppingCartService.clear(id);
  }

  // Eliminar carrito completamente
  @Public()
  @Delete(':id/hard')
  @ApiOperation({ summary: 'Eliminar el carrito completamente' })
  @ApiParam({ name: 'id', description: 'UUID del usuario o sessionId' })
  @ApiResponse({ status: 200, description: 'Carrito eliminado.' })
  delete(@Param('id') id: string) {
    return this.shoppingCartService.delete(id);
  }
}
