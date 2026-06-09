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

-**Documentación Swagger:** `http://localhost:3000/api/docs`

---

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

> **Cardinalidad:** `||` = exactamente 1 · `o{` = 0 o muchos · `|{` = 1 o muchos · `}o` = muchos a 1

```mermaid
erDiagram
    %% Tablas propias (schema: Ventas)
    clientes {
        int     id_cliente   PK
        string  rut
        string  nombre
        string  email
        string  telefono
        string  tipo
        string  userId
        string  password
        boolean isRegistered
        boolean isActive
        decimal balance
    }

    ventas_pedido {
        int     id_pedido    PK
        int     id_cliente   FK
        int     id_empleado  FK
        date    fecha
        string  estado
        decimal total
        decimal subtotal
        decimal costo_envio
        string  canal
        boolean isPaid
        date    paidAt
        string  paymentMethod
    }

    ventas_detalle {
        int     id_detalle   PK
        int     id_pedido    FK
        int     id_producto  FK
        int     cantidad
        decimal precio_unit
        decimal subtotal
    }

    ventas_factura {
        int     id_factura   PK
        int     id_pedido    FK
        date    fecha_emision
        decimal monto_neto
        decimal iva
        decimal total
    }

    carrito {
        int     id_carrito   PK
        string  id_sesion
        int     id_cliente   FK
        int     id_producto  FK
        int     cantidad
        date    fecha_creacion
    }

    %% Tablas externas (solo lectura)
    RRHH_empleado {
        int    id_empleado  PK
        string rut
        string nombre
        int    id_rol
        string correo
        string telefono
        string estado
    }

    Producto {
        int     id          PK
        string  codigo
        string  nombre
        string  descripcion
        decimal precio
        int     stock_actual
        int     stock_minimo
    }

    %% Relaciones
    clientes       ||--o{ ventas_pedido  : "1 a N - realiza"
    ventas_pedido  ||--|| ventas_factura : "1 a 1 - genera"
    ventas_pedido  ||--|{ ventas_detalle : "1 a N - contiene"
    ventas_pedido  }o--|| RRHH_empleado  : "N a 1 - atendido por"
    clientes       ||--o{ carrito        : "1 a N - tiene"
    ventas_detalle }o--|| Producto       : "N a 1 - referencia"
    carrito        }o--|| Producto       : "N a 1 - referencia"
```

| Notación flecha | Cardinalidad |
|-----------------|--------------|
| `\|\|--\|\|`   | 1 a 1 exacto |
| `\|\|--\|{`    | 1 a N (mínimo 1) |
| `\|\|--o{`     | 1 a 0..N (puede ser cero) |
| `}o--\|\|`     | N a 1 |