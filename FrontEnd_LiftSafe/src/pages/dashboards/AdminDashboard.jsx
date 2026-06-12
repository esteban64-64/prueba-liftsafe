import { Box, Button, Skeleton } from '@mui/material';
import { People, Elevator, Assignment, Assessment } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import WelcomeBanner from '../../components/WelcomeBanner';
import ChartCard from '../../components/dashboard/ChartCard';
import ActivityPanel from '../../components/dashboard/ActivityPanel';
import { InspectionTrendChart, StatusDonutChart, BuildingBarChart } from '../../components/dashboard/DashboardCharts';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../../config/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ usuarios: 0, ascensores: 0, inspecciones: 0, informes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/usuarios/dashboard/admin');
        setStats({
          usuarios: res.data.total_usuarios,
          ascensores: res.data.total_ascensores,
          inspecciones: res.data.total_inspecciones,
          informes: res.data.total_informes, // ← Real del backend
        });
      } catch (error) {
        console.error('Error cargando stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statItems = [
    { title: 'Usuarios activos', value: stats.usuarios, icon: <People />, accent: '#0066CC', trend: 8, trendLabel: 'vs. mes anterior' },
    { title: 'Ascensores registrados', value: stats.ascensores, icon: <Elevator />, accent: '#0E7C4A', trend: 4 },
    { title: 'Inspecciones del mes', value: stats.inspecciones, icon: <Assignment />, accent: '#C97B1A', trend: 12 },
    { title: 'Informes emitidos', value: stats.informes, icon: <Assessment />, accent: '#7C5CBF', trend: 6 },
  ];

  return (
    <Box>
      <WelcomeBanner userName={user?.name} role={user?.role} />
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 2 }} />)
          : statItems.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2, mb: 3 }}>
        <ChartCard title="Tendencia de inspecciones" subtitle="Evolución mensual" chart={<InspectionTrendChart />} />
        <ChartCard title="Estado de inspecciones" subtitle="Distribución actual" chart={<StatusDonutChart />} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <ChartCard 
          title="Inspecciones por edificio" 
          subtitle="Top edificios con mayor actividad"
          action={<Button component={Link} to="/buildings" variant="outlined" size="small">Ver edificios</Button>}
          chart={<BuildingBarChart />}
        />
        <ActivityPanel 
          title="Actividad reciente" 
          subtitle="Últimas acciones en el sistema"
          items={[]}  // ← Agrega esto para evitar error de items undefined
          action={<Button component={Link} to="/inspections" variant="outlined" 
          size="small">Ver todo</Button>}
        />
      </Box>
    </Box>
  );
}