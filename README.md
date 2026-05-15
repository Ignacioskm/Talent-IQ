# Talent-IQ
Demo RPG para evaluación de habilidades blandas con IA

# 🎮 Talent-IQ

Demo interactiva estilo RPG desarrollada con JavaScript y HTML5 Canvas enfocada en la evaluación de habilidades blandas dentro de un entorno laboral.

El proyecto simula situaciones cotidianas de oficina mediante diálogos interactivos con NPCs, permitiendo registrar decisiones del jugador relacionadas con empatía, liderazgo, trabajo en equipo, comunicación y responsabilidad.

**Nuevas características:**
- 🔐 Sistema de autenticación completo con JWT y bcrypt
- 🗄️ Persistencia de datos en PostgreSQL con Prisma ORM
- 🤖 Generación de reportes psicológicos con Gemini AI
- 📊 Panel de administración para visualizar todos los datos
- 🐳 Contenedorización con Docker y Docker Compose

---

# ✨ Características

- 🗺️ Sistema de mapas estilo RPG
- 👥 NPCs interactivos
- 💬 Diálogos dinámicos con decisiones
- 🎯 Escenarios laborales aleatorios
- 📊 Registro de respuestas en PostgreSQL
- 🤖 Análisis de habilidades blandas con IA
- 🔐 Login/Registro con autenticación JWT
- 👤 Panel de usuario para ver reportes personales
- 🛡️ Panel de administración
- 🎨 Estética pixel art
- 📷 Cámara que sigue al jugador
- 🚪 Transición entre escenarios/mapas
- ⌨️ Interacción mediante tecla `E`
- 🧠 Evaluación de habilidades blandas

---

# 🛠️ Tecnologías utilizadas

## Frontend
- HTML5
- CSS3
- JavaScript Vanilla
- HTML5 Canvas

## Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT (jsonwebtoken)
- bcrypt
- Google Gemini AI

## Infraestructura
- Docker
- Docker Compose

---

# 📂 Estructura del proyecto

```bash
talent-iq/
│
├── frontend/
│   ├── assets/
│   │   ├── characters/
│   │   ├── maps/
│   │   └── music/
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── login.css
│   │   ├── resultados.css
│   │   └── admin.css
│   │
│   ├── js/
│   │   ├── game.js
│   │   ├── escenarios.js
│   │   ├── audio.js
│   │   ├── login.js
│   │   ├── resultados.js
│   │   └── admin.js
│   │
│   ├── index.html
│   ├── login.html
│   ├── resultados.html
│   └── admin.html
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   └── geminiService.js
│   ├── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml
└── README.md
```

---

# 🚀 Configuración y Ejecución

## Requisitos previos
- Docker y Docker Compose instalados
- API Key de Google Gemini AI

## Pasos de configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Talent-IQ
```

2. **Configurar variables de entorno**
```bash
cd backend
cp .env.example .env
```

Editar el archivo `.env` con tus credenciales:
```env
DATABASE_URL="postgresql://talentiq:talentiq123@localhost:5432/talentiq?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
GEMINI_API_KEY="your-gemini-api-key"
```

3. **Iniciar los servicios con Docker Compose**
```bash
cd ..
docker-compose up --build
```

Esto iniciará:
- PostgreSQL en el puerto 5432
- Backend Node.js en el puerto 3000

4. **Ejecutar migraciones de Prisma**
```bash
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npx prisma generate
```

5. **Acceder a la aplicación**
- Abre `frontend/login.html` en tu navegador
- Registra un nuevo usuario o inicia sesión
- Para crear un usuario administrador, regístrate normalmente y luego manualmente cambia el rol en la base de datos a 'admin'

---

# 🎮 Cómo jugar

## Movimiento
Utiliza las flechas del teclado:
- ⬆️ Arriba
- ⬇️ Abajo
- ⬅️ Izquierda
- ➡️ Derecha

## Interacción
Presiona `E` para:
- Hablar con NPCs
- Ingresar a otras salas
- Activar escenarios

## Generación de Reportes
- Interactúa con al menos 3 NPCs diferentes
- El botón "Generar Reporte IA" se habilitará automáticamente
- Haz clic para generar un análisis psicológico de tus decisiones
- Ve a "Mis Resultados" para ver el reporte completo

---

# 🧩 Mecánica principal

Cada NPC presenta una situación distinta dentro del entorno laboral. El jugador debe escoger entre múltiples respuestas, las cuales generan puntajes internos asociados a habilidades blandas como:
- Empatía
- Liderazgo
- Comunicación
- Responsabilidad
- Trabajo en equipo

Las respuestas son enviadas al backend y persistidas en PostgreSQL. Al interactuar con 5 NPCs, el usuario puede generar un reporte narrativo mediante Gemini AI que analiza su perfil de habilidades blandas.

---

# 🔐 Sistema de Autenticación

- Registro de usuarios con encriptación de contraseñas (bcrypt)
- Login con tokens JWT
- Roles de usuario: `user` y `admin`
- Middleware de autenticación para proteger rutas

---

# 🤖 Servicio de IA

El sistema utiliza Google Gemini AI para generar reportes narrativos que incluyen:
- Análisis de fortalezas
- Áreas de desarrollo
- Patrones de comportamiento
- Recomendaciones específicas
- Potencial de liderazgo
- Conclusión ejecutiva

---

# 📊 Panel de Administración

Los usuarios con rol `admin` pueden acceder a:
- Lista de todos los usuarios registrados
- Estadísticas agregadas del sistema
- Todos los reportes generados
- Búsqueda y filtrado de reportes
