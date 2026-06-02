import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado.' })
  @ApiResponse({ status: 409, description: 'El correo ya existe.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Datos del usuario.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  @ApiOperation({ summary: 'Obtener usuario por correo electrónico' })
  @ApiParam({ name: 'email', description: 'Correo electrónico del usuario' })
  @ApiResponse({ status: 200, description: 'Datos del usuario.' })
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userId')
  @ApiOperation({ summary: 'Actualizar datos de un usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.' })
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userId/add-balance')
  @ApiOperation({ summary: 'Agregar saldo a la cuenta del usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario' })
  @ApiBody({ schema: { properties: { amount: { type: 'number', example: 50000 } } } })
  @ApiResponse({ status: 200, description: 'Saldo actualizado.' })
  addBalance(@Param('userId') userId: string, @Body('amount') amount: number) {
    return this.usersService.addBalance(userId, amount);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado.' })
  remove(@Param('userId') userId: string) {
    return this.usersService.remove(userId);
  }
}
