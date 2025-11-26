import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';

class SendContactEmailDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('contact')
  @HttpCode(HttpStatus.OK)
  async sendContactEmail(@Body() data: SendContactEmailDto) {
    try {
      // Enviar email a la tienda
      await this.emailService.sendContactEmail(data);
      
      // Enviar email de confirmación al usuario
      await this.emailService.sendConfirmationEmail(data.email, data.name);

      return {
        success: true,
        message: 'Mensaje enviado correctamente',
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error al enviar el mensaje. Por favor intenta de nuevo.');
    }
  }
}
