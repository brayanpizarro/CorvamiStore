import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { VentasPedido } from '../orders/entities/ventas-pedido.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.MAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendOrderConfirmation(pedido: VentasPedido): Promise<void> {
    const email = pedido.shippingInfo?.email;
    if (!email) {
      this.logger.warn(`Pedido #${pedido.id_pedido} sin email de destino, omitiendo confirmación.`);
      return;
    }

    const itemsHtml = (pedido.detalles ?? [])
      .map(
        (d) =>
          `<tr>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;">Producto #${d.id_producto}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${d.cantidad}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">$${Number(d.precio_unit).toFixed(2)}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">$${Number(d.subtotal).toFixed(2)}</td>
          </tr>`,
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="UTF-8"><title>Confirmación de pedido</title></head>
      <body style="font-family:Arial,sans-serif;background:#f9f9f9;padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <h2 style="color:#1a1a2e;margin-bottom:4px;">¡Gracias por tu compra!</h2>
          <p style="color:#555;">Tu pedido <strong>#${pedido.id_pedido}</strong> ha sido confirmado y está siendo procesado.</p>

          <h3 style="color:#1a1a2e;border-bottom:2px solid #f0f0f0;padding-bottom:8px;">Resumen del pedido</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#f5f5f5;">
                <th style="padding:8px 12px;text-align:left;">Producto</th>
                <th style="padding:8px 12px;text-align:center;">Cant.</th>
                <th style="padding:8px 12px;text-align:right;">Precio</th>
                <th style="padding:8px 12px;text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="margin-top:16px;text-align:right;font-size:15px;">
            <p style="margin:4px 0;">Subtotal: <strong>$${Number(pedido.subtotal).toFixed(2)}</strong></p>
            <p style="margin:4px 0;">Envío: <strong>$${Number(pedido.costo_envio).toFixed(2)}</strong></p>
            <p style="margin:4px 0;font-size:18px;color:#1a1a2e;">Total: <strong>$${Number(pedido.total).toFixed(2)}</strong></p>
          </div>

          <h3 style="color:#1a1a2e;border-bottom:2px solid #f0f0f0;padding-bottom:8px;margin-top:24px;">Datos de envío</h3>
          <p style="font-size:14px;color:#444;line-height:1.6;">
            ${pedido.shippingInfo?.name ?? ''}<br>
            ${pedido.shippingInfo?.address ?? ''}<br>
            ${pedido.shippingInfo?.city ?? ''}${pedido.shippingInfo?.department ? ', ' + pedido.shippingInfo.department : ''}<br>
            ${pedido.shippingInfo?.phone ?? ''}
          </p>

          <p style="font-size:13px;color:#999;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
            Este correo fue generado automáticamente por <strong>CorvamiStore</strong>. Por favor no respondas a este mensaje.
          </p>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: `"CorvamiStore" <${process.env.MAIL_USER}>`,
        to: email,
        subject: `✅ Confirmación de pedido #${pedido.id_pedido} — CorvamiStore`,
        html,
      });
      this.logger.log(`Confirmación enviada a ${email} para pedido #${pedido.id_pedido}`);
    } catch (err) {
      this.logger.error(`Error al enviar confirmación para pedido #${pedido.id_pedido}: ${err}`);
    }
  }
}
