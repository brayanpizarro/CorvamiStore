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

## Base de datos nueva mermaid
erDiagram
    %% TABLAS PROPIAS
    clientes {
        int id_cliente PK
        string rut
        string nombre
        string email
        string telefono
        string tipo
    }
    
    ventas_pedido {
        int id_pedido PK
        int id_cliente FK
        int id_empleado FK
        datetime fecha
        string estado
        decimal total
        string canal
    }
    
    ventas_detalle {
        int id_detalle PK
        int id_pedido FK
        int id_producto FK
        int cantidad
        decimal precio_unit
        decimal subtotal
    }
    
    ventas_factura {
        int id_factura PK
        int id_pedido FK
        datetime fecha_emision
        decimal monto_neto
        decimal iva
        decimal total
    }
    
    carrito {
        int id_carrito PK
        string id_sesion
        int id_cliente FK
        int id_producto FK
        int cantidad
        datetime fecha_creacion
    }

    %% TABLAS EXTERNAS (solo lectura)
    %% Schema: RRHH — tabla: RRHH_empleado
    RRHH_empleado {
        int id_empleado PK
        string rut
        string nombre
        int id_rol
        string correo
        string telefono
        string estado
    }

    %% Schema: Inventario — tabla: Producto
    Producto {
        int id PK
        string codigo
        string nombre
        string descripcion
        decimal precio
        int stock_actual
        int stock_minimo
    }

    %% RELACIONES
    clientes ||--o{ ventas_pedido : "realiza"
    clientes ||--o{ carrito : "tiene"
    
    ventas_pedido ||--|| ventas_factura : "genera"
    ventas_pedido ||--|{ ventas_detalle : "contiene"
    
    ventas_pedido }o--|| RRHH_empleado : "atendido por"
    
    ventas_detalle }o--|| Producto : "referencia"
    carrito }o--|| Producto : "referencia"