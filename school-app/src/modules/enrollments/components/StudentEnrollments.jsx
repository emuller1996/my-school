import { useEffect, useState } from 'react';
import useEnrollments from '../hooks/useEnrollments';
import EnrollmentsTable from './EnrollmentsTable';
import EnrollmentModal from './EnrollmentModal';

// Pestaña "Matrículas" del detalle del estudiante: GET /enrollments?student_id=
export default function StudentEnrollments({ student }) {
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    const timer = setTimeout(() => fetchEnrollments({ student_id: student.id }), 0);
    return () => clearTimeout(timer);
  }, [student.id, fetchEnrollments]);

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

  const handleSuccess = () => {
    closeModal();
    fetchEnrollments({ student_id: student.id });
  };

  const handleDelete = async (enrollment) => {
    if (!window.confirm(`¿Eliminar la matrícula ${enrollment.academicYear}?`)) return;
    await deleteEnrollment(enrollment.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500
                     text-emerald-900 text-sm font-bold shadow-lg
                     hover:from-yellow-300 hover:to-amber-400 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Nueva matrícula
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm p-3 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-white/70 text-sm text-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-2xl block mb-2 text-yellow-300"></i>
          Cargando matrículas...
        </p>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-10">
          <i className="fa-solid fa-file-circle-plus text-3xl block mb-2 text-yellow-300/60"></i>
          <p className="text-white/60 text-sm">Este estudiante no tiene matrículas registradas.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <EnrollmentsTable
            enrollments={enrollments}
            onEdit={openEdit}
            onDelete={handleDelete}
            showStudent={false}
          />
        </div>
      )}

      <EnrollmentModal
        open={open}
        onClose={closeModal}
        enrollment={editingEnrollment}
        fixedStudent={student}
        onSubmit={(payload) =>
          editingEnrollment ? updateEnrollment(editingEnrollment.id, payload) : createEnrollment(payload)
        }
        onSuccess={handleSuccess}
      />
    </div>
  );
}
