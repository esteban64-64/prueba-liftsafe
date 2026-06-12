import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar el ID del usuario por su correo
    api.get('/usuarios/listado')
      .then(res => {
        const currentUser = res.data.find(u => u.correo === user?.email);
        if (currentUser) {
          return api.get(`/usuarios/dashboard/cliente/${currentUser.id_usuario}`);
        }
        throw new Error('Usuario no encontrado');
      })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Mis Ascensores</Typography>
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marca</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Modelo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ciudad</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id_ascensor} hover>
                <TableCell>{row.id_ascensor}</TableCell>
                <TableCell>{row.codigo_interno}</TableCell>
                <TableCell>{row.marca}</TableCell>
                <TableCell>{row.modelo}</TableCell>
                <TableCell>{row.tipo_ascensor}</TableCell>
                <TableCell>{row.ciudad}</TableCell>
                <TableCell>{row.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}