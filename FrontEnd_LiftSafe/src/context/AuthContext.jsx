import { createContext, useContext, useState } from 'react';
import api from '../config/api';
import { canDo } from '../config/roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('liftsafe_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      correo: email,
      contrasena: password,
    });
    
    const { access_token, rol, nombre } = response.data;
    
    const userData = {
      name: nombre,
      email: email,
      role: rol,
      token: access_token,
    };
    
    localStorage.setItem('liftsafe_token', access_token);  // ← Verifica esto
    localStorage.setItem('liftsafe_user', JSON.stringify(userData));
    setUser(userData);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

  const register = async (formData) => {
    try {
      // Mapear roles a IDs
      const roleIds = {
        'Administrador': 1,
        'Director Técnico': 2,
        'Coordinador': 3,
        'Inspector': 4,
        'Asesor': 5,
        'Cliente': 6,
      };

      const response = await api.post('/auth/register', {
        nombre_completo: formData.name,
        correo: formData.email,
        contrasena: formData.password,
        documento_identidad: formData.document,
        id_rol: roleIds[formData.role] || 6,
      });

      return { success: true, message: 'Usuario registrado exitosamente' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Error al registrar' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('liftsafe_token');
    localStorage.removeItem('liftsafe_user');
    setUser(null);
  };

  const hasAction = (action) => canDo(user?.role, action);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, hasAction }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);