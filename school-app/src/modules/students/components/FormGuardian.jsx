import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useGuardian from '../hooks/useGuardian';

// Deben coincidir con el enum de la entidad Parent en el API
const TIPOS_DOCUMENTO = [
  { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
  { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
  { value: 'RC', label: 'Registro Civil (RC)' },
  { value: 'PP', label: 'Pasaporte (PP)' },
];

const PARENTESCOS = ['Madre', 'Padre', 'Abuelo(a)', 'Tío(a)', 'Hermano(a)', 'Otro'];

const EMPTY_VALUES = {
  name: '',
  relationship: '',
  type_identity_document: '',
  identity_number: '',
  phone: '',
  email: '',
  address: '',
  occupation: '',
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

export default function FormGuardian({ studentId, guardian = null, onSuccess, onCancel }) {
  const isEditing = !!guardian;
  const { error, createGuardian, updateGuardian } = useGuardian();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY_VALUES });

  // Precarga los datos del acudiente al editar (null -> '' para inputs controlados)
  useEffect(() => {
    if (guardian) {
      const values = {};
      Object.keys(EMPTY_VALUES).forEach((k) => (values[k] = guardian[k] ?? ''));
      reset(values);
    } else {
      reset(EMPTY_VALUES);
    }
  }, [guardian, reset]);

  const handleFormSubmit = async (data) => {
    const result = isEditing
      ? await updateGuardian(guardian.id, data)
      : await createGuardian(studentId, data);

    if (result.success && onSuccess) onSuccess(result.data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Título */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/15">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
          <i className={`fa-solid ${isEditing ? 'fa-user-pen' : 'fa-user-shield'} text-emerald-900`}></i>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">
            {isEditing ? 'Editar Acudiente' : 'Registrar Acudiente'}
          </h3>
          <p className="text-white/60 text-xs">
            {isEditing
              ? 'Modifica los campos y guarda los cambios'
              : 'Completa todos los campos obligatorios'}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm p-3 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i>
          {Array.isArray(error) ? error.join(', ') : error}
        </div>
      )}

      {/* Grid de campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">
            Nombre completo <span className="text-yellow-300">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: María Gómez"
            {...register('name', {
              required: 'El nombre es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            })}
            className={inputClass(errors.name)}
          />
          <FieldError error={errors.name} />
        </div>

        {/* Parentesco */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">
            Parentesco <span className="text-yellow-300">*</span>
          </label>
          <div className="relative">
            <select
              {...register('relationship', { required: 'Selecciona el parentesco' })}
              className={`${inputClass(errors.relationship)} appearance-none cursor-pointer`}
            >
              <option value="" className="text-gray-900">Selecciona una opción</option>
              {PARENTESCOS.map((p) => (
                <option key={p} value={p} className="text-gray-900">{p}</option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-yellow-300 text-xs pointer-events-none"></i>
          </div>
          <FieldError error={errors.relationship} />
        </div>

        {/* Tipo de documento */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">
            Tipo de documento <span className="text-yellow-300">*</span>
          </label>
          <div className="relative">
            <select
              {...register('type_identity_document', {
                required: 'Selecciona un tipo de documento',
              })}
              className={`${inputClass(errors.type_identity_document)} appearance-none cursor-pointer`}
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
          <FieldError error={errors.type_identity_document} />
        </div>

        {/* Número de identidad */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">
            Número de identidad <span className="text-yellow-300">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: 1234567890"
            {...register('identity_number', {
              required: 'El número de identidad es obligatorio',
              pattern: {
                value: /^[0-9A-Za-z-]+$/,
                message: 'Solo números, letras y guiones',
              },
            })}
            className={inputClass(errors.identity_number)}
          />
          <FieldError error={errors.identity_number} />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">Teléfono</label>
          <input
            type="tel"
            placeholder="Ej: 3001234567"
            {...register('phone', {
              pattern: { value: /^[0-9+\s-]{7,15}$/, message: 'Teléfono no válido' },
            })}
            className={inputClass(errors.phone)}
          />
          <FieldError error={errors.phone} />
        </div>

        {/* Correo */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">Correo electrónico</label>
          <input
            type="email"
            placeholder="Ej: acudiente@correo.com"
            {...register('email', {
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
            })}
            className={inputClass(errors.email)}
          />
          <FieldError error={errors.email} />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">Dirección</label>
          <input
            type="text"
            placeholder="Ej: Calle 10 # 5-20"
            {...register('address')}
            className={inputClass(errors.address)}
          />
        </div>

        {/* Ocupación */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">Ocupación</label>
          <input
            type="text"
            placeholder="Ej: Docente"
            {...register('occupation')}
            className={inputClass(errors.occupation)}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/15">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium
                       border border-white/20 transition"
          >
            <i className="fa-solid fa-xmark mr-2"></i>
            Cancelar
          </button>
        )}
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
              {isEditing ? 'Actualizar' : 'Guardar Acudiente'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
