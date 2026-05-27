## Cómo ejecutar el proyecto

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- [Docker](https://www.docker.com/) y Docker Compose (para el backend con base de datos local)

---

### Backend (NestJS)

#### Opción A — Con Docker (recomendado)

Levanta el backend junto con PostgreSQL local en contenedores:

```bash
cd CorvamiStore/Backend/corvami-backend
docker-compose up --build
```

El API quedará disponible en `http://localhost:3000`.

#### Opción B — Sin Docker (desarrollo local)

1. Asegúrate de tener una instancia de PostgreSQL corriendo en `localhost:5432` con:
   - Usuario: `postgres` / Contraseña: `postgres` / Base de datos: `corvami`

2. Instala dependencias y levanta en modo desarrollo:

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
# Base de datos local
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=corvami

# Base de datos externa Neon (solo lectura: empleados + productos)
EXT_DB_HOST=ep-royal-glade-ac55fitc-pooler.sa-east-1.aws.neon.tech
EXT_DB_PORT=5432
EXT_DB_USER=neondb_owner
EXT_DB_PASSWORD=<tu_contraseña>
EXT_DB_NAME=si2

# Auth
JWT_SECRET=corvami-secret-key-2024

# Email (opcional)
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=tu_app_password
```

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

    %% TABLAS CONSULTADAS (externas)
    empleados_externos {
        int id_empleado PK
        string nombre
        string apellido
        string cargo
    }

    productos_externos {
        int id_producto PK
        string codigo
        string nombre
        decimal precio_unit
        int stock_actual
        string categoria
    }

    %% RELACIONES
    clientes ||--o{ ventas_pedido : "realiza"
    clientes ||--o{ carrito : "tiene"
    
    ventas_pedido ||--|| ventas_factura : "genera"
    ventas_pedido ||--|{ ventas_detalle : "contiene"
    
    ventas_pedido }o--|| empleados_externos : "atendido por"
    
    ventas_detalle }o--|| productos_externos : "referencia"
    carrito }o--|| productos_externos : "referencia"