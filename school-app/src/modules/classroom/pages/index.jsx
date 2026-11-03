import { Modal, Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import FormClassroom from '../components/FormClassroom';
import useClassrooms from '../hooks/useClassrooms';
import { CLASSROOM_STATUSES, statusOf } from '../constants';
import { currentYear } from '../../enrollments/constants';

const DEFAULT_FILTERS = { search: '', academicYear: String(currentYear()), status: '' };

const filterClass = `px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm
  placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition`;

export default function Classrooms() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editingClassroom, setEditingClassroom] = useState(null); // null = crear

  const {
    classrooms,
    loading,
    error,
    fetchClassrooms,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  } = useClassrooms();

  // 🔍 Debounce de la búsqueda por nombre (la hace el API)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClassrooms(filters.search);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters.search, fetchClassrooms]);

  // Año y estado se filtran en el cliente (el API solo filtra por nombre)
  const visibleClassrooms = useMemo(() => {
    const year = filters.academicYear.trim();
    return classrooms.filter(
      (c) =>
        (!/^\d+$/.test(year) || c.academicYear === Number(year)) &&
        (!filters.status || c.status === filters.status),
    );
  }, [classrooms, filters.academicYear, filters.status]);

  const setFilter = (name) => (e) => setFilters((prev) => ({ ...prev, [name]: e.target.value }));
  const hasFilters = filters.search || filters.academicYear || filters.status;

  const openCreate = () => {
    setEditingClassroom(null);
    setOpen(true);
  };

  const openEdit = (classroom) => {
    setEditingClassroom(classroom);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingClassroom(null);
  };

  // Se recarga con la búsqueda actual: el salón guardado puede no cumplirla
  const handleSuccess = () => {
    closeModal();
    fetchClassrooms(filters.search);
  };

  const handleDelete = async (classroom) => {
    if (!window.confirm(`¿Eliminar el salón ${classroom.name} (${classroom.academicYear})?`)) return;
    await deleteClassroom(classroom.id);
  };

  return (
    <div className="space-y-4">
      {/* Encabezado + botón nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h3 className="text-white font-semibold text-xl">Salones de Clase</h3>

        <button
          onClick={openCreate}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500
                     text-emerald-900 text-sm font-bold shadow-lg
                     hover:from-yellow-300 hover:to-amber-400 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Nuevo salón
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300 text-xs"></i>
          <input
            type="text"
            value={filters.search}
            onChange={setFilter('search')}
            placeholder="Buscar por nombre..."
            className={`${filterClass} w-56 pl-9`}
          />
        </div>

        <div className="relative">
          <i className="fa-solid fa-calendar-days absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300 text-xs"></i>
          <input
            type="number"
            value={filters.academicYear}
            onChange={setFilter('academicYear')}
            placeholder="Año"
            className={`${filterClass} w-32 pl-9`}
          />
        </div>

        <select value={filters.status} onChange={setFilter('status')} className={`${filterClass} cursor-pointer`}>
          <option value="" className="text-gray-900">Todos los estados</option>
          {CLASSROOM_STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="text-gray-900">{s.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => setFilters({ search: '', academicYear: '', status: '' })}
            className="px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 text-sm transition"
          >
            <i className="fa-solid fa-xmark mr-1"></i>
            Quitar filtros
          </button>
        )}
      </div>

      {/* Errores de carga y de borrado */}
      {error && (
        <div className="rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm p-3 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-4 overflow-x-auto">
        {loading ? (
          <p className="text-white/70 text-sm text-center py-8">
            <i className="fa-solid fa-spinner fa-spin text-2xl block mb-2 text-yellow-300"></i>
            Buscando...
          </p>
        ) : visibleClassrooms.length === 0 ? (
          <p className="text-white/60 text-sm text-center py-8">
            <i className="fa-solid fa-inbox text-3xl block mb-2 text-yellow-300/60"></i>
            {hasFilters ? 'No hay salones con esos filtros' : 'No hay salones registrados aún'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-yellow-300 text-left border-b border-white/15">
                <th className="py-2 px-3">Nombre</th>
                <th className="py-2 px-3">Sección</th>
                <th className="py-2 px-3">Capacidad</th>
                <th className="py-2 px-3">Año</th>
                <th className="py-2 px-3">Ubicación</th>
                <th className="py-2 px-3">Estado</th>
                <th className="py-2 px-3">Activo</th>
                <th className="py-2 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleClassrooms.map((c) => {
                const status = statusOf(c.status);
                return (
                  <tr
                    key={c.id}
                    className="text-white/85 border-b border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-2.5 px-3 font-medium">{c.name}</td>
                    <td className="py-2.5 px-3">{c.section}</td>
                    <td className="py-2.5 px-3">
                      <i className="fa-solid fa-chair mr-1 text-yellow-300/70 text-xs"></i>
                      {c.capacity}
                    </td>
                    <td className="py-2.5 px-3">{c.academicYear}</td>
                    <td className="py-2.5 px-3">
                      {c.location || <span className="text-white/40">—</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-semibold ${c.isActive
                          ? 'bg-emerald-400/20 text-emerald-200'
                          : 'bg-white/10 text-white/50'
                          }`}
                      >
                        {c.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          title="Editar"
                          className="w-8 h-8 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/40
                                     text-yellow-200 transition flex items-center justify-center"
                        >
                          <i className="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          title="Eliminar"
                          className="w-8 h-8 rounded-lg bg-red-400/20 hover:bg-red-400/40
                                     text-red-200 transition flex items-center justify-center"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Total + recargar */}
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-xs">
          {!loading && `${visibleClassrooms.length} salón${visibleClassrooms.length === 1 ? '' : 'es'}`}
        </p>
        <button
          onClick={() => fetchClassrooms(filters.search)}
          disabled={loading}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20
                     text-white text-xs flex items-center gap-2 transition disabled:opacity-50"
        >
          <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
          Recargar
        </button>
      </div>

      {/* Modal (crear / editar) */}
      <Modal
        open={open}
        onClose={closeModal}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(6px)',
            },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '92%', sm: '90%', md: 720 },
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '1rem',
            outline: 'none',
            backgroundColor: 'rgba(15, 61, 46, 0.85)',
          }}
        >
          <FormClassroom
            key={editingClassroom?.id || 'create'} // 🔑 fuerza re-mount al cambiar
            classroom={editingClassroom}
            onSubmit={(payload) =>
              editingClassroom ? updateClassroom(editingClassroom.id, payload) : createClassroom(payload)
            }
            onSuccess={handleSuccess}
          />
        </Box>
      </Modal>
    </div>
  );
}
