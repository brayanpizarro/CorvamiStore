import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendContactEmail(data: ContactEmailData): Promise<void> {
    const { name, email, subject, message } = data;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Email de la tienda
      replyTo: email,
      subject: `Contacto de ${name}: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuevo mensaje de contacto</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                        Corvami Store
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                        Nuevo mensaje de contacto
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">
                        Mensaje de ${name}
                      </h2>

                      <div style="background-color: #f9fafb; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #374151;">Nombre:</strong>
                              <span style="color: #6b7280; margin-left: 10px;">${name}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #374151;">Email:</strong>
                              <span style="color: #6b7280; margin-left: 10px;">${email}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #374151;">Asunto:</strong>
                              <span style="color: #6b7280; margin-left: 10px;">${subject}</span>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <div style="margin-top: 30px;">
                        <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">Mensaje:</h3>
                        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 6px; color: #1f2937; line-height: 1.6;">
                          ${message.replace(/\n/g, '<br>')}
                        </div>
                      </div>

                      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #6b7280; font-size: 13px;">
                          <strong>Tip:</strong> Puedes responder directamente a este correo para contactar a ${name}
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #6b7280; font-size: 12px;">
                        Este correo fue generado automáticamente desde el formulario de contacto de Corvami Store
                      </p>
                      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 11px;">
                        © 2025 Corvami Store. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendConfirmationEmail(email: string, name: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Gracias por contactarnos - Corvami Store',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de contacto</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                        Corvami Store
                      </h1>
                      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                        ¡Gracias por contactarnos!
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px;">
                        Hola ${name},
                      </h2>

                      <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6; font-size: 15px;">
                        Hemos recibido tu mensaje y queremos agradecerte por tomarte el tiempo de contactarnos.
                      </p>

                      <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6; font-size: 15px;">
                        Nuestro equipo revisará tu consulta y te responderemos lo antes posible, generalmente dentro de las próximas 24-48 horas.
                      </p>

                      <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;">
                          <strong>💡 Tip:</strong> Si tu consulta es urgente, también puedes escribirnos directamente a nuestro WhatsApp o llamarnos durante nuestro horario de atención.
                        </p>
                      </div>

                      <p style="margin: 20px 0 0 0; color: #4b5563; line-height: 1.6; font-size: 15px;">
                        Saludos cordiales,<br>
                        <strong style="color: #1f2937;">El equipo de Corvami Store</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                        ¿Necesitas ayuda? Visita nuestro sitio web
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 11px;">
                        © 2025 Corvami Store. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
