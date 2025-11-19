import { Controller, Post, Body, UseGuards, Get, Headers, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('validate')
  async validateToken(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token no proporcionado');
    }
    const token = authHeader.substring(7);
    return this.authService.validateToken(token);
  }

  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token no proporcionado');
    }
    const token = authHeader.substring(7);
    const user = await this.authService.validateToken(token);
    return this.authService.getUserProfile(user.userId);
  }

  @Patch('profile')
  async updateProfile(
    @Headers('authorization') authHeader: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token no proporcionado');
    }
    const token = authHeader.substring(7);
    const user = await this.authService.validateToken(token);
    return this.authService.updateProfile(user.userId, updateProfileDto);
  }
}
