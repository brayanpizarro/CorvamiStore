import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ShoppingCartService } from './shopping-cart.service';
import { CreateShoppingCartDto } from './dto/create-shopping-cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping-cart.dto';

@Controller()
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @MessagePattern('createShoppingCart')
  create(@Payload() createShoppingCartDto: CreateShoppingCartDto) {
    return this.shoppingCartService.create(createShoppingCartDto);
  }

  @MessagePattern('findAllShoppingCart')
  findAll() {
    return this.shoppingCartService.findAll();
  }

  @MessagePattern('findOneShoppingCart')
  findOne(@Payload() id: number) {
    return this.shoppingCartService.findOne(id);
  }

  @MessagePattern('updateShoppingCart')
  update(@Payload() updateShoppingCartDto: UpdateShoppingCartDto) {
    return this.shoppingCartService.update(updateShoppingCartDto.id, updateShoppingCartDto);
  }

  @MessagePattern('removeShoppingCart')
  remove(@Payload() id: number) {
    return this.shoppingCartService.remove(id);
  }
}
