require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authMiddleware, adminMiddleware } = require('./middleware/auth');
const { generarReporteIA } = require('./services/geminiService');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.send("Backend Talent-IQ funcionando");
});

// Auth endpoints
app.post("/api/auth/register", async (req, res) => {
    try {
        const { nombre, email, password, rol = 'user' } = req.body;
        
        const existingUser = await prisma.usuario.findUnique({
            where: { email }
        });
        
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.usuario.create({
            data: {
                nombre,
                email,
                password: hashedPassword,
                rol
            }
        });
        
        const token = jwt.sign(
            { userId: user.id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await prisma.usuario.findUnique({
            where: { email }
        });
        
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        const token = jwt.sign(
            { userId: user.id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
        const user = await prisma.usuario.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
                fechaCreacion: true
            }
        });
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// Endpoint modificado para guardar decisiones
app.post("/guardar", authMiddleware, async (req, res) => {
    try {
        const { npcId, opcionElegida, puntajes, tiempoRespuesta } = req.body;
        
        const decision = await prisma.decisionLog.create({
            data: {
                usuarioId: req.userId,
                npcId,
                opcionElegida,
                puntajesJson: puntajes,
                tiempoRespuesta: tiempoRespuesta || 0
            }
        });
        
        console.log("Decisión guardada:", decision);
        
        res.json({
            mensaje: "Datos guardados exitosamente",
            decisionId: decision.id
        });
    } catch (error) {
        console.error('Error al guardar decisión:', error);
        res.status(500).json({ error: 'Error al guardar decisión' });
    }
});

// Endpoint para obtener el conteo de NPCs interactuados
app.get("/api/decisiones/conteo", authMiddleware, async (req, res) => {
    try {
        const conteo = await prisma.decisionLog.count({
            where: { usuarioId: req.userId }
        });
        
        res.json({ conteo });
    } catch (error) {
        console.error('Error al obtener conteo:', error);
        res.status(500).json({ error: 'Error al obtener conteo' });
    }
});

// Endpoint para generar reporte IA
app.post("/api/reportes/generar", authMiddleware, async (req, res) => {
    try {
        const conteo = await prisma.decisionLog.count({
            where: { usuarioId: req.userId }
        });
        
        if (conteo < 5) {
            return res.status(400).json({ 
                error: 'Debes interactuar con al menos 5 NPCs antes de generar un reporte',
                conteoActual: conteo,
                requerido: 5
            });
        }
        
        const decisiones = await prisma.decisionLog.findMany({
            where: { usuarioId: req.userId },
            orderBy: { fecha: 'asc' }
        });
        
        const reporte = await generarReporteIA(req.userId, decisiones);
        
        res.json({
            mensaje: "Reporte generado exitosamente",
            reporte
        });
    } catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({ error: 'Error al generar reporte' });
    }
});

// Endpoint para obtener reportes del usuario actual
app.get("/api/reportes/mis-reportes", authMiddleware, async (req, res) => {
    try {
        const reportes = await prisma.reporteIA.findMany({
            where: { usuarioId: req.userId },
            orderBy: { fechaGeneracion: 'desc' }
        });
        
        res.json(reportes);
    } catch (error) {
        console.error('Error al obtener reportes:', error);
        res.status(500).json({ error: 'Error al obtener reportes' });
    }
});

// Endpoint para obtener un reporte específico
app.get("/api/reportes/:id", authMiddleware, async (req, res) => {
    try {
        const reporte = await prisma.reporteIA.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        
        if (!reporte) {
            return res.status(404).json({ error: 'Reporte no encontrado' });
        }
        
        // Verificar que el reporte pertenezca al usuario o sea admin
        if (reporte.usuarioId !== req.userId && req.userRol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        
        res.json(reporte);
    } catch (error) {
        console.error('Error al obtener reporte:', error);
        res.status(500).json({ error: 'Error al obtener reporte' });
    }
});

// Endpoint admin para obtener todos los reportes
app.get("/api/reportes/todos", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const reportes = await prisma.reporteIA.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            },
            orderBy: { fechaGeneracion: 'desc' }
        });
        
        res.json(reportes);
    } catch (error) {
        console.error('Error al obtener todos los reportes:', error);
        res.status(500).json({ error: 'Error al obtener reportes' });
    }
});

// Endpoint admin para obtener todos los usuarios
app.get("/api/usuarios/todos", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
                fechaCreacion: true,
                _count: {
                    select: {
                        decisiones: true,
                        reportes: true
                    }
                }
            },
            orderBy: { fechaCreacion: 'desc' }
        });
        
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT}`);
});