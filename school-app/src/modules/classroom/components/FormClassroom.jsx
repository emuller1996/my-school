import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { currentYear } from '../../enrollments/constants';
import { CLASSROOM_STATUSES } from '../constants';

const EMPTY_VALUES = {
  name: '',
  section: '',
  capacity: '',
  academicYear: currentYear(),
  location: '',
  status: 'disponible',
  isActive: true,
};

// Toma solo los campos editables del salón (el API rechaza/ignora id, createdAt, etc.)
const toFormValues = (classroom) => {
  if (!classroom) return EMPTY_VALUES;
  const values = {};
  Object.keys(EMPTY_VALUES).forEach((k) => (values[k] = classroom[k] ?? EMPTY_VALUES[k]));
  return values;
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

const required = (message) => ({
  required: message,
  validate: (v) => String(v).trim() !== '' || message,
});

/**
 * Formulario de salón de clases (crear / editar).
 * `onSubmit(payload)` debe devolver `{ success, error }` (las acciones de useClassrooms).
 */
export default function FormClassroom({ classroom = null, onSubmit, onSuccess }) {
  const isEditing = !!classroom;
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toFormValues(classroom) });

  const handleFormSubmit = async (data) => {
    setApiError(null);
    const payload = {
      ...data,
      capacity: Number(data.capacity),
      academicYear: Number(data.academicYear),
    };
    // La ubicación es opcional: si va vacía no se envía
    if (!payload.location?.trim()) delete payload.location;

    const result = await onSubmit(payload);

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
          <i className={`fa-solid ${isEditing ? 'fa-pen-to-square' : 'fa-door-open'} text-emerald-900`}></i>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">
            {isEditing ? 'Editar Salón' : 'Registrar Salón'}
          </h3>
          <p className="text-white/60 text-xs">
            El nombre del salón no se puede repetir dentro del mismo año académico
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <Label required>Nombre</Label>
          <input
            type="text"
            placeholder="Ej: Salón 101"
            {...register('name', {
              ...required('El nombre es obligatorio'),
              maxLength: { value: 50, message: 'Máximo 50 caracteres' },
            })}
            className={inputClass(errors.name)}
          />
          <FieldError error={errors.name} />
        </div>

        {/* Sección */}
        <div>
          <Label required>Sección</Label>
          <input
            type="text"
            placeholder="Ej: A"
            {...register('section', {
              ...required('La sección es obligatoria'),
              maxLength: { value: 10, message: 'Máximo 10 caracteres' },
            })}
            className={`${inputClass(errors.section)} uppercase`}
          />
          <FieldError error={errors.section} />
        </div>

        {/* Capacidad */}
        <div>
          <Label required>Capacidad</Label>
          <input
            type="number"
            placeholder="Ej: 35"
            {...register('capacity', {
              required: 'La capacidad es obligatoria',
              min: { value: 1, message: 'Debe ser mayor a 0' },
              validate: (v) => Number.isInteger(Number(v)) || 'Debe ser un número entero',
            })}
            className={inputClass(errors.capacity)}
          />
          <FieldError error={errors.capacity} />
        </div>

        {/* Año académico */}
        <div>
          <Label required>Año académico</Label>
          <input
            type="number"
            placeholder="Ej: 2026"
            {...register('academicYear', {
              required: 'El año académico es obligatorio',
              min: { value: 1, message: 'Debe ser mayor a 0' },
              validate: (v) => Number.isInteger(Number(v)) || 'Debe ser un número entero',
            })}
            className={inputClass(errors.academicYear)}
          />
          <FieldError error={errors.academicYear} />
        </div>

        {/* Ubicación */}
        <div>
          <Label>Ubicación</Label>
          <input
            type="text"
            placeholder="Ej: Bloque B, piso 2"
            {...register('location', { maxLength: { value: 100, message: 'Máximo 100 caracteres' } })}
            className={inputClass(errors.location)}
          />
          <FieldError error={errors.location} />
        </div>

        {/* Estado */}
        <div>
          <Label required>Estado</Label>
          <div className="relative">
            <select
              {...register('status', { required: 'Selecciona un estado' })}
              className={`${inputClass(errors.status)} appearance-none cursor-pointer`}
            >
              {CLASSROOM_STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="text-gray-900">{s.label}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-yellow-300 text-xs pointer-events-none"></i>
          </div>
          <FieldError error={errors.status} />
        </div>

        {/* Activo (solo al editar; al crear el API lo deja activo) */}
        {isEditing && (
          <label className="flex items-center gap-3 md:col-span-2 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4 accent-yellow-400 cursor-pointer"
            />
            <span className="text-white/80 text-sm font-medium">Salón activo</span>
          </label>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/15">
        <button
          type="button"
          onClick={() => {
            setApiError(null);
            reset(toFormValues(classroom));
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
              {isEditing ? 'Actualizar' : 'Guardar Salón'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
