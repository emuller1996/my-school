import { useEffect, useState } from 'react';
import useEnrollments from '../hooks/useEnrollments';
import EnrollmentsTable from '../components/EnrollmentsTable';
import EnrollmentModal from '../components/EnrollmentModal';
import { GRADES, STATUSES, currentYear } from '../constants';

const DEFAULT_FILTERS = { academicYear: String(currentYear()), grade: '', status: '' };

const filterClass = `px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm
  placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition`;

export default function Enrollments() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [editingEnrollment, setEditingEnrollment] = useState(null); // null = crear

  const {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
  } = useEnrollments();

  // El año solo se envía si es un número válido (el API responde 400 si no lo es)
  const toQuery = (f) => ({
    ...f,
    academicYear: /^\d{4}$/.test(f.academicYear.trim()) ? f.academicYear.trim() : '',
  });

  // 🔍 Debounce de filtros (el filtrado lo hace el API)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEnrollments(toQuery(filters));
    }, 400);
    return () => clearTimeout(timer);
  }, [filters, fetchEnrollments]);

  const setFilter = (name) => (e) => setFilters((prev) => ({ ...prev, [name]: e.target.value }));
  const hasFilters = filters.academicYear || filters.grade || filters.status;

  const openCreate = () => {
    setEditingEnrollment(null);
    setOpen(true);
  };

  const openEdit = (enrollment) => {
    setEditingEnrollment(enrollment);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingEnrollment(null);
  };

  // Se recarga con los filtros actuales: la matrícula guardada puede no cumplirlos
  const handleSuccess = () => {
    closeModal();
    fetchEnrollments(toQuery(filters));
  };

  const handleDelete = async (enrollment) => {
    const name = enrollment.student?.name || 'este estudiante';
    if (!window.confirm(`¿Eliminar la matrícula ${enrollment.academicYear} de ${name}?`)) return;
    await deleteEnrollment(enrollment.id);
  };

  return (
    <div className="space-y-4">
      {/* Encabezado + botón nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h3 className="text-white font-semibold text-xl">Matrículas</h3>

        <button
          onClick={openCreate}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500
                     text-emerald-900 text-sm font-bold shadow-lg
                     hover:from-yellow-300 hover:to-amber-400 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Nueva matrícula
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <i className="fa-solid fa-calendar-days absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300 text-xs"></i>
          <input
            type="number"
            value={filters.academicYear}
            onChange={setFilter('academicYear')}
            placeholder="Año lectivo"
            className={`${filterClass} w-36 pl-9`}
          />
        </div>

        <select value={filters.grade} onChange={setFilter('grade')} className={`${filterClass} cursor-pointer`}>
          <option value="" className="text-gray-900">Todos los grados</option>
          {GRADES.map((g) => (
            <option key={g.value} value={g.value} className="text-gray-900">{g.label}</option>
          ))}
        </select>

        <select value={filters.status} onChange={setFilter('status')} className={`${filterClass} cursor-pointer`}>
          <option value="" className="text-gray-900">Todos los estados</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="text-gray-900">{s.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={() => setFilters({ academicYear: '', grade: '', status: '' })}
            className="px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 text-sm transition"
          >
            <i className="fa-solid fa-xmark mr-1"></i>
            Quitar filtros
          </button>
        )}
      </div>

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
        ) : enrollments.length === 0 ? (
          <p className="text-white/60 text-sm text-center py-8">
            <i className="fa-solid fa-inbox text-3xl block mb-2 text-yellow-300/60"></i>
            {hasFilters ? 'No hay matrículas con esos filtros' : 'No hay matrículas registradas aún'}
          </p>
        ) : (
          <EnrollmentsTable enrollments={enrollments} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </div>

      {/* Total + recargar */}
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-xs">
          {!loading && `${enrollments.length} matrícula${enrollments.length === 1 ? '' : 's'}`}
        </p>
        <button
          onClick={() => fetchEnrollments(toQuery(filters))}
          disabled={loading}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20
                     text-white text-xs flex items-center gap-2 transition disabled:opacity-50"
        >
          <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
          Recargar
        </button>
      </div>

      <EnrollmentModal
        open={open}
        onClose={closeModal}
        enrollment={editingEnrollment}
        onSubmit={(payload) =>
          editingEnrollment ? updateEnrollment(editingEnrollment.id, payload) : createEnrollment(payload)
        }
        onSuccess={handleSuccess}
      />
    </div>
  );
}
