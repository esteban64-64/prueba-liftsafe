import api from '../config/api';

export const getInspeccionesPorEstado = (estado) => api.get(`/vistas/inspecciones-por-estado/${estado}`);