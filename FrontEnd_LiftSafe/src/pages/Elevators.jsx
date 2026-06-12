import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Alert, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

export default function Elevators() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const endpoint = user?.role === 'Inspector' 
      ? '/ascensores/mis-ascensores' 
      : '/ascensores/listado';
    
    api.get(endpoint)
      .then(res => {
        console.log('Ascensores:', res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.response?.data?.detail || 'Error al cargar ascensores');
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  const titulo = user?.role === 'Inspector' 
    ? 'Ascensores que he inspeccionado' 
    : 'Ascensores Registrados';

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>{titulo}</Typography>
      {data.length === 0 ? (
        <Alert severity="info">
          {user?.role === 'Inspector' 
            ? 'Aún no has inspeccionado ningún ascensor' 
            : 'No hay ascensores registrados'}
        </Alert>
      ) : (
        <Paper sx={{ overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marca</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Modelo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Capacidad (kg)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ciudad</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
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
                  <TableCell>{row.capacidad_kg}</TableCell>
                  <TableCell>{row.ciudad}</TableCell>
                  <TableCell>{row.cliente}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.estado} 
                      size="small" 
                      color={row.estado === 'Activo' ? 'success' : 'error'} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}