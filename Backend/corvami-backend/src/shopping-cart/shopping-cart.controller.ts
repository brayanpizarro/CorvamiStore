import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import {
  AddItemToCartDto,
  UpdateCartItemDto,
  RemoveItemFromCartDto,
} from './dto/update-shopping-cart.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  // Crear carrito (o inicializar con items)
  @Public()
  @Post()
  create(@Body() dto: CreateShoppingCartDto) {
    return this.shoppingCartService.create(dto);
  }

  // Obtener carrito por id (userId o sessionId)
  @Public()
  @Get(':id')
  get(@Param('id') id: string) {
    return this.shoppingCartService.get(id);
  }

  // Agregar item
  @Public()
  @Post(':id/items')
  addItem(@Param('id') id: string, @Body() dto: AddItemToCartDto) {
    return this.shoppingCartService.addItem(id, dto);
  }

  // Actualizar cantidad de un item
  @Public()
  @Patch(':id/items')
  updateItem(@Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    return this.shoppingCartService.updateItem(id, dto);
  }

  // Eliminar item
  @Public()
  @Delete(':id/items/:productId')
  removeItem(@Param('id') id: string, @Param('productId') productId: string) {
    return this.shoppingCartService.removeItem(id, { productId });
  }

  // Vaciar carrito
  @Public()
  @Delete(':id')
  clear(@Param('id') id: string) {
    return this.shoppingCartService.clear(id);
  }

  // Eliminar carrito completamente
  @Public()
  @Delete(':id/hard')
  delete(@Param('id') id: string) {
    return this.shoppingCartService.delete(id);
  }
}
