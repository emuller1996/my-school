import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useTeachers from '../hooks/useTeachers';

// Deben coincidir con el enum de la entidad Teacher en el API
const TIPOS_DOCUMENTO = [
  { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
  { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
  { value: 'RC', label: 'Registro Civil (RC)' },
  { value: 'PP', label: 'Pasaporte (PP)' },
];

const EMPTY_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  typeIdentityDocument: '',
  identityNumber: '',
  specialty: '',
  hireDate: '',
  isActive: true,
};

// Toma solo los campos editables del profesor (el API rechaza/ignora id, createdAt, etc.)
const toFormValues = (teacher) => {
  if (!teacher) return EMPTY_VALUES;
  const values = {};
  Object.keys(EMPTY_VALUES).forEach((k) => (values[k] = teacher[k] ?? EMPTY_VALUES[k]));
  values.hireDate = String(teacher.hireDate ?? '').slice(0, 10);
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

export default function FormTeacher({ onSuccess, teacher = null }) {
  const isEditing = !!teacher;
  const { error, createTeacher, updateTeacher } = useTeachers();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: toFormValues(teacher) });

  useEffect(() => {
    reset(toFormValues(teacher));
  }, [teacher, reset]);

  const handleFormSubmit = async (data) => {
    const payload = { ...data, phone: data.phone.trim() || null };

    const result = isEditing
      ? await updateTeacher(teacher.id, payload)
      : await createTeacher(payload);

    if (result.success) {
      if (!isEditing) reset(EMPTY_VALUES);
      if (onSuccess) onSuccess(result.data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 space-y-5"
    >
      {/* Título */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/15">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
          <i className={`fa-solid ${isEditing ? 'fa-user-pen' : 'fa-chalkboard-user'} text-emerald-900`}></i>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">
            {isEditing ? 'Editar Profesor' : 'Registrar Profesor'}
          </h3>
          <p className="text-white/60 text-xs">
            {isEditing
              ? 'Modifica los campos y guarda los cambios'
              : 'Completa todos los campos obligatorios'}
          </p>
        </div>
      </div>

      {/* Error del API (409 duplicado, 400 validación, etc.) */}
      {error && (
        <div className="rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm p-3 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i>
          {error}
        </div>
      )}

      {/* Grid de campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombres */}
        <div>
          <Label required>Nombres</Label>
          <input
            type="text"
            placeholder="Ej: Laura"
            {...register('firstName', {
              required: 'El nombre es obligatorio',
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            })}
            className={inputClass(errors.firstName)}
          />
          <FieldError error={errors.firstName} />
        </div>

        {/* Apellidos */}
        <div>
          <Label required>Apellidos</Label>
          <input
            type="text"
            placeholder="Ej: Martínez"
            {...register('lastName', {
              required: 'El apellido es obligatorio',
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            })}
            className={inputClass(errors.lastName)}
          />
          <FieldError error={errors.lastName} />
        </div>

        {/* Tipo de documento */}
        <div>
          <Label required>Tipo de documento</Label>
          <div className="relative">
            <select
              {...register('typeIdentityDocument', {
                required: 'Selecciona un tipo de documento',
              })}
              className={`${inputClass(errors.typeIdentityDocument)} appearance-none cursor-pointer`}
            >
              <option value="" className="text-gray-900">Selecciona una opción</option>
              {TIPOS_DOCUMENTO.map((tipo) => (
                <option key={tipo.value} value={tipo.value} className="text-gray-900">
                  {tipo.label}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-yellow-300 text-xs pointer-events-none"></i>
          </div>
          <FieldError error={errors.typeIdentityDocument} />
        </div>

        {/* Número de identidad */}
        <div>
          <Label required>Número de identidad</Label>
          <input
            type="text"
            placeholder="Ej: 1020304050"
            {...register('identityNumber', {
              required: 'El número de identidad es obligatorio',
              pattern: {
                value: /^[0-9A-Za-z-]+$/,
                message: 'Solo números, letras y guiones',
              },
            })}
            className={inputClass(errors.identityNumber)}
          />
          <FieldError error={errors.identityNumber} />
        </div>

        {/* Correo */}
        <div>
          <Label required>Correo electrónico</Label>
          <input
            type="email"
            placeholder="Ej: profesor@colegio.edu.co"
            {...register('email', {
              required: 'El correo es obligatorio',
              maxLength: { value: 150, message: 'Máximo 150 caracteres' },
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
            })}
            className={inputClass(errors.email)}
          />
          <FieldError error={errors.email} />
        </div>

        {/* Teléfono */}
        <div>
          <Label>Teléfono</Label>
          <input
            type="tel"
            placeholder="Ej: 3001234567"
            {...register('phone', {
              maxLength: { value: 20, message: 'Máximo 20 caracteres' },
              pattern: { value: /^[0-9+\s-]*$/, message: 'Solo números, espacios, + y -' },
            })}
            className={inputClass(errors.phone)}
          />
          <FieldError error={errors.phone} />
        </div>

        {/* Especialidad */}
        <div>
          <Label required>Especialidad</Label>
          <input
            type="text"
            placeholder="Ej: Matemáticas"
            {...register('specialty', { required: 'La especialidad es obligatoria' })}
            className={inputClass(errors.specialty)}
          />
          <FieldError error={errors.specialty} />
        </div>

        {/* Fecha de contratación */}
        <div>
          <Label required>Fecha de contratación</Label>
          <input
            type="date"
            {...register('hireDate', { required: 'La fecha de contratación es obligatoria' })}
            className={`${inputClass(errors.hireDate)} [color-scheme:dark]`}
          />
          <FieldError error={errors.hireDate} />
        </div>

        {/* Estado (solo al editar; al crear el API lo deja activo) */}
        {isEditing && (
          <label className="md:col-span-2 flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4 accent-yellow-400 cursor-pointer"
            />
            <span className="text-white/80 text-sm font-medium">Profesor activo</span>
          </label>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/15">
        <button
          type="button"
          onClick={() => reset(toFormValues(teacher))}
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
              {isEditing ? 'Actualizar' : 'Guardar Profesor'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
