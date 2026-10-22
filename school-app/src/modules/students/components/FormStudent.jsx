import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useStudents from '../hooks/useStudents';

const TIPOS_DOCUMENTO = [
  { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
  { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
  { value: 'RC', label: 'Registro Civil (RC)' },
  { value: 'CE', label: 'Cédula de Extranjería (CE)' },
  { value: 'PA', label: 'Pasaporte (PA)' },
];

const EMPTY_VALUES = {
  code: '',
  name: '',
  note: '',
  birthdate: '',
  typeIdentityDocument: '',
  identityNumber: '',
};

export default function FormStudent({
  onSuccess,
  defaultValues,
  isEditing = false,
  studentId = null,
}) {
  const { createStudent, updateStudent } = useStudents();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: defaultValues || EMPTY_VALUES });

  // Si cambia el estudiante a editar (o se abre el modal), precarga datos
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
    else reset(EMPTY_VALUES);
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data) => {
    // Normaliza birthdate a YYYY-MM-DD (el input date lo devuelve así, pero por si acaso)
    const payload = {
      ...data,
      note: data.note ?? '',
    };

    const result = isEditing
      ? await updateStudent(studentId, payload)
      : await createStudent(payload);

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
          <i
            className={`fa-solid ${isEditing ? 'fa-user-pen' : 'fa-user-plus'
              } text-emerald-900`}
          ></i>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">
            {isEditing ? 'Editar Estudiante' : 'Registrar Estudiante'}
          </h3>
          <p className="text-white/60 text-xs">
            {isEditing
              ? 'Modifica los campos y guarda los cambios'
              : 'Completa todos los campos obligatorios'}
          </p>
        </div>
      </div>

      {/* Grid de campos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Código */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">
            Código <span className="text-yellow-300">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: EST-001"
            {...register('code', {
              required: 'El código es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            })}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/10 border text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition
              ${errors.code ? 'border-red-400/70' : 'border-white/20'}`}
          />
          {errors.code && (
            <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.code.message}
            </p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">
            Nombre completo <span className="text-yellow-300">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            {...register('name', {
              required: 'El nombre es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            })}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/10 border text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition
              ${errors.name ? 'border-red-400/70' : 'border-white/20'}`}
          />
          {errors.name && (
            <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Tipo de documento */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">
            Tipo de documento <span className="text-yellow-300">*</span>
          </label>
          <div className="relative">
            <select
              {...register('typeIdentityDocument', {
                required: 'Selecciona un tipo de documento',
              })}
              className={`w-full appearance-none px-4 py-2.5 rounded-xl bg-white/10 border text-white
                focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition cursor-pointer
                ${errors.typeIdentityDocument ? 'border-red-400/70' : 'border-white/20'}`}
            >
              <option value="" className="text-gray-900">
                Selecciona una opción
              </option>
              {TIPOS_DOCUMENTO.map((tipo) => (
                <option key={tipo.value} value={tipo.value} className="text-gray-900">
                  {tipo.label}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-yellow-300 text-xs pointer-events-none"></i>
          </div>
          {errors.typeIdentityDocument && (
            <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.typeIdentityDocument.message}
            </p>
          )}
        </div>

        {/* Número de identidad */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">
            Número de identidad <span className="text-yellow-300">*</span>
          </label>
          <input
            type="text"
            placeholder="Ej: 1234567890"
            {...register('identityNumber', {
              required: 'El número de identidad es obligatorio',
              pattern: {
                value: /^[0-9A-Za-z-]+$/,
                message: 'Solo números, letras y guiones',
              },
            })}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/10 border text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition
              ${errors.identityNumber ? 'border-red-400/70' : 'border-white/20'}`}
          />
          {errors.identityNumber && (
            <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.identityNumber.message}
            </p>
          )}
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">
            Fecha de nacimiento <span className="text-yellow-300">*</span>
          </label>
          <input
            type="date"
            {...register('birthdate', {
              required: 'La fecha de nacimiento es obligatoria',
            })}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/10 border text-white
              focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition
              [color-scheme:dark]
              ${errors.birthdate ? 'border-red-400/70' : 'border-white/20'}`}
          />
          {errors.birthdate && (
            <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.birthdate.message}
            </p>
          )}
        </div>

        {/* Nota */}
        <div>
          <label className="block text-white/80 text-sm font-medium mb-1.5">Nota</label>
          <input
            type="text"
            placeholder="Ej: 4.5"
            {...register('note', {
            })}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/10 border text-white placeholder-white/40
              focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition
              ${errors.note ? 'border-red-400/70' : 'border-white/20'}`}
          />
          {errors.note && (
            <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
              <i className="fa-solid fa-circle-exclamation"></i>
              {errors.note.message}
            </p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/15">
        <button
          type="button"
          onClick={() => reset(defaultValues || EMPTY_VALUES)}
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
              {isEditing ? 'Actualizar' : 'Guardar Estudiante'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}