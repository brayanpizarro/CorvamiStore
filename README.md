## Cómo ejecutar el proyecto

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- [Docker](https://www.docker.com/) y Docker Compose
- Acceso a la base de datos **Neon PostgreSQL (si2)**

---

### Backend (NestJS)

#### Opción A — Con Docker (recomendado)

El backend se conecta directamente a Neon (no levanta PostgreSQL local):

```bash
cd CorvamiStore/Backend/corvami-backend
docker-compose up --build
```

El API quedará disponible en `http://localhost:3000`.

#### Opción B — Sin Docker (desarrollo local)

Instala dependencias y levanta en modo desarrollo:

```bash
cd CorvamiStore/Backend/corvami-backend
npm install
npm run start:dev
```

El API quedará disponible en `http://localhost:3000`.

---

### Frontend (React + Vite)

```bash
cd CorvamiStore/Frontend/corvami-frontend
npm install
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

---

### Variables de entorno (Backend)

Crea un archivo `.env` en `Backend/corvami-backend/` con las siguientes variables si no usas Docker:

```env
# Neon PostgreSQL — conexión principal (schema: Ventas)
DB_HOST=ep-royal-glade-ac55fitc-pooler.sa-east-1.aws.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASSWORD=<tu_contraseña>
DB_NAME=si2
DB_SCHEMA=Ventas

# Auth
JWT_SECRET=corvami-secret-key-2024

# Email (opcional)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=tu_app_password
```

> **Nota:** Ambas conexiones TypeORM (`default` y `external`) apuntan a la misma base Neon si2.
> - Conexión `default` → schema `Ventas` (tablas propias, `synchronize: false`)
> - Conexión `external` → schemas `Inventario` y `RRHH` (**solo lectura**, `synchronize: false`)

---

## Modelo de base de datos

```mermaid
erDiagram
    %% ── TABLAS PROPIAS (schema: Ventas) ───────────────────────────────

    clientes {
        int      id_cliente   PK  "Identificador único del cliente"
        string   rut              "RUT (opcional, máx 12 chars)"
        string   nombre           "Nombre completo"
        string   email        UK  "Email único"
        string   telefono         "Teléfono de contacto"
        string   tipo             "Tipo de cliente (persona/empresa)"
        string   userId       UK  "UUID de sesión auth"
        string   password         "Hash bcrypt"
        boolean  isRegistered     "¿Tiene cuenta registrada?"
        boolean  isActive         "¿Cuenta activa?"
        decimal  balance          "Saldo disponible"
    }

    ventas_pedido {
        int      id_pedido    PK  "Identificador del pedido"
        int      id_cliente   FK  "→ clientes.id_cliente"
        int      id_empleado  FK  "→ RRHH_empleado.id_empleado"
        datetime fecha            "Fecha de creación"
        string   estado           "pendiente/procesando/enviado/entregado"
        decimal  total            "Total con envío"
        decimal  subtotal         "Subtotal sin envío"
        decimal  costo_envio      "Costo de despacho"
        string   canal            "online/presencial"
        boolean  isPaid           "¿Pago confirmado?"
        datetime paidAt           "Fecha de pago"
        string   paymentMethod    "Método de pago"
    }

    ventas_detalle {
        int      id_detalle   PK  "Identificador del detalle"
        int      id_pedido    FK  "→ ventas_pedido.id_pedido"
        int      id_producto  FK  "→ Producto.id"
        int      cantidad         "Unidades compradas"
        decimal  precio_unit      "Precio unitario al momento de compra"
        decimal  subtotal         "cantidad × precio_unit"
    }

    ventas_factura {
        int      id_factura   PK  "Identificador de la factura"
        int      id_pedido    FK  "→ ventas_pedido.id_pedido"
        datetime fecha_emision    "Fecha de emisión"
        decimal  monto_neto       "Monto sin IVA"
        decimal  iva              "IVA (19%)"
        decimal  total            "Total con IVA"
    }

    carrito {
        int      id_carrito   PK  "Identificador del ítem en carrito"
        string   id_sesion        "ID de sesión (anónima o autenticada)"
        int      id_cliente   FK  "→ clientes.id_cliente (nullable)"
        int      id_producto  FK  "→ Producto.id"
        int      cantidad         "Unidades en carrito"
        datetime fecha_creacion   "Fecha de adición"
    }

    %% ── TABLAS EXTERNAS (solo lectura) ────────────────────────────────

    RRHH_empleado {
        int    id_empleado  PK  "Identificador del empleado"
        string rut              "RUT del empleado"
        string nombre           "Nombre completo"
        int    id_rol           "Rol/cargo"
        string correo           "Correo corporativo"
        string telefono         "Teléfono"
        string estado           "activo/inactivo"
    }

    Producto {
        int     id           PK  "Identificador del producto"
        string  codigo       UK  "Código SKU único"
        string  nombre           "Nombre del producto"
        string  descripcion      "Descripción detallada"
        decimal precio           "Precio de venta"
        int     stock_actual     "Unidades disponibles"
        int     stock_minimo     "Stock mínimo antes de alerta"
    }

    %% ── RELACIONES (con cardinalidad explícita) ────────────────────────
    %%
    %%  Notación Mermaid:
    %%    ||  = exactamente uno  (lado "1")
    %%    |{  = uno o más        (lado "N", mínimo 1)
    %%    o{  = cero o más       (lado "N", mínimo 0)
    %%    o|  = cero o uno       (opcional)
    %%
    %% ── 1 cliente → 0..N pedidos (1:N) ─────────────────────────────────
    clientes ||--o{ ventas_pedido : "1 realiza 0..N"

    %% ── 1 pedido → exactamente 1 factura (1:1) ──────────────────────────
    ventas_pedido ||--|| ventas_factura : "1 genera 1"

    %% ── 1 pedido → 1..N líneas de detalle (1:N) ─────────────────────────
    ventas_pedido ||--|{ ventas_detalle : "1 contiene 1..N"

    %% ── 0..N pedidos → 1 empleado (N:1) ────────────────────────────────
    ventas_pedido }o--|| RRHH_empleado : "N:1 atendido por"

    %% ── 1 cliente → 0..N ítems en carrito (1:N) ─────────────────────────
    clientes ||--o{ carrito : "1 tiene 0..N"

    %% ── 0..N detalles → 1 producto (N:1) ────────────────────────────────
    ventas_detalle }o--|| Producto : "N:1 referencia"

    %% ── 0..N ítems carrito → 1 producto (N:1) ───────────────────────────
    carrito }o--|| Producto : "N:1 referencia"
```

> **Leyenda de cardinalidad:**
>
> | Notación | Significado |
> |----------|-------------|
> | `1:1`    | Un registro se relaciona con exactamente un registro del otro lado |
> | `1:N`    | Un registro se relaciona con uno o más registros del otro lado |
> | `N:1`    | Muchos registros apuntan a un único registro del otro lado |
> | `1:0..N` | Un registro puede no tener registros relacionados o tener varios |