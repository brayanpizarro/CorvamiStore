# 🔐 Sistema de Autenticación - CorvamiStore

## 📋 Descripción General

Sistema de autenticación fullstack (JWT + MongoDB + Redis) para CorvamiStore, con login/registro, persistencia de sesión y control de acceso.

---

## 🏗️ ARQUITECTURA

### Backend (NestJS + JWT + MongoDB)

```
src/auth/
├── entities/
│   └── user.entity.ts              # Modelo User (MongoDB)
├── dto/
│   ├── login.dto.ts                # Validación login
│   └── register.dto.ts             # Validación registro
├── auth.service.ts                 # Lógica: hash, JWT, validación
├── auth.controller.ts              # Endpoints: /auth/register, /login
└── auth.module.ts                  # Módulo (JWT + TypeORM)
```

#### Endpoints Backend

```
POST   /auth/register               Crear usuario
POST   /auth/login                  Autenticar y retornar JWT
GET    /auth/validate               Validar token
GET    /auth/profile                Obtener perfil del usuario
```

#### Entity: `User`

```typescript
@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  userId: string;               // UUID

  @Column({ unique: true, lowercase: true })
  email: string;

  @Column()
  password: string;             // Hasheado con bcrypt (10 rounds)

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Service: `AuthService`

**Métodos**:

1. **register(dto: RegisterDto)** - Crea usuario
   - Validar email único
   - Hash de contraseña (bcrypt, 10 rounds)
   - Generar UUID
   - Retornar JWT (7d expiration)

2. **login(dto: LoginDto)** - Autentica usuario
   - Buscar por email
   - Comparar contraseña hasheada
   - Actualizar lastLogin
   - Retornar JWT (7d expiration)

3. **validateToken(token: string)** - Valida JWT
   - Verificar firma
   - Comprobar usuario existe
   - Retornar payload decodificado

4. **getUserProfile(userId: string)** - Obtiene perfil
   - Buscar usuario por userId
   - Retornar datos públicos

#### JWT Configuration

```typescript
JwtModule.registerAsync({
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET') || 'corvami-secret-key-dev',
    signOptions: { expiresIn: '7d' },
  }),
})
```

**Variables de entorno**:
```bash
JWT_SECRET=your-secret-key-here
MONGO_URL=mongodb://localhost:27017/corvami
```

---

### Frontend (React + TypeScript + Context API)

```
src/
├── contexts/
│   └── AuthContext.tsx             # Estado global (user, token, login/logout)
├── components/
│   ├── LoginPage.tsx               # Formulario login
│   ├── RegisterPage.tsx            # Formulario registro
│   └── Header.tsx                  # Header con usuario / login button
├── App.tsx                         # Router + rutas (Home, /login, /register)
└── main.tsx                        # AuthProvider + ThemeProvider
```

#### AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email, password, firstName, lastName) => Promise<void>;
  logout: () => void;
}
```

**Funcionalidades**:
- Guarda token en localStorage
- Carga sesión desde localStorage al montar
- Maneja errores y validaciones
- Sincronización con API backend

#### LoginPage

- ✅ Email y contraseña
- ✅ Toggle mostrar/ocultar contraseña
- ✅ Manejo de errores
- ✅ Loading state
- ✅ Link a registro
- ✅ Estética con tema dark/light

#### RegisterPage

- ✅ Nombre, apellido, email, contraseña
- ✅ Validación de campos
- ✅ Contraseña mínimo 8 caracteres
- ✅ Confirmación de contraseña
- ✅ Toggle mostrar/ocultar
- ✅ Link a login
- ✅ Términos y condiciones

#### Header Actualizado

- ✅ Botón "Iniciar Sesión" (no autenticado)
- ✅ Menú usuario con:
  - Nombre del usuario
  - Correo
  - Link a perfil (TODO)
  - Link a órdenes (TODO)
  - Botón logout
- ✅ Responsive en mobile

---

## 📦 DEPENDENCIAS REQUERIDAS

### Backend

```bash
npm install @nestjs/jwt @nestjs/config bcrypt
npm install --save-dev @types/bcrypt
```

**package.json** (Backend):
```json
{
  "dependencies": {
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/config": "^3.0.0",
    "bcrypt": "^5.1.1"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.0"
  }
}
```

### Frontend

```bash
npm install react-router-dom
```

**package.json** (Frontend):
```json
{
  "dependencies": {
    "react-router-dom": "^6.20.0"
  }
}
```

---

## 🚀 GUÍA DE INICIO

### 1. Backend - Configurar variables de entorno

**Backend/corvami-backend/.env**:
```bash
# Base de datos
MONGO_URL=mongodb://localhost:27017/corvami

# JWT
JWT_SECRET=corvami-secret-key-super-seguro-cambiar-en-prod

# Servidor
PORT=3000
NODE_ENV=development
```

### 2. Backend - Instalar y ejecutar

```bash
cd Backend/corvami-backend
npm install
npm run start:dev
```

**Output esperado**:
```
[Nest] 1234  - 11/18/2025, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 1234  - 11/18/2025, 10:00:01 AM     LOG [InstanceLoader] AuthModule dependencies initialized
Mapped {/auth/register, POST}
Mapped {/auth/login, POST}
Mapped {/auth/validate, GET}
Mapped {/auth/profile, GET}
[Nest] 1234  - 11/18/2025, 10:00:02 AM     LOG [NestApplication] Nest application successfully started
```

### 3. Frontend - Instalar y ejecutar

```bash
cd Frontend/corvami-frontend
npm install
npm run dev
```

### 4. Probar endpoints (curl)

**Registro**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "MiPassword123",
    "firstName": "Juan",
    "lastName": "Pérez"
  }'
```

**Response**:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "7d"
}
```

**Login**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "MiPassword123"
  }'
```

**Validar Token**:
```bash
curl -X GET http://localhost:3000/auth/validate \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔄 FLUJO DE AUTENTICACIÓN

### Registro

```
Frontend (RegisterPage)
  ↓
User llena: email, password, firstName, lastName
  ↓
POST /auth/register + validación (minLength, email format)
  ↓
Backend AuthService
  ├─ Verificar email único en MongoDB
  ├─ Hash password con bcrypt
  ├─ Crear documento User
  └─ Generar JWT (7d expiration)
  ↓
Response: { userId, email, firstName, lastName, token }
  ↓
Frontend AuthContext
  ├─ Guardar token en localStorage
  ├─ Guardar user en localStorage
  ├─ Actualizar state (user, token, isAuthenticated)
  └─ Redirect a home
```

### Login

```
Frontend (LoginPage)
  ↓
User ingresa: email, password
  ↓
POST /auth/login + validación
  ↓
Backend AuthService
  ├─ Buscar user por email (case-insensitive)
  ├─ Comparar password con bcrypt
  ├─ Actualizar lastLogin
  └─ Generar JWT
  ↓
Response: { userId, email, firstName, lastName, token }
  ↓
Frontend AuthContext + redirect
```

### Logout

```
Frontend (Header - User Menu)
  ↓
User hace click en "Cerrar Sesión"
  ↓
AuthContext.logout()
  ├─ Limpiar state (user = null, token = null)
  ├─ Borrar localStorage
  └─ Redirect a home (implícito en Header)
```

### Persistencia de Sesión

```
Al abrir la app
  ↓
main.tsx monta AuthProvider
  ↓
useEffect en AuthProvider
  ├─ Lee localStorage (auth_token, auth_user)
  └─ Si existen, restaura state
  ↓
Header renderiza según isAuthenticated
  ├─ true  → Muestra menú usuario
  └─ false → Muestra botón "Iniciar Sesión"
```

---

## 🎨 ESTILOS Y DISEÑO

### Paleta de colores

```
Verde Primario:    #10B981 (emerald-500)
Verde Secundario:  #059669 (emerald-600)
Verde Claro:       #34D399 (emerald-400)
Negro:             #000000
Gris Oscuro:       #111827 (gray-900)
Gris Claro:        #F3F4F6 (gray-100)
```

### Componentes reutilizados

- **Inputs**: Border verde dinámico, focus state con ring
- **Buttons**: Gradient verde, hover scale, shadow neon
- **Forms**: Validación visual, error messages en rojo
- **Tema**: Dark/light mode con localStorage

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] Entity User en MongoDB
- [x] DTOs: RegisterDto, LoginDto
- [x] AuthService: register, login, validateToken, getProfile
- [x] AuthController: POST register, POST login, GET validate, GET profile
- [x] JWT configurado con NestJS
- [x] Bcrypt para hash de contraseña
- [x] AuthContext en React
- [x] LoginPage component
- [x] RegisterPage component
- [x] Header actualizado con user menu
- [x] App.tsx con React Router
- [x] main.tsx con AuthProvider
- [ ] Protected routes (ProtectedRoute component)
- [ ] Refresh token (opcional)
- [ ] Password reset (TODO)
- [ ] Email verification (TODO)
- [ ] OAuth (TODO)

---

## 🧪 TESTING (Próximas fases)

### Backend Tests

```bash
npm run test

# Unit tests para AuthService
# - register() success/error cases
# - login() with correct/incorrect password
# - validateToken() valid/invalid
# - password hashing
```

### Frontend Tests

```bash
npm run test

# LoginPage renders
# RegisterPage validation
# AuthContext state management
# localStorage persistence
# API integration
```

---

## 🔒 Seguridad (Consideraciones)

✅ **Implementado**:
- Hash bcrypt (10 rounds)
- JWT con firma
- CORS habilitado
- Validación de DTOs
- Contraseña mínimo 8 caracteres
- Email único (índice MongoDB)

⚠️ **TODO**:
- Rate limiting en endpoints
- HTTPS en producción
- Refresh tokens
- Password hashing más fuerte (argon2)
- 2FA (autenticación de dos factores)
- CSRF protection

---

## 📝 Notas de Desarrollo

### Enviroment Variables

Crear `.env` en backend:

```bash
# .env (Backend)
MONGO_URL=mongodb://localhost:27017/corvami
JWT_SECRET=corvami-ultra-secret-key
PORT=3000
NODE_ENV=development
```

Crear `.env.local` en frontend:

```bash
# .env.local (Frontend)
VITE_API_URL=http://localhost:3000
```

### Estructura de directorios

Asegurar que existan:

```
Backend/corvami-backend/src/auth/
├── entities/user.entity.ts
├── dto/
│   ├── login.dto.ts
│   └── register.dto.ts
├── auth.service.ts
├── auth.controller.ts
└── auth.module.ts
```

```
Frontend/corvami-frontend/src/
├── contexts/AuthContext.tsx
├── components/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── Header.tsx
├── App.tsx
└── main.tsx
```

### Git branches

Actualmente en rama: `login`

Cambios principales:
- Backend: añadido `/src/auth`
- Frontend: añadido contexto auth + rutas
- Dependencias: `@nestjs/jwt`, `@nestjs/config`, `bcrypt`, `react-router-dom`

---

## 🚀 Próximas funcionalidades

1. **Protected Routes** - Componente wrapper para rutas autenticadas
2. **Refresh Tokens** - Tokens corta vida + refresh token larga vida
3. **Password Reset** - Email con link de reset
4. **Email Verification** - Verificar email antes de activar cuenta
5. **OAuth** - Google, GitHub login
6. **2FA** - Autenticación de dos factores (SMS, authenticator)
7. **Admin Panel** - Dashboard para gestionar usuarios

---

## 📞 Soporte

Para dudas sobre implementación, revisar:
- Documentación de NestJS: https://docs.nestjs.com
- JWT: https://jwt.io
- React Router: https://reactrouter.com
- MongoDB TypeORM: https://typeorm.io

---

**Última actualización**: 18 de noviembre, 2025
**Versión**: 1.0 (Alpha)
**Estado**: Listo para testing
