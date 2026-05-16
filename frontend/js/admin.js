const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user || user.rol !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    document.getElementById('user-name').textContent = user.nombre;
    
    const logoutBtn = document.getElementById('logout-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const loadingDiv = document.getElementById('loading');
    const usuariosTableContainer = document.getElementById('usuarios-table-container');
    const reportesTableContainer = document.getElementById('reportes-table-container');
    const reporteModal = document.getElementById('reporte-modal');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.querySelector('.close-btn');
    const searchReportesInput = document.getElementById('search-reportes');
    
    let allReportes = [];
    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
    
    closeBtn.addEventListener('click', () => {
        reporteModal.classList.add('hidden');
    });
    
    reporteModal.addEventListener('click', (e) => {
        if (e.target === reporteModal) {
            reporteModal.classList.add('hidden');
        }
    });
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            tabContents.forEach(c => c.classList.remove('active'));
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
    
    searchReportesInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredReportes = allReportes.filter(reporte => 
            reporte.usuario.nombre.toLowerCase().includes(searchTerm) ||
            reporte.usuario.email.toLowerCase().includes(searchTerm)
        );
        mostrarReportesTable(filteredReportes);
    });
    
    async function cargarDatos() {
        try {
            const [usuariosResponse, reportesResponse] = await Promise.all([
                fetch(`${API_URL}/api/usuarios/todos`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/api/reportes/todos`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            
            if (usuariosResponse.ok && reportesResponse.ok) {
                const usuarios = await usuariosResponse.json();
                allReportes = await reportesResponse.json();
                
                loadingDiv.classList.add('hidden');
                
                mostrarStats(usuarios, allReportes);
                mostrarUsuariosTable(usuarios);
                mostrarReportesTable(allReportes);
            } else {
                console.error('Error al cargar datos');
                loadingDiv.textContent = 'Error al cargar datos';
            }
        } catch (error) {
            console.error('Error:', error);
            loadingDiv.textContent = 'Error de conexión';
        }
    }
    
    function mostrarStats(usuarios, reportes) {
        const totalUsuarios = usuarios.length;
        const totalDecisiones = usuarios.reduce((sum, u) => sum + u._count.decisiones, 0);
        const totalReportes = reportes.length;
        
        document.getElementById('total-usuarios').textContent = totalUsuarios;
        document.getElementById('total-decisiones').textContent = totalDecisiones;
        document.getElementById('total-reportes').textContent = totalReportes;
    }
    
    function mostrarUsuariosTable(usuarios) {
        usuariosTableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Fecha de Evaluación</th>
                        <th>N° de Decisiones</th>
                        <th>Estado del Reporte</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuarios.map(usuario => {
                        const tieneReporte = usuario._count.reportes > 0;
                        const estadoReporte = tieneReporte ? 'Generado' : 'Pendiente';
                        const estadoClass = tieneReporte ? 'badge-success' : 'badge-warning';

                        return `
                        <tr>
                            <td>${usuario.nombre}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario._count.decisiones > 0 ? new Date(usuario.fechaCreacion).toLocaleDateString('es-ES') : '-'}</td>
                            <td>${usuario._count.decisiones}</td>
                            <td><span class="badge ${estadoClass}">${estadoReporte}</span></td>
                            <td>
                                ${tieneReporte ? `<button class="action-btn view-btn" onclick="verReporteUsuario(${usuario.id})">Ver Informe</button>` : '<span class="text-muted">Sin informe</span>'}
                            </td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    
    function mostrarReportesTable(reportes) {
        reportesTableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Fecha Generación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportes.map(reporte => `
                        <tr>
                            <td>${reporte.id}</td>
                            <td>${reporte.usuario.nombre}</td>
                            <td>${reporte.usuario.email}</td>
                            <td>${new Date(reporte.fechaGeneracion).toLocaleString('es-ES')}</td>
                            <td>
                                <button class="action-btn view-btn" onclick="verReporte(${reporte.id})">Ver</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    window.verReporte = async (reporteId) => {
        try {
            const response = await fetch(`${API_URL}/api/reportes/${reporteId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const reporte = await response.json();
                modalContent.innerHTML = formatearReporte(reporte.contenidoNarrativo);
                reporteModal.classList.remove('hidden');
            } else {
                alert('Error al cargar el reporte');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    };

    window.verReporteUsuario = async (usuarioId) => {
        try {
            const response = await fetch(`${API_URL}/api/reportes/todos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const reportes = await response.json();
                const reporteUsuario = reportes.find(r => r.usuarioId === usuarioId);

                if (reporteUsuario) {
                    modalContent.innerHTML = formatearReporte(reporteUsuario.contenidoNarrativo);
                    reporteModal.classList.remove('hidden');
                } else {
                    alert('No se encontró reporte para este usuario');
                }
            } else {
                alert('Error al cargar los reportes');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    };
    
    function formatearReporte(contenido) {
        let html = contenido;
        
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        html = html.split('\n\n').map(p => {
            if (!p.startsWith('<')) {
                return `<p>${p}</p>`;
            }
            return p;
        }).join('\n');
        
        return html;
    }
    
    cargarDatos();
});
