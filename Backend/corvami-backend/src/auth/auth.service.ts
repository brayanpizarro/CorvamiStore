import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      phone: registerDto.phone,
      address: registerDto.address,
      city: registerDto.city,
      country: registerDto.country,
      balance: 0,
      isRegistered: true,
    });

    // Generar token
    const payload = { email: user.email, sub: user.userId };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.nombre,
        balance: user.balance,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.isRegistered) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password || '',
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token
    const payload = { email: user.email, sub: user.userId };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.nombre,
        balance: user.balance,
      },
    };
  }

  async validateUser(userId: string) {
    return await this.usersService.findOne(userId);
  }
}
