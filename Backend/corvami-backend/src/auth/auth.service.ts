import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: MongoRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Crear nuevo usuario
    const user = {
      userId: randomUUID(),
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.userRepo.insert(user as User);

    // Generar JWT
    const token = this.jwtService.sign(
      {
        sub: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { expiresIn: '7d' },
    );

    return {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
      expiresIn: '7d',
    };
  }

  async login(dto: LoginDto) {
    // Buscar usuario por email
    const user = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar lastLogin
    await this.userRepo.updateOne(
      { userId: user.userId },
      { $set: { lastLogin: new Date() } },
    );

    // Generar JWT
    const token = this.jwtService.sign(
      {
        sub: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      { expiresIn: '7d' },
    );

    return {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
      expiresIn: '7d',
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepo.findOne({
        where: { userId: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Usuario inválido o inactivo');
      }

      return {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      lastLogin: user.lastLogin,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({
      where: { userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Si se actualiza el email, verificar que no esté en uso
    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const existingUser = await this.userRepo.findOne({
        where: { email: dto.email.toLowerCase() },
      });

      if (existingUser) {
        throw new ConflictException('El correo ya está en uso');
      }
    }

    // Preparar datos a actualizar
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (dto.firstName) updateData.firstName = dto.firstName;
    if (dto.lastName) updateData.lastName = dto.lastName;
    if (dto.email) updateData.email = dto.email.toLowerCase();
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    // Actualizar usuario
    await this.userRepo.updateOne({ userId }, { $set: updateData });

    // Obtener usuario actualizado
    const updatedUser = await this.userRepo.findOne({ where: { userId } });

    if (!updatedUser) {
      throw new UnauthorizedException('Error al actualizar el perfil');
    }

    // Generar nuevo token con los datos actualizados
    const token = this.jwtService.sign(
      {
        sub: updatedUser.userId,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
      { expiresIn: '7d' },
    );

    return {
      userId: updatedUser.userId,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      token,
      expiresIn: '7d',
    };
  }
}
