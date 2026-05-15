console.log("GAME JS CARGADO");

const API_URL = 'http://localhost:3000';

// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (!token || !user) {
    window.location.href = 'login.html';
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 720;

const dialogo = document.getElementById("dialogo");
const titulo = document.getElementById("titulo");
const texto = document.getElementById("texto");
const opcionesDiv = document.getElementById("opciones");
const feedback = document.getElementById("mensaje-feedback");

const mensajeInteraccion =
document.getElementById(
    "mensaje-interaccion"
);

// UI Elements
const userNameSpan = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const npcCountSpan = document.getElementById('npc-count');
const generarReporteBtn = document.getElementById('generar-reporte-btn');
const resultadosBtn = document.getElementById('resultados-btn');
const adminBtn = document.getElementById('admin-btn');

// Set user info
userNameSpan.textContent = user.nombre;
if (user.rol === 'admin') {
    adminBtn.classList.remove('hidden');
}

// NPC counter
let npcsInteractuados = 0;
const npcsInteractuadosSet = new Set();

const mapas = {

    oficina: new Image(),
    sala: new Image()
};

mapas.oficina.src =
"assets/maps/oficina.png";

mapas.sala.src =
"assets/maps/sala.png";

let mapaActual = "oficina";

const MAP_WIDTH = 1800;
const MAP_HEIGHT = 1200;

const playerImg = new Image();

playerImg.src =
"assets/characters/hombre.png";

const npcImg = new Image();

npcImg.src =
"assets/characters/mujer.png";

const player = {

    x: 300,
    y: 500,

    width: 44,
    height: 74,

    speed: 2
};


const camera = {

    x: 0,
    y: 0
};

const npcsPorMapa = {

    oficina: [

        {
            nombre: "Valentina",

            x: 500,
            y: 450,

            width: 44,
            height: 74,

            escenario: 0
        },

        {
            nombre: "Camila",

            x: 900,
            y: 600,

            width: 44,
            height: 74,

            escenario: 1
        }
    ],

    sala: [

        {
            nombre: "Fernanda",

            x: 700,
            y: 500,

            width: 44,
            height: 74,

            escenario: 2
        },

        {
            nombre: "Daniela",

            x: 1000,
            y: 450,

            width: 44,
            height: 74,

            escenario: 3
        }
    ]
};

const puertas = {

    oficina: {

        x: 820,
        y: 40,

        width: 120,
        height: 120,

        destino: "sala"
    },

    sala: {

        x: 820,
        y: 900,

        width: 120,
        height: 120,

        destino: "oficina"
    }
};

const keys = {};

let npcCercana = null;
let tiempoInicioInteraccion = null;

const mensajesFeedback = [

    "Acción registrada.",
    "Respuesta guardada.",
    "Interacción completada.",
    "Evento actualizado.",
    "Proceso realizado."
];

const npcNombresContainer =
document.getElementById(
    "npc-nombres"
);


function colision(a, b) {

    return (

        a.x < b.x + b.width &&
        a.x + a.width > b.x &&

        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function mostrarMensajeInteraccion(
    mensaje
) {

    mensajeInteraccion.innerText =
    mensaje;

    mensajeInteraccion.style.display =
    "block";
}

function ocultarMensajeInteraccion() {

    mensajeInteraccion.style.display =
    "none";
}

document.addEventListener("keydown", (e) => {

    keys[e.key] = true;

    if (e.key.toLowerCase() === "e") {

        const puerta =
        puertas[mapaActual];

        if (colision(player, puerta)) {

            mapaActual =
            puerta.destino;

            player.x = 600;
            player.y = 700;

            return;
        }


        if (!npcCercana) return;

        if (!window.escenarios) return;

        if (
            !dialogo.classList.contains(
                "hidden"
            )
        ) return;

        const escenario =
            window.escenarios[
                npcCercana.escenario
            ];

        mostrarEscenario(
            escenario,
            npcCercana.nombre
        );
        tiempoInicioInteraccion = Date.now();
    }
});

document.addEventListener("keyup", (e) => {

    keys[e.key] = false;
});

function mover() {

    if (
        !dialogo.classList.contains(
            "hidden"
        )
    ) return;



    if (keys["ArrowUp"]) {

        player.y -= player.speed;
    }

    if (keys["ArrowDown"]) {

        player.y += player.speed;
    }

    if (keys["ArrowLeft"]) {

        player.x -= player.speed;
    }

    if (keys["ArrowRight"]) {

        player.x += player.speed;
    }


    if (player.x < 0) {

        player.x = 0;
    }

    if (player.y < 0) {

        player.y = 0;
    }

    if (
        player.x + player.width >
        MAP_WIDTH
    ) {

        player.x =
        MAP_WIDTH - player.width;
    }

    if (
        player.y + player.height >
        MAP_HEIGHT
    ) {

        player.y =
        MAP_HEIGHT - player.height;
    }
}

function actualizarCamara() {

    camera.x =
        player.x - canvas.width / 2;

    camera.y =
        player.y - canvas.height / 2;


    if (camera.x < 0) {

        camera.x = 0;
    }

    if (camera.y < 0) {

        camera.y = 0;
    }

    if (
        camera.x >
        MAP_WIDTH - canvas.width
    ) {

        camera.x =
        MAP_WIDTH - canvas.width;
    }

    if (
        camera.y >
        MAP_HEIGHT - canvas.height
    ) {

        camera.y =
        MAP_HEIGHT - canvas.height;
    }
}

function renderNPCNombres() {

    npcNombresContainer.innerHTML = "";

    const rect =
    canvas.getBoundingClientRect();

    npcsPorMapa[mapaActual].forEach(
        (npc) => {

        const nombre =
        document.createElement("div");

        nombre.className =
        "npc-nombre";

        nombre.innerText =
        npc.nombre;

        const screenX =
            rect.left +
            (npc.x - camera.x);

        const screenY =
            rect.top +
            (npc.y - camera.y);

        nombre.style.left =
        `${screenX - 10}px`;

        nombre.style.top =
        `${screenY - 35}px`;

        npcNombresContainer.appendChild(
            nombre
        );
    });
}

function dibujar() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const mapa =
    mapas[mapaActual];

    if (
        mapa.complete &&
        mapa.naturalWidth !== 0
    ) {

        ctx.drawImage(

            mapa,

            -camera.x,
            -camera.y,

            MAP_WIDTH,
            MAP_HEIGHT
        );

    } else {

        ctx.fillStyle = "#2d2d2d";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }



    npcsPorMapa[mapaActual].forEach(
        (npc) => {

        if (
            npcImg.complete &&
            npcImg.naturalWidth !== 0
        ) {

            ctx.drawImage(

                npcImg,

                npc.x - camera.x,
                npc.y - camera.y,

                npc.width,
                npc.height
            );
        }

    });



    if (
        playerImg.complete &&
        playerImg.naturalWidth !== 0
    ) {

        ctx.drawImage(

            playerImg,

            player.x - camera.x,
            player.y - camera.y,

            player.width,
            player.height
        );
    }
}

function checkNPC() {

    ocultarMensajeInteraccion();

    npcCercana = null;

    if (
        !dialogo.classList.contains(
            "hidden"
        )
    ) {
        return;
    }

    npcsPorMapa[mapaActual].forEach(
        (npc) => {

        if (colision(player, npc)) {

            npcCercana = npc;

            mostrarMensajeInteraccion(
                "🗨 Presiona E para hablar"
            );
        }
    });

    const puerta =
    puertas[mapaActual];

    if (colision(player, puerta)) {

        mostrarMensajeInteraccion(
            "🚪 Presiona E para entrar"
        );
    }
}

function mostrarEscenario(
    escenario,
    nombreNPC
) {

    dialogo.classList.remove(
        "hidden"
    );

    ocultarMensajeInteraccion();

    titulo.innerText =
    nombreNPC;

    texto.innerText =
    escenario.texto;

    opcionesDiv.innerHTML = "";

    escenario.opciones.forEach(
        (opcion) => {

        const btn =
        document.createElement(
            "button"
        );

        btn.innerText =
        opcion.texto;

        const npcNombre = nombreNPC;

        btn.onclick =
        async () => {

            dialogo.classList.add(
                "hidden"
            );

            const mensaje =
                mensajesFeedback[
                    Math.floor(
                        Math.random() *
                        mensajesFeedback.length
                    )
                ];

            feedback.innerText =
            mensaje;

            feedback.style.display =
            "block";

            setTimeout(() => {

                feedback.style.display =
                "none";

            }, 1500);

            try {
                const tiempoRespuesta = Date.now() - tiempoInicioInteraccion;
                
                console.log('Enviando decisión:', {
                    npcId: npcNombre,
                    opcionElegida: opcion.texto,
                    puntajes: opcion.puntaje,
                    tiempoRespuesta
                });
                
                const response = await fetch(

                    `${API_URL}/guardar`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                            "application/json",
                            "Authorization": `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            npcId: npcNombre,
                            opcionElegida: opcion.texto,
                            puntajes: opcion.puntaje,
                            tiempoRespuesta
                        })
                    }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Decisión guardada:', data);
                } else {
                    console.error('Error al guardar decisión:', response.status);
                }
                
            } catch(error) {
                console.error('Error en fetch:', error);
            }
            
            if (!npcsInteractuadosSet.has(npcNombre)) {
                npcsInteractuadosSet.add(npcNombre);
                npcsInteractuados++;
                npcCountSpan.textContent = npcsInteractuados;
                console.log('NPCs interactuados:', npcsInteractuados);
                
                if (npcsInteractuados >= 3) {
                    generarReporteBtn.disabled = false;
                }
            }
        };

        opcionesDiv.appendChild(
            btn
        );
    });
}

function gameLoop() {

    mover();

    actualizarCamara();

    dibujar();

    renderNPCNombres();

    checkNPC();

    requestAnimationFrame(
        gameLoop
    );
}

// Event listeners for UI buttons
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

resultadosBtn.addEventListener('click', () => {
    window.location.href = 'resultados.html';
});

adminBtn.addEventListener('click', () => {
    window.location.href = 'admin.html';
});

generarReporteBtn.addEventListener('click', async () => {
    try {
        generarReporteBtn.disabled = true;
        generarReporteBtn.textContent = 'Generando...';
        
        const response = await fetch(`${API_URL}/api/reportes/generar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Reporte generado exitosamente. Ve a "Mis Resultados" para verlo.');
            window.location.href = 'resultados.html';
        } else {
            alert(data.error || 'Error al generar reporte');
            generarReporteBtn.disabled = false;
            generarReporteBtn.textContent = 'Generar Reporte IA';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
        generarReporteBtn.disabled = false;
        generarReporteBtn.textContent = 'Generar Reporte IA';
    }
});

gameLoop();