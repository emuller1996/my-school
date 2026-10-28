import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import StudentPicker from './StudentPicker';
import { GRADES, STATUSES, currentYear, todayISO } from '../constants';

const emptyValues = (student) => ({
  student: student || null,
  enrollmentDate: todayISO(),
  academicYear: currentYear(),
  grade: '',
  status: 'activa',
  observations: '',
});

const toFormValues = (enrollment, fixedStudent) => {
  if (!enrollment) return emptyValues(fixedStudent);
  return {
    student: enrollment.student || fixedStudent || null,
    enrollmentDate: String(enrollment.enrollmentDate ?? '').slice(0, 10),
    academicYear: enrollment.academicYear,
    grade: enrollment.grade,
    status: enrollment.status,
    observations: enrollment.observations ?? '',
  };
};

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
 * Formulario de matrícula (crear / editar).
 * - `onSubmit(payload)` debe devolver `{ success, error }` (las acciones de useEnrollments).
 * - `fixedStudent`: preselecciona y bloquea el estudiante (pestaña del detalle del estudiante).
 */
export default function FormEnrollment({ enrollment = null, fixedStudent = null, onSubmit, onSuccess }) {
  const isEditing = !!enrollment;
  const [apiError, setApiError] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toFormValues(enrollment, fixedStudent) });

  const handleFormSubmit = async ({ student, ...data }) => {
    setApiError(null);
    const payload = {
      ...data,
      student_id: student.id,
      academicYear: Number(data.academicYear),
      observations: data.observations.trim() || undefined,
    };

    const result = await onSubmit(payload);
    if (!result.success) {
      setApiError(result.error);
      return;
    }
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
          <i className={`fa-solid ${isEditing ? 'fa-file-pen' : 'fa-file-circle-plus'} text-emerald-900`}></i>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">
            {isEditing ? 'Editar Matrícula' : 'Registrar Matrícula'}
          </h3>
          <p className="text-white/60 text-xs">
            Un estudiante solo puede tener una matrícula activa por año lectivo
          </p>
        </div>
      </div>

      {/* Error del API (409 matrícula activa duplicada, 404, 400...) */}
      {apiError && (
        <div className="rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm p-3 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i>
          {apiError}
        </div>
      )}

      {/* Estudiante */}
      <div>
        <Label required>Estudiante</Label>
        <Controller
          name="student"
          control={control}
          rules={{ required: 'Selecciona un estudiante' }}
          render={({ field }) => (
            <StudentPicker
              value={field.value}
              onChange={field.onChange}
              disabled={!!fixedStudent}
              hasError={!!errors.student}
            />
          )}
        />
        <FieldError error={errors.student} />
      </div>

      {/* Grid de campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Año lectivo */}
        <div>
          <Label required>Año lectivo</Label>
          <input
            type="number"
            placeholder="Ej: 2026"
            {...register('academicYear', {
              required: 'El año lectivo es obligatorio',
              min: { value: 2000, message: 'Debe ser mayor o igual a 2000' },
              validate: (v) => Number.isInteger(Number(v)) || 'Debe ser un número entero',
            })}
            className={inputClass(errors.academicYear)}
          />
          <FieldError error={errors.academicYear} />
        </div>

        {/* Fecha de matrícula */}
        <div>
          <Label required>Fecha de matrícula</Label>
          <input
            type="date"
            {...register('enrollmentDate', { required: 'La fecha de matrícula es obligatoria' })}
            className={`${inputClass(errors.enrollmentDate)} [color-scheme:dark]`}
          />
          <FieldError error={errors.enrollmentDate} />
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

        {/* Estado */}
        <div>
          <Label required>Estado</Label>
          <div className="relative">
            <select
              {...register('status', { required: 'Selecciona un estado' })}
              className={`${inputClass(errors.status)} appearance-none cursor-pointer`}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="text-gray-900">{s.label}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-yellow-300 text-xs pointer-events-none"></i>
          </div>
          <FieldError error={errors.status} />
        </div>

        {/* Observaciones */}
        <div className="md:col-span-2">
          <Label>Observaciones</Label>
          <textarea
            rows={3}
            placeholder="Ej: Ingresa con documentos completos"
            {...register('observations')}
            className={`${inputClass(errors.observations)} resize-y`}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/15">
        <button
          type="button"
          onClick={() => {
            setApiError(null);
            reset(toFormValues(enrollment, fixedStudent));
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
              {isEditing ? 'Actualizar' : 'Guardar Matrícula'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
