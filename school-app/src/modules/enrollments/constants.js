// Deben coincidir con los enums de la entidad Enrollment en el API
export const GRADES = [
  { value: 'primero', label: 'Primero' },
  { value: 'segundo', label: 'Segundo' },
  { value: 'tercero', label: 'Tercero' },
  { value: 'cuarto', label: 'Cuarto' },
  { value: 'quinto', label: 'Quinto' },
  { value: 'sexto', label: 'Sexto' },
  { value: 'séptimo', label: 'Séptimo' },
  { value: 'octavo', label: 'Octavo' },
  { value: 'noveno', label: 'Noveno' },
  { value: 'décimo', label: 'Décimo' },
  { value: 'once', label: 'Once' },
];

export const STATUSES = [
  { value: 'activa', label: 'Activa', className: 'bg-emerald-400/20 text-emerald-200' },
  { value: 'retirada', label: 'Retirada', className: 'bg-red-400/20 text-red-200' },
  { value: 'finalizada', label: 'Finalizada', className: 'bg-sky-400/20 text-sky-200' },
];

export const gradeLabel = (value) => GRADES.find((g) => g.value === value)?.label || value;
export const statusOf = (value) => STATUSES.find((s) => s.value === value) || STATUSES[0];

export const currentYear = () => new Date().getFullYear();

// Fecha local en formato YYYY-MM-DD (toISOString usaría UTC y podría dar el día siguiente)
export const todayISO = () => new Date().toLocaleDateString('en-CA');
