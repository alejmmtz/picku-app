# PickU

Plataforma para conectar emprendimientos universitarios con consumidores dentro del campus.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node.js + Express + TypeScript
- Base de datos y auth: Supabase + PostgreSQL
- Mapas: Leaflet + CARTO
- Recomendaciones conversacionales: Groq

## Arquitectura actual

```text
picku-app/
|-- client/
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- config/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |   |-- auth/
|   |   |   |-- consumer/
|   |   |   |-- entrepreneur/
|   |   |   `-- role-selector/
|   |   |-- providers/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- types/
|   |   `-- utils/
|   |-- public/
|   `-- package.json
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- features/
|   |   |   |-- auth/
|   |   |   |-- chatbot/
|   |   |   |-- entrepreneurs/
|   |   |   |-- order/
|   |   |   `-- product/
|   |   |-- middlewares/
|   |   |-- shared/
|   |   |-- types/
|   |   `-- app.ts
|   `-- package.json
|-- package.json
`-- README.md
```

## Organización del backend

Cada feature sigue una separación por responsabilidades:

- `router`: define endpoints y middlewares
- `controller`: adapta request/response
- `service`: contiene la lógica de negocio
- `types` o `schema`: define contratos y validación

Esto se usa en módulos como:

- `auth`
- `entrepreneurs`
- `product`
- `order`
- `chatbot`

## Organización del frontend

El frontend está dividido por dominio y por capas:

- `pages/`: pantallas por flujo
- `components/common/`: componentes reutilizables
- `services/`: acceso a API
- `providers/`: estado compartido y dependencias globales
- `routes/`: router y protección de rutas
- `types/`: contratos de datos
- `utils/`: helpers

### Providers implementados

- `AxiosProvider`: expone la instancia central de Axios
- `CartProvider`: maneja el carrito del consumidor

## Funcionalidades implementadas

### Consumidor

- registro e inicio de sesión
- home con negocios y productos
- detalle de producto
- carrito y checkout
- creación de órdenes
- historial y detalle de órdenes
- flujo de orden activa
- perfil
- chatbot

### Entrepreneur

- registro e inicio de sesión
- onboarding del negocio
- home del negocio
- listado de órdenes
- detalle de orden y acciones por estado
- recibo de orden
- gestión de productos
- perfil
- apertura y cierre del negocio

## Seguridad y acceso

- autenticación con Supabase
- token Bearer enviado desde frontend
- protección de rutas privadas en frontend
- `authMiddleware` en backend para endpoints protegidos
- validación de ownership para gestión de productos y negocio del entrepreneur
- separación de permisos entre `consumer` y `entrepreneur`

## Variables de entorno

### Client

Crear `client/.env` con:

```env
VITE_API_URL=http://localhost:3015
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### Server

Crear `server/.env` con:

```env
PORT=3015
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=postgres

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
```

## Scripts

### Raíz

```bash
npm run dev
```

Levanta client y server al mismo tiempo.

### Frontend

```bash
cd client
npm run dev
npm run build
```

### Backend

```bash
cd server
npm run dev
npm run build
```

## Estado del proyecto

Actualmente el proyecto está enfocado en un prototipo funcional end-to-end con:

- autenticación
- onboarding
- catálogo de productos
- creación de órdenes
- gestión de órdenes para ambos roles
- protección de rutas y sesiones

## Nota

La documentación de este README describe la estructura real actual del repositorio y reemplaza versiones anteriores del scaffolding que ya no corresponden al código vigente.
