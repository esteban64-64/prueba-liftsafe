import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import api from '../config/api';

export default function Inspections() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/inspecciones/mis-inspecciones')  // ← Nuevo endpoint
      .then(res => {
        console.log('Inspecciones:', res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.response?.data?.detail || 'Error al cargar inspecciones');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Inspecciones</Typography>
      <Paper sx={{ overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código Ascensor</TableCell>
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
                <TableCell>{row.codigo_ascensor || row.codigo_interno || '-'}</TableCell>
                <TableCell>{row.fecha_inicio ? new Date(row.fecha_inicio).toLocaleString() : '-'}</TableCell>
                <TableCell>{row.fecha_fin ? new Date(row.fecha_fin).toLocaleString() : '-'}</TableCell>
                <TableCell>{row.estado}</TableCell>
                <TableCell>{row.observaciones_generales || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}