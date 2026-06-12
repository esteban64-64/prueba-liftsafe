import api from '../config/api';

export const getMyProfile = () => api.get('/auth/me');