import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Cliente } from './entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Cliente)
    private readonly usersRepo: Repository<Cliente>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Cliente> {
    if (createUserDto.isRegistered) {
      const existingUser = await this.usersRepo.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('El email ya está registrado');
      }
    }

    const user = this.usersRepo.create({
      userId: randomUUID(),
      email: createUserDto.email,
      nombre: createUserDto.name,
      telefono: createUserDto.phone,
      balance: createUserDto.balance || 0,
      isRegistered: createUserDto.isRegistered || false,
      isActive: true,
      password: createUserDto.password,
      tipo: createUserDto.tipo,
    });

    return await this.usersRepo.save(user);
  }

  async findAll(): Promise<Cliente[]> {
    return await this.usersRepo.find();
  }

  async findOne(userId: string): Promise<Cliente> {
    const user = await this.usersRepo.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return await this.usersRepo.findOne({ where: { email } });
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<Cliente> {
    const user = await this.findOne(userId);
    const { name, phone, ...rest } = updateUserDto as any;
    if (name !== undefined) user.nombre = name;
    if (phone !== undefined) user.telefono = phone;
    Object.assign(user, rest);
    return await this.usersRepo.save(user);
  }

  async addBalance(userId: string, amount: number): Promise<Cliente> {
    const user = await this.findOne(userId);
    user.balance = Number(user.balance) + amount;
    return await this.usersRepo.save(user);
  }

  async deductBalance(userId: string, amount: number): Promise<Cliente> {
    const user = await this.findOne(userId);
    if (Number(user.balance) < amount) {
      throw new BadRequestException('Saldo insuficiente');
    }
    user.balance = Number(user.balance) - amount;
    return await this.usersRepo.save(user);
  }

  async remove(userId: string): Promise<void> {
    await this.findOne(userId);
    await this.usersRepo.delete({ userId });
  }
}
