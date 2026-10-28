import { Link } from 'react-router-dom';
import { gradeLabel, statusOf } from '../constants';

// Tabla reutilizable: listado general y pestaña "Matrículas" del estudiante (showStudent=false)
export default function EnrollmentsTable({ enrollments, onEdit, onDelete, showStudent = true }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-yellow-300 text-left border-b border-white/15">
          {showStudent && <th className="py-2 px-3">Estudiante</th>}
          <th className="py-2 px-3">Año</th>
          <th className="py-2 px-3">Grado</th>
          <th className="py-2 px-3">Fecha</th>
          <th className="py-2 px-3">Estado</th>
          <th className="py-2 px-3">Observaciones</th>
          <th className="py-2 px-3 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {enrollments.map((e) => {
          const status = statusOf(e.status);
          return (
            <tr
              key={e.id}
              className="text-white/85 border-b border-white/10 hover:bg-white/5 transition"
            >
              {showStudent && (
                <td className="py-2.5 px-3">
                  {e.student ? (
                    <Link to={`/students/${e.student_id}`} className="hover:text-yellow-200 transition">
                      <div className="font-medium">{e.student.name}</div>
                      <div className="text-white/50 text-xs">Código {e.student.code}</div>
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
              )}
              <td className="py-2.5 px-3 font-medium">{e.academicYear}</td>
              <td className="py-2.5 px-3">{gradeLabel(e.grade)}</td>
              <td className="py-2.5 px-3">{String(e.enrollmentDate ?? '').slice(0, 10)}</td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${status.className}`}>
                  {status.label}
                </span>
              </td>
              <td className="py-2.5 px-3 max-w-[16rem] truncate text-white/60" title={e.observations || ''}>
                {e.observations || '—'}
              </td>
              <td className="py-2.5 px-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(e)}
                    title="Editar"
                    className="w-8 h-8 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/40
                               text-yellow-200 transition flex items-center justify-center"
                  >
                    <i className="fa-solid fa-pen text-xs"></i>
                  </button>
                  <button
                    onClick={() => onDelete(e)}
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
  );
}
