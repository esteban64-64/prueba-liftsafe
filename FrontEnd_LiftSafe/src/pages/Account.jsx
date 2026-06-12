import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, Divider, CircularProgress, Alert } from '@mui/material';
import { Person, Email, Phone, Badge, CalendarToday, Security } from '@mui/icons-material';
import { getMyProfile } from '../services/profileService';

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyProfile()
      .then(res => {
        console.log('Perfil:', res.data);
        setUser(res.data);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.response?.data?.detail || 'Error al cargar perfil');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  if (!user) return <Alert severity="warning" sx={{ m: 2 }}>No se encontró el usuario</Alert>;

  const infoItems = [
    { icon: <Person />, label: 'Nombre', value: user.nombre_completo },
    { icon: <Email />, label: 'Correo', value: user.correo },
    { icon: <Security />, label: 'Rol', value: user.rol },
    { icon: <Phone />, label: 'Teléfono', value: user.telefono || 'No registrado' },
    { icon: <Badge />, label: 'Documento', value: user.documento_identidad || 'No registrado' },
    { icon: <CalendarToday />, label: 'Fecha de registro', value: new Date(user.fecha_registro).toLocaleDateString() },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Mi Cuenta</Typography>
      
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
              {user.nombre_completo.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5">{user.nombre_completo}</Typography>
              <Chip label={user.rol} color="primary" size="small" sx={{ mt: 1 }} />
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {infoItems.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                    <Typography variant="body1">{item.value}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Estado: <Chip label={user.estado} color={user.estado === 'activo' ? 'success' : 'error'} size="small" />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {user.id_usuario}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}