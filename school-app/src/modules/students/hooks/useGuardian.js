import { useState, useCallback } from 'react';
import api from '../../../utils/axios';

export default function useGuardian() {
  const [error, setError] = useState(null);

  // POST /parents  (crea el acudiente y lo asocia al estudiante)
  const createGuardian = useCallback(async (studentId, guardianData) => {
    setError(null);
    try {
      const { data } = await api.post('/parents', { ...guardianData, student_id: studentId });
      return { success: true, data: data.data };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Error al crear el acudiente';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // PATCH /parents/:id
  const updateGuardian = useCallback(async (id, guardianData) => {
    setError(null);
    try {
      const { data } = await api.patch(`/parents/${id}`, guardianData);
      return { success: true, data: data.data };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Error al actualizar el acudiente';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  return { error, createGuardian, updateGuardian };
}
