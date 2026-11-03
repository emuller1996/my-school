import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../utils/axios';
import { GRADES, currentYear } from '../../enrollments/constants';

const EMPTY_VALUES = {
  name: '',
  academicYear: currentYear(),
  grade: '',
  director_id: '',
};

const toFormValues = (classGroup) =>
  classGroup
    ? {
      name: classGroup.name,
      academicYear: classGroup.academicYear,
      grade: classGroup.grade,
      director_id: classGroup.director_id ?? '',
    }
    : EMPTY_VALUES;

// Profesores activos para el selector de director (+ el director actual aunque esté inactivo)
function useDirectorOptions(currentDirector) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get('/teachers', { signal: controller.signal })
      .then(({ data }) => setTeachers((Array.isArray(data) ? data : data.data || []).filter((t) => t.isActive)))
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const options =
    currentDirector && !teachers.some((t) => t.id === currentDirector.id)
      ? [currentDirector, ...teachers]
      : teachers;

  return { options, loading };
}

const inputClass = (hasError) =>
  `w-full px-4 py-2.5 rounded-xl bg-white/10 border text-white placeholder-white/40
   focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition
   ${hasError ? 'border-red-400/70' : 'border-white/20'}`;

function FieldError({ error }) {
  if (!error) return null;
  return (
    <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
      <i className="fa-solid fa-circle-exclamation"></i>
      {error.message}
    </p>
  );
}

function Label({ children, required }) {
  return (
    <label className="block text-white/80 text-sm font-medium mb-1.5">
      {children} {required && <span className="text-yellow-300">*</span>}
    </label>
  );
}

/**
 * Formulario de grupo de clase (crear / editar).
 * `onSubmit(payload)` debe devolver `{ success, error }` (las acciones de useClassGroups).
 */
export default function FormClassGroup({ classGroup = null, onSubmit, onSuccess }) {
  const isEditing = !!classGroup;
  const [apiError, setApiError] = useState(null);
  const { options: directorOptions, loading: loadingDirectors } = useDirectorOptions(classGroup?.director);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toFormValues(classGroup) });

  const handleFormSubmit = async (data) => {
    setApiError(null);
    const result = await onSubmit({
      ...data,
      academicYear: Number(data.academicYear),
      director_id: data.director_id || null, // null = sin director
    });

    if (!result.success) {
      setApiError(result.error);
      return;
    }
    if (!isEditing) reset(EMPTY_VALUES);
    if (onSuccess) onSuccess(result.data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 space-y-5"
    >
      {/* Título */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/15">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
          <i className={`fa-solid ${isEditing ? 'fa-pen-to-square' : 'fa-people-group'} text-emerald-900`}></i>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">
            {isEditing ? 'Editar Grupo' : 'Registrar Grupo'}
          </h3>
          <p className="text-white/60 text-xs">
            El nombre del grupo no se puede repetir dentro del mismo año académico
          </p>
        </div>
      </div>

      {/* Error del API (409 duplicado, 400 validación, etc.) */}
      {apiError && (
        <div className="rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm p-3 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i>
          {apiError}
        </div>
      )}

      {/* Grid de campos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nombre */}
        <div>
          <Label required>Nombre</Label>
          <input
            type="text"
            placeholder="Ej: 10-A"
            {...register('name', {
              required: 'El nombre es obligatorio',
              maxLength: { value: 50, message: 'Máximo 50 caracteres' },
              validate: (v) => v.trim() !== '' || 'El nombre es obligatorio',
            })}
            className={inputClass(errors.name)}
          />
          <FieldError error={errors.name} />
        </div>

        {/* Grado */}
        <div>
          <Label required>Grado</Label>
          <div className="relative">
            <select
              {...register('grade', { required: 'Selecciona un grado' })}
              className={`${inputClass(errors.grade)} appearance-none cursor-pointer`}
            >
              <option value="" className="text-gray-900">Selecciona una opción</option>
              {GRADES.map((g) => (
                <option key={g.value} value={g.value} className="text-gray-900">{g.label}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-yellow-300 text-xs pointer-events-none"></i>
          </div>
          <FieldError error={errors.grade} />
        </div>

        {/* Año académico */}
        <div>
          <Label required>Año académico</Label>
          <input
            type="number"
            placeholder="Ej: 2026"
            {...register('academicYear', {
              required: 'El año académico es obligatorio',
              min: { value: 2000, message: 'Debe ser mayor o igual a 2000' },
              validate: (v) => Number.isInteger(Number(v)) || 'Debe ser un número entero',
            })}
            className={inputClass(errors.academicYear)}
          />
          <FieldError error={errors.academicYear} />
        </div>

        {/* Director de curso */}
        <div className="md:col-span-3">
          <Label>Director de curso</Label>
          <div className="relative">
            <i className="fa-solid fa-chalkboard-user absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300 text-xs pointer-events-none"></i>
            <select
              {...register('director_id')}
              disabled={loadingDirectors}
              className={`${inputClass(errors.director_id)} pl-10 appearance-none cursor-pointer disabled:opacity-60`}
            >
              <option value="" className="text-gray-900">
                {loadingDirectors ? 'Cargando profesores...' : 'Sin director asignado'}
              </option>
              {directorOptions.map((t) => (
                <option key={t.id} value={t.id} className="text-gray-900">
                  {t.firstName} {t.lastName} — {t.specialty}{t.isActive ? '' : ' (inactivo)'}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-yellow-300 text-xs pointer-events-none"></i>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/15">
        <button
          type="button"
          onClick={() => {
            setApiError(null);
            reset(toFormValues(classGroup));
          }}
          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium
                     border border-white/20 transition"
        >
          <i className="fa-solid fa-rotate-left mr-2"></i>
          {isEditing ? 'Restablecer' : 'Limpiar'}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500
                     hover:from-yellow-300 hover:to-amber-400 text-emerald-900 text-sm font-bold
                     shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              Guardando...
            </>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk mr-2"></i>
              {isEditing ? 'Actualizar' : 'Guardar Grupo'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
