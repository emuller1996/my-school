import { useState, useCallback, useRef } from 'react';
import api from '../../../utils/axios';

// Los errores de validación del API llegan como arreglo de mensajes
const getErrorMessage = (err, fallback) => {
  const msg = err.response?.data?.message || err.message || fallback;
  return Array.isArray(msg) ? msg.join(', ') : msg;
};

// Quita los filtros vacíos para no enviar ?grade=&status=
const cleanParams = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v != null));

export default function useEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // GET /enrollments?academicYear=&grade=&status=&student_id=
  const fetchEnrollments = useCallback(async (filters = {}) => {
    // Cancela la consulta anterior para que una respuesta lenta no pise a la más reciente
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/enrollments', {
        params: cleanParams(filters),
        signal: controller.signal,
      });
      setEnrollments(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      if (err.code === 'ERR_CANCELED') return;
      setError(getErrorMessage(err, 'Error al obtener las matrículas'));
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, []);

  // POST /enrollments
  const createEnrollment = useCallback(async (enrollmentData) => {
    try {
      const { data } = await api.post('/enrollments', enrollmentData);
      setEnrollments((prev) => [data.data, ...prev]);
      return { success: true, data: data.data };
    } catch (err) {
      // El formulario muestra este error dentro del modal
      return { success: false, error: getErrorMessage(err, 'Error al crear la matrícula') };
    }
  }, []);

  // PATCH /enrollments/:id
  const updateEnrollment = useCallback(async (id, enrollmentData) => {
    try {
      const { data } = await api.patch(`/enrollments/${id}`, enrollmentData);
      setEnrollments((prev) => prev.map((e) => (e.id === id ? data.data : e)));
      return { success: true, data: data.data };
    } catch (err) {
      // El formulario muestra este error dentro del modal
      return { success: false, error: getErrorMessage(err, 'Error al actualizar la matrícula') };
    }
  }, []);

  // DELETE /enrollments/:id
  const deleteEnrollment = useCallback(async (id) => {
    setError(null);
    try {
      await api.delete(`/enrollments/${id}`);
      setEnrollments((prev) => prev.filter((e) => e.id !== id));
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, 'Error al eliminar la matrícula');
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  return {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
  };
}
