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
                          <strong> Tip:</strong> Si tu consulta es urgente, también puedes escribirnos directamente a nuestro WhatsApp o llamarnos durante nuestro horario de atención.
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

  async sendOrderConfirmationEmail(order: any): Promise<void> {
    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong><br>
          <span style="color: #6b7280; font-size: 13px;">Cantidad: ${item.quantity}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          $${item.unitPrice.toLocaleString('es-CO')} c/u
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">
          $${item.totalPrice.toLocaleString('es-CO')}
        </td>
      </tr>
    `,
      )
      .join('');

    const paymentMethodText =
      order.paymentMethod === 'balance'
        ? 'Saldo de Cuenta'
        : order.paymentMethod === 'guest_checkout'
          ? 'Compra como Invitado'
          : 'Tarjeta de Crédito';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.shippingInfo.email,
      subject: `Confirmación de Pedido #${order.orderId.slice(0, 8).toUpperCase()} - Corvami Store`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Pedido</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: 0 auto 15px auto;">
                        <circle cx="12" cy="12" r="10" fill="white" opacity="0.2"/>
                        <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2"/>
                      </svg>
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                        ¡Pedido Confirmado!
                      </h1>
                      <p style="margin: 15px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                        Gracias por tu compra en Corvami Store
                      </p>
                    </td>
                  </tr>

                  <!-- Contenido -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                        Hola <strong>${order.shippingInfo.name}</strong>,
                      </p>
                      
                      <p style="margin: 0 0 30px 0; color: #374151; font-size: 15px; line-height: 1.6;">
                        Tu pedido ha sido procesado exitosamente. A continuación encontrarás los detalles:
                      </p>

                      <!-- Información del Pedido -->
                      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding-bottom: 10px;">
                              <strong style="color: #1f2937;">Número de Orden:</strong><br>
                              <span style="color: #10b981; font-size: 18px; font-weight: bold;">#${order.orderId.slice(0, 8).toUpperCase()}</span>
                            </td>
                            <td style="padding-bottom: 10px; text-align: right;">
                              <strong style="color: #1f2937;">Estado:</strong><br>
                              <span style="color: #10b981; font-weight: bold;">Pagado</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-top: 10px;">
                              <strong style="color: #1f2937;">Método de Pago:</strong><br>
                              <span style="color: #6b7280;">${paymentMethodText}</span>
                            </td>
                            <td style="padding-top: 10px; text-align: right;">
                              <strong style="color: #1f2937;">Fecha:</strong><br>
                              <span style="color: #6b7280;">${new Date().toLocaleDateString('es-CO')}</span>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <!-- Productos -->
                      <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: bold;">
                        Productos
                      </h2>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                        ${itemsHtml}
                        <tr style="background-color: #f9fafb;">
                          <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold; color: #1f2937;">
                            Subtotal:
                          </td>
                          <td style="padding: 15px; text-align: right; font-weight: bold; color: #1f2937;">
                            $${order.subtotal.toLocaleString('es-CO')}
                          </td>
                        </tr>
                        <tr style="background-color: #f9fafb;">
                          <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold; color: #1f2937;">
                            Envío:
                          </td>
                          <td style="padding: 15px; text-align: right; font-weight: bold; color: #1f2937;">
                            $${order.shippingCost.toLocaleString('es-CO')}
                          </td>
                        </tr>
                        <tr style="background-color: #10b981;">
                          <td colspan="2" style="padding: 20px; text-align: right; font-weight: bold; color: #ffffff; font-size: 18px;">
                            Total:
                          </td>
                          <td style="padding: 20px; text-align: right; font-weight: bold; color: #ffffff; font-size: 18px;">
                            $${order.total.toLocaleString('es-CO')}
                          </td>
                        </tr>
                      </table>

                      <!-- Dirección de Envío -->
                      <h2 style="margin: 30px 0 15px 0; color: #1f2937; font-size: 20px; font-weight: bold;">
                        Dirección de Envío
                      </h2>
                      
                      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                        <p style="margin: 0 0 8px 0; color: #374151; line-height: 1.6;">
                          <strong>${order.shippingInfo.name}</strong>
                        </p>
                        <p style="margin: 0 0 8px 0; color: #6b7280; line-height: 1.6;">
                          ${order.shippingInfo.address}
                        </p>
                        <p style="margin: 0 0 8px 0; color: #6b7280; line-height: 1.6;">
                          ${order.shippingInfo.city}, ${order.shippingInfo.department}
                        </p>
                        <p style="margin: 0; color: #6b7280; line-height: 1.6;">
                          Tel: ${order.shippingInfo.phone}
                        </p>
                      </div>

                      <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        Recibirás tu pedido en los próximos 3-5 días hábiles. Te notificaremos cuando sea enviado.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0 0 15px 0; color: #1f2937; font-size: 15px; font-weight: bold;">
                        ¿Necesitas ayuda?
                      </p>
                      <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
                        Contáctanos en cualquier momento
                      </p>
                      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
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
