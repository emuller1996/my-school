import { useState, useCallback } from 'react';
import api from '../../../utils/axios';

export default function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/students', {
        params: search ? { name: search } : {},
      });
      setStudents(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Error al obtener los estudiantes'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createStudent = useCallback(async (studentData) => {
    setError(null);
    try {
      const { data } = await api.post('/students', studentData);
      setStudents((prev) => [data, ...prev]);
      return { success: true, data };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Error al crear el estudiante';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // 🆕 PUT /students/:id
  const updateStudent = useCallback(async (id, studentData) => {
    setError(null);
    try {
      const { data } = await api.patch(`/students/${id}`, studentData);
      // Reemplaza el estudiante actualizado en la lista
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
      return { success: true, data };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Error al actualizar el estudiante';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // 🆕 DELETE /students/:id (opcional)
  const deleteStudent = useCallback(async (id) => {
    setError(null);
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Error al eliminar el estudiante';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
  };
}