window.escenarios = [

{
    titulo: "Sobrecarga laboral",
    texto: "Un compañero está atrasado y estresado con sus tareas.",
    opciones: [
        {
            texto: "Ofrecer ayuda",
            puntaje: { empatia: 3, trabajoEquipo: 2 }
        },
        {
            texto: "Sugerir que reorganice sus tareas",
            puntaje: { liderazgo: 1 }
        },
        {
            texto: "No intervenir",
            puntaje: {}
        },
        {
            texto: "Avisar al supervisor",
            puntaje: { responsabilidad: 2 }
        }
    ]
},

{
    titulo: "Conflicto en el equipo",
    texto: "Dos compañeros discuten frente al grupo.",
    opciones: [
        {
            texto: "Intentar mediar",
            puntaje: { liderazgo: 3 }
        },
        {
            texto: "Esperar a que se resuelva solo",
            puntaje: {}
        },
        {
            texto: "Escalar a RRHH",
            puntaje: { responsabilidad: 2 }
        },
        {
            texto: "Hablar con ambos por separado",
            puntaje: { empatia: 2, comunicacion: 2 }
        }
    ]
},

{
    titulo: "Error en sistema",
    texto: "Un sistema crítico presenta fallas durante el trabajo.",
    opciones: [
        {
            texto: "Reportar inmediatamente",
            puntaje: { responsabilidad: 3 }
        },
        {
            texto: "Intentar solucionarlo tú",
            puntaje: { autonomia: 2 }
        },
        {
            texto: "Esperar instrucciones",
            puntaje: {}
        },
        {
            texto: "Ignorar el problema por ahora",
            puntaje: { riesgo: 2 }
        }
    ]
},

{
    titulo: "Cliente insatisfecho",
    texto: "Un cliente expresa molestia por el servicio recibido.",
    opciones: [
        {
            texto: "Escuchar su reclamo",
            puntaje: { empatia: 3 }
        },
        {
            texto: "Derivarlo a soporte",
            puntaje: { procedimiento: 2 }
        },
        {
            texto: "Responder de forma breve",
            puntaje: {}
        },
        {
            texto: "Ofrecer compensación",
            puntaje: { resolucion: 2 }
        }
    ]
},

{
    titulo: "Decisión urgente",
    texto: "Debes elegir entre dos tareas con igual prioridad.",
    opciones: [
        {
            texto: "Priorizar la más crítica",
            puntaje: { analisis: 3 }
        },
        {
            texto: "Dividir el tiempo entre ambas",
            puntaje: { organizacion: 2 }
        },
        {
            texto: "Delegar una tarea",
            puntaje: { liderazgo: 2 }
        },
        {
            texto: "Esperar más información",
            puntaje: {}
        }
    ]
},

{
    titulo: "Nuevo integrante",
    texto: "Un nuevo miembro se une al equipo y parece perdido.",
    opciones: [
        {
            texto: "Guiarlo en sus tareas",
            puntaje: { empatia: 3 }
        },
        {
            texto: "Dejar que aprenda solo",
            puntaje: {}
        },
        {
            texto: "Asignarle tareas simples",
            puntaje: { liderazgo: 2 }
        },
        {
            texto: "Informar al líder del equipo",
            puntaje: { responsabilidad: 1 }
        }
    ]
},

{
    titulo: "Reunión imprevista",
    texto: "Te llaman a una reunión sin previo aviso.",
    opciones: [
        {
            texto: "Asistir inmediatamente",
            puntaje: { responsabilidad: 2 }
        },
        {
            texto: "Pedir reprogramación",
            puntaje: {}
        },
        {
            texto: "Asistir parcialmente",
            puntaje: { organizacion: 1 }
        },
        {
            texto: "Ignorar la reunión",
            puntaje: { riesgo: 2 }
        }
    ]
},

{
    titulo: "Carga de trabajo extra",
    texto: "Te asignan tareas adicionales con poco tiempo.",
    opciones: [
        {
            texto: "Aceptar y reorganizarte",
            puntaje: { adaptabilidad: 3 }
        },
        {
            texto: "Rechazar la carga extra",
            puntaje: {}
        },
        {
            texto: "Pedir ayuda al equipo",
            puntaje: { trabajoEquipo: 2 }
        },
        {
            texto: "Priorizar solo lo urgente",
            puntaje: { analisis: 2 }
        }
    ]
},

{
    titulo: "Fallo de comunicación",
    texto: "Un mensaje importante no llegó a todos.",
    opciones: [
        {
            texto: "Reenviar la información",
            puntaje: { responsabilidad: 2 }
        },
        {
            texto: "Informar al equipo",
            puntaje: { comunicacion: 3 }
        },
        {
            texto: "Esperar confirmación",
            puntaje: {}
        },
        {
            texto: "Asumir que ya lo vieron",
            puntaje: { riesgo: 2 }
        }
    ]
},

{
    titulo: "Cambio de prioridades",
    texto: "El proyecto cambia de dirección de forma inesperada.",
    opciones: [
        {
            texto: "Adaptarte al cambio",
            puntaje: { adaptabilidad: 3 }
        },
        {
            texto: "Cuestionar la decisión",
            puntaje: { pensamientoCritico: 2 }
        },
        {
            texto: "Continuar con lo anterior",
            puntaje: {}
        },
        {
            texto: "Pedir aclaración al líder",
            puntaje: { comunicacion: 2 }
        }
    ]
}

];