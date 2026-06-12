import api from '../config/api';

export const getAdminStats = () => api.get('/usuarios/dashboard/admin');
export const getResumenInspecciones = () => api.get('/vistas/resumen-inspecciones');
export const getInspeccionesPorEstado = (estado) => api.get(`/vistas/inspecciones-por-estado/${estado}`);
export const getPerfilUsuario = (userId) => api.get(`/usuarios/perfil/${userId}`);