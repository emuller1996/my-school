import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStudent from '../../hooks/useStudent';
import Tabs from '../../../../components/Tabs';

const TABS = [
  { id: 'basic', label: 'Información básica', icon: 'fa-solid fa-id-card' },
  { id: 'guardian', label: 'Acudiente', icon: 'fa-solid fa-user-shield' },
];

// Etiqueta legible para el tipo de documento
const DOC_LABELS = {
  TI: 'Tarjeta de Identidad',
  CC: 'Cédula de Ciudadanía',
  RC: 'Registro Civil',
  CE: 'Cédula de Extranjería',
  PA: 'Pasaporte',
};



export default function StudenDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { student, loading, error } = useStudent(id);
  const [activeTab, setActiveTab] = useState('basic');

  if (loading) {
    return (
      <div className="text-white/70 text-sm text-center py-12">
        <i className="fa-solid fa-spinner fa-spin text-2xl block mb-2 text-yellow-300"></i>
        Cargando estudiante...
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm p-4 flex items-center gap-2">
        <i className="fa-solid fa-circle-exclamation"></i>
        {error || 'Estudiante no encontrado'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con botón volver */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/students')}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20
                     text-white flex items-center justify-center transition"
          title="Volver al listado"
        >
          <i className="fa-solid fa-arrow-left text-sm"></i>
        </button>
        <div>
          <h3 className="text-white font-semibold text-xl">{student.name}</h3>
          <p className="text-white/60 text-xs">
            Código: {student.code} · {DOC_LABELS[student.typeIdentityDocument] || student.typeIdentityDocument} {student.identityNumber}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {/* Contenido */}
      <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6">
        {activeTab === 'basic' && <BasicInfo student={student} />}
        {activeTab === 'guardian' && <GuardianInfo student={student} />}
      </div>
    </div>
  );
}

/* ---------- Tab: Información básica ---------- */
function BasicInfo({ student }) {
  const fields = [
    { label: 'Código', value: student.code, icon: 'fa-solid fa-hashtag' },
    { label: 'Nombre completo', value: student.name, icon: 'fa-solid fa-user' },
    {
      label: 'Tipo de documento',
      value: DOC_LABELS[student.typeIdentityDocument] || student.typeIdentityDocument,
      icon: 'fa-solid fa-id-card',
    },
    { label: 'Número de identidad', value: student.identityNumber, icon: 'fa-solid fa-hashtag' },
    { label: 'Fecha de nacimiento', value: student.birthdate, icon: 'fa-solid fa-calendar-days' },
    {
      label: 'Nota',
      value: student.note || '—',
      icon: 'fa-solid fa-star',
      highlight: !!student.note,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map((f) => (
        <div
          key={f.label}
          className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="w-9 h-9 rounded-lg bg-yellow-400/20 text-yellow-200 flex items-center justify-center shrink-0">
            <i className={`${f.icon} text-sm`}></i>
          </div>
          <div className="min-w-0">
            <p className="text-white/60 text-xs">{f.label}</p>
            <p className={`text-sm font-medium truncate ${f.highlight ? 'text-yellow-200' : 'text-white'}`}>
              {f.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Tab: Acudiente ---------- */
function GuardianInfo({ student }) {
  const guardian = student.guardian || {}; // asumiendo que tu API lo devuelve como objeto anidado

  const fields = [
    { label: 'Nombre del acudiente', value: guardian.name, icon: 'fa-solid fa-user' },
    { label: 'Parentesco', value: guardian.relationship, icon: 'fa-solid fa-people-roof' },
    { label: 'Teléfono', value: guardian.phone, icon: 'fa-solid fa-phone' },
    { label: 'Correo electrónico', value: guardian.email, icon: 'fa-solid fa-envelope' },
    { label: 'Dirección', value: guardian.address, icon: 'fa-solid fa-location-dot' },
    { label: 'Ocupación', value: guardian.occupation, icon: 'fa-solid fa-briefcase' },
  ];

  const hasData = fields.some((f) => f.value);

  if (!hasData) {
    return (
      <div className="text-center py-10">
        <i className="fa-solid fa-user-shield text-3xl block mb-2 text-yellow-300/60"></i>
        <p className="text-white/60 text-sm">Este estudiante no tiene acudiente registrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map(
        (f) =>
          f.value && (
            <div
              key={f.label}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-400/20 text-emerald-200 flex items-center justify-center shrink-0">
                <i className={`${f.icon} text-sm`}></i>
              </div>
              <div className="min-w-0">
                <p className="text-white/60 text-xs">{f.label}</p>
                <p className="text-white text-sm font-medium truncate">{f.value}</p>
              </div>
            </div>
          )
      )}
    </div>
  );
}