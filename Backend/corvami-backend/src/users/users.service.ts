import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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
      ...createUserDto,
      balance: createUserDto.balance || 0,
      isRegistered: createUserDto.isRegistered || false,
      isActive: true,
    });

    return await this.usersRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepo.find();
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepo.findOne({ where: { email } });
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(userId);
    Object.assign(user, updateUserDto);
    return await this.usersRepo.save(user);
  }

  async addBalance(userId: string, amount: number): Promise<User> {
    const user = await this.findOne(userId);
    user.balance = Number(user.balance) + amount;
    return await this.usersRepo.save(user);
  }

  async deductBalance(userId: string, amount: number): Promise<User> {
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: MongoRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe (solo para usuarios registrados)
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
      ...createUserDto,
      balance: createUserDto.balance || 0,
      isRegistered: createUserDto.isRegistered || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    });

    return await this.usersRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepo.find();
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepo.findOne({
      where: { email },
    });
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(userId);

    Object.assign(user, {
      ...updateUserDto,
      updatedAt: new Date(),
    });

    return await this.usersRepo.save(user);
  }

  async addBalance(userId: string, amount: number): Promise<User> {
    const user = await this.findOne(userId);
    user.balance += amount;
    user.updatedAt = new Date();
    return await this.usersRepo.save(user);
  }

  async deductBalance(userId: string, amount: number): Promise<User> {
    const user = await this.findOne(userId);

    if (user.balance < amount) {
      throw new BadRequestException('Saldo insuficiente');
    }

    user.balance -= amount;
    user.updatedAt = new Date();
    return await this.usersRepo.save(user);
  }

  async remove(userId: string): Promise<void> {
    const user = await this.findOne(userId);
    await this.usersRepo.delete({ userId: user.userId });
  }
}
