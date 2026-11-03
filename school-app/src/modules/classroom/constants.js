// Mismos valores que CLASSROOM_STATUSES en el API
export const CLASSROOM_STATUSES = [
  { value: 'disponible', label: 'Disponible', className: 'bg-emerald-400/20 text-emerald-200' },
  { value: 'ocupado', label: 'Ocupado', className: 'bg-orange-400/20 text-orange-200' },
];

export const statusOf = (value) =>
  CLASSROOM_STATUSES.find((s) => s.value === value) || { value, label: value, className: 'bg-white/10 text-white/60' };
