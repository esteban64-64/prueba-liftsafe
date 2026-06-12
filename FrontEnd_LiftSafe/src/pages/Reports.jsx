import { useState } from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Alert, CircularProgress, MenuItem } from '@mui/material';
import { getInspeccionesPorEstado } from '../services/reportService';

const ESTADOS = ['Finalizada', 'Aprobada', 'Borrador', 'En Proceso', 'Programada', 'Cancelada'];

export default function Reports() {
  const [estado, setEstado] = useState('Finalizada');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscar = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInspeccionesPorEstado(estado);
      console.log('Reportes:', res.data);
      setData(res.data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.detail || 'Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Reportes - Procedimiento Almacenado</Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField 
          select
          label="Estado" 
          value={estado} 
          onChange={(e) => setEstado(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          {ESTADOS.map((e) => (
            <MenuItem key={e} value={e}>{e}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={buscar} disabled={loading}>
          {loading ? 'Cargando...' : 'Buscar'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {data.length > 0 && (
        <Paper sx={{ overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Código Ascensor</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marca</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Modelo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Inspector</TableCell>
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
                  <TableCell>{row.codigo_ascensor}</TableCell>
                  <TableCell>{row.marca}</TableCell>
                  <TableCell>{row.modelo}</TableCell>
                  <TableCell>{row.inspector}</TableCell>
                  <TableCell>{row.fecha_inicio}</TableCell>
                  <TableCell>{row.fecha_fin}</TableCell>
                  <TableCell>{row.estado}</TableCell>
                  <TableCell>{row.observaciones_generales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {data.length === 0 && !loading && !error && (
        <Alert severity="info">Selecciona un estado y haz clic en Buscar</Alert>
      )}
    </Box>
  );
}