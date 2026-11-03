import { Modal, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import FormClassGroup from '../components/FormClassGroup';
import useClassGroups from '../hooks/useClassGroups';
import { GRADES, gradeLabel, currentYear } from '../../enrollments/constants';

const DEFAULT_FILTERS = { search: '', academicYear: String(currentYear()), grade: '' };

const filterClass = `px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm
  placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition`;

// El año solo se envía si es un número válido (el API responde 400 si no lo es)
const toQuery = (f) => ({
  search: f.search.trim(),
  grade: f.grade,
  academicYear: /^\d{4}$/.test(f.academicYear.trim()) ? f.academicYear.trim() : '',
});

export default function ClassGroups() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editingGroup, setEditingGroup] = useState(null); // null = crear

  const {
    classGroups,
    loading,
    error,
    fetchClassGroups,
    createClassGroup,
    updateClassGroup,
    deleteClassGroup,
  } = useClassGroups();

  // 🔍 Debounce de filtros (el filtrado lo hace el API)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClassGroups(toQuery(filters));
    }, 400);
    return () => clearTimeout(timer);
  }, [filters, fetchClassGroups]);

  const setFilter = (name) => (e) => setFilters((prev) => ({ ...prev, [name]: e.target.value }));
  const hasFilters = filters.search || filters.academicYear || filters.grade;

  const openCreate = () => {
    setEditingGroup(null);
    setOpen(true);
  };

  const openEdit = (group) => {
    setEditingGroup(group);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingGroup(null);
  };

  // Se recarga con los filtros actuales: el grupo guardado puede no cumplirlos
  const handleSuccess = () => {
    closeModal();
    fetchClassGroups(toQuery(filters));
  };

  const handleDelete = async (group) => {
    if (!window.confirm(`¿Eliminar el grupo ${group.name} (${group.academicYear})?`)) return;
    await deleteClassGroup(group.id);
  };

  return (
    <div className="space-y-4">
      {/* Encabezado + botón nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h3 className="text-white font-semibold text-xl">Grupos de Clase</h3>

        <button
          onClick={openCreate}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500
                     text-emerald-900 text-sm font-bold shadow-lg
                     hover:from-yellow-300 hover:to-amber-400 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Nuevo grupo
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

        <select value={filters.grade} onChange={setFilter('grade')} className={`${filterClass} cursor-pointer`}>
          <option value="" className="text-gray-900">Todos los grados</option>
          {GRADES.map((g) => (
            <option key={g.value} value={g.value} className="text-gray-900">{g.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => setFilters({ search: '', academicYear: '', grade: '' })}
            className="px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 text-sm transition"
          >
            <i className="fa-solid fa-xmark mr-1"></i>
            Quitar filtros
          </button>
        )}
      </div>

      {/* Errores de carga y de borrado (ej. 409 si el grupo tiene matrículas) */}
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
        ) : classGroups.length === 0 ? (
          <p className="text-white/60 text-sm text-center py-8">
            <i className="fa-solid fa-inbox text-3xl block mb-2 text-yellow-300/60"></i>
            {hasFilters ? 'No hay grupos con esos filtros' : 'No hay grupos registrados aún'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-yellow-300 text-left border-b border-white/15">
                <th className="py-2 px-3">Nombre</th>
                <th className="py-2 px-3">Grado</th>
                <th className="py-2 px-3">Año</th>
                <th className="py-2 px-3">Director de curso</th>
                <th className="py-2 px-3">Matrículas</th>
                <th className="py-2 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {classGroups.map((g) => (
                <tr
                  key={g.id}
                  className="text-white/85 border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="py-2.5 px-3 font-medium">{g.name}</td>
                  <td className="py-2.5 px-3">{gradeLabel(g.grade)}</td>
                  <td className="py-2.5 px-3">{g.academicYear}</td>
                  <td className="py-2.5 px-3">
                    {g.director ? (
                      <>
                        <div>{g.director.firstName} {g.director.lastName}</div>
                        <div className="text-white/50 text-xs">{g.director.specialty}</div>
                      </>
                    ) : (
                      <span className="text-white/40">Sin asignar</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-200 text-xs font-semibold">
                      <i className="fa-solid fa-user-graduate mr-1"></i>
                      {g.enrollmentsCount ?? 0}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(g)}
                        title="Editar"
                        className="w-8 h-8 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/40
                                   text-yellow-200 transition flex items-center justify-center"
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(g)}
                        disabled={g.enrollmentsCount > 0}
                        title={g.enrollmentsCount > 0 ? 'No se puede eliminar: tiene matrículas' : 'Eliminar'}
                        className="w-8 h-8 rounded-lg bg-red-400/20 hover:bg-red-400/40
                                   text-red-200 transition flex items-center justify-center
                                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-400/20"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Total + recargar */}
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-xs">
          {!loading && `${classGroups.length} grupo${classGroups.length === 1 ? '' : 's'}`}
        </p>
        <button
          onClick={() => fetchClassGroups(toQuery(filters))}
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
          <FormClassGroup
            key={editingGroup?.id || 'create'} // 🔑 fuerza re-mount al cambiar
            classGroup={editingGroup}
            onSubmit={(payload) =>
              editingGroup ? updateClassGroup(editingGroup.id, payload) : createClassGroup(payload)
            }
            onSuccess={handleSuccess}
          />
        </Box>
      </Modal>
    </div>
  );
}
