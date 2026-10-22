import { Modal, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import FormStudent from '../components/FormStudent';
import useStudents from '../hooks/useStudents';
import { Link } from 'react-router-dom';

export default function Students() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState(null); // null = crear

  const { students, loading, error, fetchStudents, deleteStudent } = useStudents();

  // 🔍 Debounce de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(search.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [search, fetchStudents]);

  const openCreate = () => {
    setEditingStudent(null);
    setOpen(true);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingStudent(null);
  };

  const handleSuccess = () => {
    closeModal();
    fetchStudents(search.trim());
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este estudiante?')) return;
    await deleteStudent(id);
  };

  return (
    <div className="space-y-4">
      {/* Encabezado + buscador + botón nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h3 className="text-white font-semibold text-xl">Listado de Estudiantes</h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300 text-xs"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-56 pl-9 pr-9 py-2 rounded-xl bg-white/10 border border-white/20
                         text-white placeholder-white/40 text-sm
                         focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500
                       text-emerald-900 text-sm font-bold shadow-lg
                       hover:from-yellow-300 hover:to-amber-400 transition flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            Nuevo
          </button>
        </div>
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
        ) : students.length === 0 ? (
          <p className="text-white/60 text-sm text-center py-8">
            <i className="fa-solid fa-inbox text-3xl block mb-2 text-yellow-300/60"></i>
            {search ? 'No se encontraron estudiantes con ese nombre' : 'No hay estudiantes registrados aún'}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-yellow-300 text-left border-b border-white/15">
                <th className="py-2 px-3">Código</th>
                <th className="py-2 px-3">Nombre</th>
                <th className="py-2 px-3">Documento</th>
                <th className="py-2 px-3">Nacimiento</th>
                <th className="py-2 px-3">Nota</th>
                <th className="py-2 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id || s.code}
                  className="text-white/85 border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="py-2.5 px-3 font-medium">{s.code}</td>
                  <td className="py-2.5 px-3">{s.name}</td>
                  <td className="py-2.5 px-3">
                    {s.typeIdentityDocument} - {s.identityNumber}
                  </td>
                  <td className="py-2.5 px-3">{s.birthdate}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-200 text-xs font-semibold">
                      {s.note || '—'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        title="Editar"
                        className="w-8 h-8 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/40
                                   text-yellow-200 transition flex items-center justify-center"
                      >
                        <i className="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        title="Eliminar"
                        className="w-8 h-8 rounded-lg bg-red-400/20 hover:bg-red-400/40
                                   text-red-200 transition flex items-center justify-center"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                      <Link to={`${s.id}`}>
                        <button
                          title="Detaller"
                          className="w-8 h-8 rounded-lg bg-blue-400/70 hover:bg-blue-500/80
                                   text-blue-100 transition flex items-center justify-center"
                        >
                          <i className="fa-solid fa-eye text-xs"></i>
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recargar */}
      <div className="flex justify-end">
        <button
          onClick={() => fetchStudents(search.trim())}
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
          <FormStudent
            key={editingStudent?.id || 'create'} // 🔑 fuerza re-mount al cambiar
            isEditing={!!editingStudent}
            studentId={editingStudent?.id}
            defaultValues={editingStudent || undefined}
            onSuccess={handleSuccess}
          />
        </Box>
      </Modal>
    </div>
  );
}