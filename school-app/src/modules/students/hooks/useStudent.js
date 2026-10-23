import { useState, /* useEffect,  */useCallback, useEffect } from 'react';
import api from '../../../utils/axios';

export default function useStudent(id) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudent = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/students/${id}`);
      setStudent(data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Error al obtener el estudiante'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  return { student, loading, error, refetch: fetchStudent };
}