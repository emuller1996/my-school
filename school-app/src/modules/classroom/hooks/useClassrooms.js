import { useState, useCallback, useRef } from 'react';
import api from '../../../utils/axios';

// Los errores de validación del API llegan como arreglo de mensajes
const getErrorMessage = (err, fallback) => {
  const msg = err.response?.data?.message || err.message || fallback;
  return Array.isArray(msg) ? msg.join(', ') : msg;
};

export default function useClassrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // GET /classrooms?name=  (el API solo filtra por nombre)
  const fetchClassrooms = useCallback(async (name = '') => {
    // Cancela la consulta anterior para que una respuesta lenta no pise a la más reciente
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const term = name.trim();
      const { data } = await api.get('/classrooms', {
        params: term ? { name: term } : {},
        signal: controller.signal,
      });
      setClassrooms(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      if (err.code === 'ERR_CANCELED') return;
      setError(getErrorMessage(err, 'Error al obtener los salones'));
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, []);

  // POST /classrooms
  const createClassroom = useCallback(async (classroomData) => {
    try {
      const { data } = await api.post('/classrooms', classroomData);
      setClassrooms((prev) => [data.data, ...prev]);
      return { success: true, data: data.data };
    } catch (err) {
      // El formulario muestra este error dentro del modal
      return { success: false, error: getErrorMessage(err, 'Error al crear el salón') };
    }
  }, []);

  // PATCH /classrooms/:id
  const updateClassroom = useCallback(async (id, classroomData) => {
    try {
      const { data } = await api.patch(`/classrooms/${id}`, classroomData);
      setClassrooms((prev) => prev.map((c) => (c.id === id ? { ...c, ...data.data } : c)));
      return { success: true, data: data.data };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, 'Error al actualizar el salón') };
    }
  }, []);

  // DELETE /classrooms/:id
  const deleteClassroom = useCallback(async (id) => {
    setError(null);
    try {
      await api.delete(`/classrooms/${id}`);
      setClassrooms((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, 'Error al eliminar el salón');
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  return {
    classrooms,
    loading,
    error,
    fetchClassrooms,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  };
}
