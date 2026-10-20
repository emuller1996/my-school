export default function Dashboard() {
    return (
        <div>
            <h3 className="text-white font-semibold text-xl mb-2">
                Bienvenido al Panel Académico
            </h3>
            <p className="text-white/70 text-sm">
                Selecciona <span className="text-yellow-300 font-medium">Académico</span> en el menú
                para gestionar estudiantes y profesores.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[
                    { icon: 'fa-user-graduate', label: 'Estudiantes', value: '1,240', color: 'from-emerald-400 to-emerald-600' },
                    { icon: 'fa-chalkboard-user', label: 'Profesores', value: '86', color: 'from-yellow-400 to-amber-500' },
                    { icon: 'fa-book', label: 'Cursos', value: '42', color: 'from-teal-400 to-emerald-600' },
                ].map((c) => (
                    <div
                        key={c.label}
                        className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4 flex items-center gap-3 hover:bg-white/15 transition"
                    >
                        <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                            <i className={`fa-solid ${c.icon} text-white`}></i>
                        </div>
                        <div>
                            <p className="text-white/70 text-xs">{c.label}</p>
                            <p className="text-white font-bold text-xl">{c.value}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Aquí van tus tarjetas de estadísticas */}
        </div>
    );
}