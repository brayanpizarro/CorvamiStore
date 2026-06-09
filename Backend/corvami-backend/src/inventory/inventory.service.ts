import { Injectable, Logger, ServiceUnavailableException, BadRequestException } from '@nestjs/common';

export interface InventoryProduct {
  id_producto: number;
  codigo: string;
  nombre: string;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OutputMovementItem {
  producto_id: number;
  cantidad: number;
}

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  private readonly baseUrl =
    process.env.INVENTORY_API_URL ?? 'http://localhost:5000/api';
  private readonly empleadoId =
    process.env.INVENTORY_EMPLEADO_ID ?? 'system-ventas';

  // ── GET /inventory/stock ──────────────────────────────────────────────────

  async getStock(): Promise<InventoryProduct[]> {
    try {
      const res = await fetch(`${this.baseUrl}/inventory/stock`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json() as Promise<InventoryProduct[]>;
    } catch (err) {
      this.logger.error('Error al obtener stock del inventario', err);
      throw new ServiceUnavailableException(
        'El servicio de inventario no está disponible',
      );
    }
  }

  async getStockById(productoId: number): Promise<InventoryProduct | null> {
    const items = await this.getStock();
    return items.find((p) => p.id_producto === productoId) ?? null;
  }

  /**
   * Verifica que cada item tenga stock suficiente.
   * Lanza BadRequestException con detalle por producto si alguno falla.
   */
  async checkStockAvailability(
    items: OutputMovementItem[],
  ): Promise<void> {
    const stock = await this.getStock();
    const stockMap = new Map(stock.map((p) => [p.id_producto, p]));

    const errores: string[] = [];
    for (const item of items) {
      const producto = stockMap.get(item.producto_id);
      if (!producto) {
        errores.push(
          `Producto ID ${item.producto_id} no encontrado en inventario`,
        );
      } else if (producto.stock_actual < item.cantidad) {
        errores.push(
          `"${producto.nombre}" — stock disponible: ${producto.stock_actual}, solicitado: ${item.cantidad}`,
        );
      }
    }

    if (errores.length > 0) {
      throw new BadRequestException({
        message: 'Stock insuficiente para completar el pedido',
        detalle: errores,
      });
    }
  }

  // ── POST /inventory/movements/output ─────────────────────────────────────

  async registerOutput(
    productos: OutputMovementItem[],
    referencia: string,
  ): Promise<void> {
    try {
      const body = {
        tipo: 'SALIDA',
        productos,
        referencia,
        empleado_id: this.empleadoId,
      };

      const res = await fetch(`${this.baseUrl}/inventory/movements/output`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
    } catch (err) {
      // Se loguea pero NO se lanza: el pago ya fue procesado,
      // el movimiento de inventario se puede reintentar.
      this.logger.error(
        `Error al registrar salida de inventario (ref: ${referencia})`,
        err,
      );
    }
  }
}
