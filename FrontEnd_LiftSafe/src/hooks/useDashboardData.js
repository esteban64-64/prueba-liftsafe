import { useState, useEffect } from 'react';
import { getAdminStats, getResumenInspecciones } from '../services/dataService';

export const useAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [inspecciones, setInspecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, inspRes] = await Promise.all([
          getAdminStats(),
          getResumenInspecciones()
        ]);
        setStats(statsRes.data);
        setInspecciones(inspRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { stats, inspecciones, loading, error };
};