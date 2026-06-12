import api from '../config/api';

export const getTendencia = () => api.get('/dashboard/graficas/tendencia');
export const getEstados = () => api.get('/dashboard/graficas/estados');
export const getEdificios = () => api.get('/dashboard/graficas/edificios');