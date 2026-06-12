import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Chip } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

export default function InspectorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/usuarios/listado')
      .then(res => {
        const currentUser = res.data.find(u => u.correo === user?.email);
        if (currentUser) {
          return api.get(`/usuarios/dashboard/inspector/${currentUser.id_usuario}`);
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
      <Typography variant="h4" sx={{ mb: 3 }}>Mis Inspecciones Asignadas</Typography>
      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ascensor ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Inicio</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Fin</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Observaciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id_inspeccion} hover>
                <TableCell>{row.id_inspeccion}</TableCell>
                <TableCell>{row.id_ascensor}</TableCell>
                <TableCell>{row.fecha_inicio ? new Date(row.fecha_inicio).toLocaleString() : '-'}</TableCell>
                <TableCell>{row.fecha_fin ? new Date(row.fecha_fin).toLocaleString() : '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.estado} 
                    size="small" 
                    color={row.estado === 'Finalizada' ? 'success' : row.estado === 'Aprobada' ? 'primary' : 'default'} 
                  />
                </TableCell>
                <TableCell>{row.observaciones_generales || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}