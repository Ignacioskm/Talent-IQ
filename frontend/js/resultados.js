const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('user-name').textContent = user.nombre;
    
    const logoutBtn = document.getElementById('logout-btn');
    const volverJuegoBtn = document.getElementById('volver-juego-btn');
    const loadingDiv = document.getElementById('loading');
    const reportesContainer = document.getElementById('reportes-container');
    const noReportesDiv = document.getElementById('no-reportes');
    const reportesList = document.getElementById('reportes-list');
    const reporteModal = document.getElementById('reporte-modal');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.querySelector('.close-btn');
    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
    
    volverJuegoBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    closeBtn.addEventListener('click', () => {
        reporteModal.classList.add('hidden');
    });
    
    reporteModal.addEventListener('click', (e) => {
        if (e.target === reporteModal) {
            reporteModal.classList.add('hidden');
        }
    });
    
    async function cargarReportes() {
        try {
            const response = await fetch(`${API_URL}/api/reportes/mis-reportes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const reportes = await response.json();
                
                loadingDiv.classList.add('hidden');
                
                if (reportes.length === 0) {
                    noReportesDiv.classList.remove('hidden');
                } else {
                    reportesContainer.classList.remove('hidden');
                    mostrarReportes(reportes);
                }
            } else {
                console.error('Error al cargar reportes');
                loadingDiv.textContent = 'Error al cargar reportes';
            }
        } catch (error) {
            console.error('Error:', error);
            loadingDiv.textContent = 'Error de conexión';
        }
    }
    
    function mostrarReportes(reportes) {
        reportesList.innerHTML = '';
        
        reportes.forEach(reporte => {
            const card = document.createElement('div');
            card.className = 'reporte-card';
            
            const fecha = new Date(reporte.fechaGeneracion).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const preview = reporte.contenidoNarrativo.substring(0, 200) + '...';
            
            card.innerHTML = `
                <h3>Reporte #${reporte.id}</h3>
                <div class="fecha">${fecha}</div>
                <div class="preview">${preview}</div>
                <div class="ver-mas">Ver reporte completo →</div>
            `;
            
            card.addEventListener('click', () => {
                mostrarReporteCompleto(reporte);
            });
            
            reportesList.appendChild(card);
        });
    }
    
    function mostrarReporteCompleto(reporte) {
        modalContent.innerHTML = formatearReporte(reporte.contenidoNarrativo);
        reporteModal.classList.remove('hidden');
    }
    
    function formatearReporte(contenido) {
        // Convertir el texto plano a formato HTML básico
        let html = contenido;
        
        // Convertir **negrita** a <strong>
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convertir encabezados con #
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        
        // Convertir listas con -
        html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        
        // Convertir párrafos
        html = html.split('\n\n').map(p => {
            if (!p.startsWith('<')) {
                return `<p>${p}</p>`;
            }
            return p;
        }).join('\n');
        
        return html;
    }
    
    cargarReportes();
});
