import { useState, useCallback, useRef } from 'react';
import api from '../../../utils/axios';

// Los errores de validación del API llegan como arreglo de mensajes
const getErrorMessage = (err, fallback) => {
  const msg = err.response?.data?.message || err.message || fallback;
  return Array.isArray(msg) ? msg.join(', ') : msg;
};

export default function useTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // GET /teachers?search=  (nombre, número de documento o teléfono)
  const fetchTeachers = useCallback(async (search = '') => {
    // Cancela la búsqueda anterior para que una respuesta lenta no pise a la más reciente
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/teachers', {
        params: search ? { search } : {},
        signal: controller.signal,
      });
      setTeachers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      if (err.code === 'ERR_CANCELED') return;
      setError(getErrorMessage(err, 'Error al obtener los profesores'));
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, []);

  // POST /teachers
  const createTeacher = useCallback(async (teacherData) => {
    setError(null);
    try {
      const { data } = await api.post('/teachers', teacherData);
      setTeachers((prev) => [data.data, ...prev]);
      return { success: true, data: data.data };
    } catch (err) {
      const msg = getErrorMessage(err, 'Error al crear el profesor');
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // PATCH /teachers/:id
  const updateTeacher = useCallback(async (id, teacherData) => {
    setError(null);
    try {
      const { data } = await api.patch(`/teachers/${id}`, teacherData);
      setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...data.data } : t)));
      return { success: true, data: data.data };
    } catch (err) {
      const msg = getErrorMessage(err, 'Error al actualizar el profesor');
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // DELETE /teachers/:id
  const deleteTeacher = useCallback(async (id) => {
    setError(null);
    try {
      await api.delete(`/teachers/${id}`);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, 'Error al eliminar el profesor');
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
}
