# Talent-IQ
Demo RPG para evaluación de habilidades blandas

# 🎮 Talent-IQ

Demo interactiva estilo RPG desarrollada con JavaScript y HTML5 Canvas enfocada en la evaluación de habilidades blandas dentro de un entorno laboral.

El proyecto simula situaciones cotidianas de oficina mediante diálogos interactivos con NPCs, permitiendo registrar decisiones del jugador relacionadas con empatía, liderazgo, trabajo en equipo, comunicación y responsabilidad.

---

# ✨ Características

- 🗺️ Sistema de mapas estilo RPG
- 👥 NPCs interactivos
- 💬 Diálogos dinámicos con decisiones
- 🎯 Escenarios laborales aleatorios
- 📊 Registro de respuestas mediante backend
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
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── game.js
│   │   ├── escenarios.js
│   │   └── audio.js
│   │
│   └── index.html
│
├── backend/
│   ├── server.js
│   └── respuestas.json
│
├── package.json
└── README.md
```

# 🎮 Cómo jugar
Movimiento

Utiliza las flechas del teclado:

⬆️ Arriba
⬇️ Abajo
⬅️ Izquierda
➡️ Derecha


**Interacción**

Presiona:

"E"

para:

hablar con NPCs
ingresar a otras salas
activar escenarios
🧩 Mecánica principal

Cada NPC presenta una situación distinta dentro del entorno laboral.

El jugador debe escoger entre múltiples respuestas, las cuales generan puntajes internos asociados a habilidades blandas como:

empatía
liderazgo
comunicación
responsabilidad
trabajo en equipo

Las respuestas son enviadas al backend mediante fetch() y almacenadas para futuras evaluaciones o análisis.
