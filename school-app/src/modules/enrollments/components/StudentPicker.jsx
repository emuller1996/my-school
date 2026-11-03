import { useEffect, useRef, useState } from 'react';
import api from '../../../utils/axios';

// Buscador de estudiantes contra GET /students?name= (con debounce).
// `value` es el estudiante seleccionado ({ id, name, code, ... }) o null.
export default function StudentPicker({ value, onChange, disabled = false, hasError = false }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const term = query.trim();
        const { data } = await api.get('/students', {
          params: term ? { search: term } : {},
          signal: controller.signal,
        });
        setResults((Array.isArray(data) ? data : data.data || []).slice(0, 8));
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') setResults([]);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  // Cierra la lista al hacer clic fuera
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const select = (student) => {
    onChange(student);
    setQuery('');
    setOpen(false);
  };

  // Estudiante ya elegido: se muestra como "chip" con opción de cambiarlo
  if (value) {
    return (
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 border
          ${hasError ? 'border-red-400/70' : 'border-white/20'}`}
      >
        <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-200 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-user-graduate text-xs"></i>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-medium truncate">{value.name}</p>
          <p className="text-white/50 text-xs truncate">
            Código {value.code} · {value.typeIdentityDocument} {value.identityNumber}
          </p>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => onChange(null)}
            title="Cambiar estudiante"
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300 text-xs"></i>
      <input
        type="text"
        value={query}
        disabled={disabled}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        placeholder="Buscar por nombre, código o documento..."
        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border text-white placeholder-white/40
          focus:outline-none focus:ring-2 focus:ring-yellow-300/60 transition
          ${hasError ? 'border-red-400/70' : 'border-white/20'}`}
      />

      {open && (
        <ul className="absolute z-20 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-white/20
                       bg-emerald-950/95 backdrop-blur-xl shadow-2xl py-1">
          {searching ? (
            <li className="px-4 py-3 text-white/60 text-sm">
              <i className="fa-solid fa-spinner fa-spin mr-2 text-yellow-300"></i>
              Buscando...
            </li>
          ) : results.length === 0 ? (
            <li className="px-4 py-3 text-white/60 text-sm">No se encontraron estudiantes</li>
          ) : (
            results.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => select(s)}
                  className="w-full text-left px-4 py-2 hover:bg-white/10 transition"
                >
                  <p className="text-white text-sm">{s.name}</p>
                  <p className="text-white/50 text-xs">
                    Código {s.code} · {s.typeIdentityDocument} {s.identityNumber}
                  </p>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
