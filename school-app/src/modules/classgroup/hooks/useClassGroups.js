import { useState, useCallback, useRef } from 'react';
import api from '../../../utils/axios';

// Los errores de validación del API llegan como arreglo de mensajes
const getErrorMessage = (err, fallback) => {
  const msg = err.response?.data?.message || err.message || fallback;
  return Array.isArray(msg) ? msg.join(', ') : msg;
};

// Quita los filtros vacíos para no enviar ?grade=&search=
const cleanParams = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v != null));

export default function useClassGroups() {
  const [classGroups, setClassGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // GET /class-group?search=&academicYear=&grade=
  const fetchClassGroups = useCallback(async (filters = {}) => {
    // Cancela la consulta anterior para que una respuesta lenta no pise a la más reciente
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/class-group', {
        params: cleanParams(filters),
        signal: controller.signal,
      });
      setClassGroups(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      if (err.code === 'ERR_CANCELED') return;
      setError(getErrorMessage(err, 'Error al obtener los grupos'));
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, []);

  // POST /class-group
  const createClassGroup = useCallback(async (classGroupData) => {
    try {
      const { data } = await api.post('/class-group', classGroupData);
      setClassGroups((prev) => [{ enrollmentsCount: 0, ...data.data }, ...prev]);
      return { success: true, data: data.data };
    } catch (err) {
      // El formulario muestra este error dentro del modal
      return { success: false, error: getErrorMessage(err, 'Error al crear el grupo') };
    }
  }, []);

  // PATCH /class-group/:id
  const updateClassGroup = useCallback(async (id, classGroupData) => {
    try {
      const { data } = await api.patch(`/class-group/${id}`, classGroupData);
      setClassGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...data.data } : g)));
      return { success: true, data: data.data };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, 'Error al actualizar el grupo') };
    }
  }, []);

  // DELETE /class-group/:id  (el API responde 409 si el grupo tiene matrículas)
  const deleteClassGroup = useCallback(async (id) => {
    setError(null);
    try {
      await api.delete(`/class-group/${id}`);
      setClassGroups((prev) => prev.filter((g) => g.id !== id));
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, 'Error al eliminar el grupo');
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  return {
    classGroups,
    loading,
    error,
    fetchClassGroups,
    createClassGroup,
    updateClassGroup,
    deleteClassGroup,
  };
}
