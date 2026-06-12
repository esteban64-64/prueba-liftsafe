import api from '../config/api';

export const getAllUsers = () => api.get('/usuarios/listado');