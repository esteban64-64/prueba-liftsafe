import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Alert, Chip } from '@mui/material';
import { getAllUsers } from '../services/userService';

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllUsers()
      .then(res => {
        console.log('Usuarios:', res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.response?.data?.detail || 'Error al cargar usuarios');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Usuarios del Sistema</Typography>
      <Paper sx={{ overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Correo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rol</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Teléfono</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Documento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Registro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id_usuario} hover>
                <TableCell>{row.id_usuario}</TableCell>
                <TableCell>{row.nombre_completo}</TableCell>
                <TableCell>{row.correo}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.rol} 
                    size="small" 
                    color={row.rol === 'Administrador' ? 'primary' : 'default'} 
                  />
                </TableCell>
                <TableCell>{row.telefono || '-'}</TableCell>
                <TableCell>{row.documento_identidad || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.estado} 
                    size="small" 
                    color={row.estado === 'activo' ? 'success' : 'error'} 
                  />
                </TableCell>
                <TableCell>{new Date(row.fecha_registro).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}