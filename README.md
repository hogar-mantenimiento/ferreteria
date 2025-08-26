# Ecomer-App - Sistema de E-commerce para Ferretería

## Descripción

Ecomer-App es una aplicación completa de e-commerce desarrollada con Next.js 14.2.5, diseñada específicamente para ferreterías. Incluye un panel de administración completo, sistema de autenticación, gestión de productos, carrito de compras e integración con MercadoPago.

## Características Principales

### 🎨 Personalización
- Panel de configuración para personalizar logo, colores y nombre de la tienda
- Tema oscuro/claro con next-themes
- Diseño responsive con Tailwind CSS

### 🔐 Autenticación y Autorización
- Sistema de login con JWT
- Roles de usuario (admin/user)
- Middleware de protección de rutas
- Cookies HTTP-only para seguridad

### 📦 Gestión de Productos
- CRUD completo de productos
- Categorías y filtros
- Subida de imágenes
- Control de stock
- Productos destacados

### 🛒 Carrito de Compras
- Estado global con Zustand
- Persistencia en localStorage
- Actualización de cantidades
- Validación de stock

### 💳 Pagos
- Integración con MercadoPago
- Procesamiento seguro de pagos
- Páginas de éxito y error
- Webhooks para confirmación

## Tecnologías Utilizadas

- **Frontend**: Next.js 14.2.5, React 18, TypeScript
- **Styling**: Tailwind CSS, next-themes
- **Estado**: Zustand para carrito, Context API para auth y config
- **Formularios**: React Hook Form + Zod
- **Pagos**: MercadoPago SDK
- **Notificaciones**: React Hot Toast
- **Iconos**: Lucide React

## Instalación

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn

### Configuración

1. Clona el repositorio:
```bash
git clone <repository-url>
cd ecomer-app
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura las variables de entorno:
```bash
cp .env.local.example .env.local
```

4. Edita `.env.local` con tus credenciales:
```env
# MercadoPago Configuration
NEXT_PUBLIC_MERCADOPAGO_KEY=TEST-your-public-key-here
MERCADOPAGO_ACCESS_TOKEN=TEST-your-access-token-here

# JWT Secret for Authentication
NEXTAUTH_SECRET=your-super-secret-jwt-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Obtener Credenciales de MercadoPago

1. Crea una cuenta en [MercadoPago Developers](https://developers.mercadopago.com/)
2. Ve a "Tus integraciones" > "Crear aplicación"
3. Selecciona "Pagos online" como producto
4. Copia las credenciales de prueba:
   - `Public Key` → `NEXT_PUBLIC_MERCADOPAGO_KEY`
   - `Access Token` → `MERCADOPAGO_ACCESS_TOKEN`

## Uso

### Desarrollo
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

### Construcción
```bash
npm run build
# o
yarn build
```

### Cuentas de Prueba

- **Admin**: admin@test.com / admin123
- **Usuario**: user@test.com / user123

## Estructura del Proyecto

```
ecomer-app/
├── app/                    # App Router (Next.js 14)
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── cart/              # Carrito de compras
│   ├── config/            # Configuración de la tienda
│   ├── login/             # Autenticación
│   └── product/           # Páginas de productos
├── components/            # Componentes reutilizables
├── contexts/              # Context providers
├── hooks/                 # Custom hooks
├── types/                 # Definiciones de TypeScript
├── config/                # Configuración de la aplicación
└── public/                # Assets estáticos
```

## Funcionalidades Detalladas

### Panel de Administración
- Dashboard con estadísticas
- Gestión completa de productos
- Configuración de la tienda
- Control de usuarios y pedidos

### Gestión de Productos
- Crear, editar y eliminar productos
- Subida múltiple de imágenes
- Categorización y filtros
- Control de stock en tiempo real

### Carrito y Checkout
- Agregar/quitar productos
- Actualizar cantidades
- Validación de stock
- Proceso de pago con MercadoPago

### Personalización
- Cambiar logo de la tienda
- Personalizar colores (primario, secundario, acento)
- Modificar nombre de la tienda
- Tema oscuro/claro

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/[id]` - Obtener producto
- `POST /api/admin/products` - Crear producto (admin)
- `PUT /api/admin/products/[id]` - Actualizar producto (admin)
- `DELETE /api/admin/products/[id]` - Eliminar producto (admin)

### Configuración
- `GET /api/config` - Obtener configuración
- `POST /api/config` - Actualizar configuración (admin)

### Pagos
- `POST /api/checkout` - Crear preferencia de pago
- `GET /api/payment-status` - Verificar estado de pago

## Seguridad

- Autenticación JWT con cookies HTTP-only
- Validación de roles en middleware
- Validación de formularios con Zod
- Sanitización de datos de entrada
- Protección CSRF

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para soporte y consultas:
- Email: soporte@ecomer-app.com
- Issues: [GitHub Issues](https://github.com/your-username/ecomer-app/issues)

---

Desarrollado con ❤️ por [Tu Nombre]