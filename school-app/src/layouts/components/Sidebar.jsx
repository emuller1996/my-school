import { useState } from 'react';
import { menuItems } from '../menu';
import { Link } from 'react-router-dom';

export default function Sidebar({ open, onClose }) {
    const [openAcademico, setOpenAcademico] = useState(true);

    return (
        <>
            {/* Overlay móvil */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Sidebar */}
            <aside
                className={`
    fixed top-0 left-0 h-screen w-72 z-50
    transform transition-transform duration-300 ease-in-out
    ${open ? 'translate-x-0' : '-translate-x-full'}
    lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto lg:h-screen
    flex flex-col shrink-0
  `}
            >
                {/* Panel con efecto glass */}
                <div className="m-3 flex-1 flex flex-col rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                    {/* Logo / Título */}
                    <div className="px-5 py-6 border-b border-white/15 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg">
                            <i className="fa-solid fa-school text-emerald-900 text-lg"></i>
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-tight">Mi Colegio</h1>
                            <p className="text-yellow-300/90 text-xs font-medium tracking-wide">
                                Panel Académico
                            </p>
                        </div>
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const hasChildren = !!item.children;
                            const isOpen = openAcademico && item.id === 'academico';

                            return (
                                <div key={item.id}>
                                    <button
                                        onClick={() =>
                                            hasChildren
                                                ? setOpenAcademico(!openAcademico)
                                                : null
                                        }
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/90
                               hover:bg-white/15 hover:text-white
                               transition-all duration-200 group"
                                    >
                                        <i
                                            className={`${item.icon} w-5 text-center text-yellow-300 group-hover:text-yellow-200`}
                                        ></i>
                                        {item.to ? (
                                            <Link to={item.to}>
                                                <span className="flex-1 text-left text-sm font-medium">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        ) : (
                                            <span className="flex-1 text-left text-sm font-medium">
                                                {item.label}
                                            </span>
                                        )}
                                        {hasChildren && (
                                            <i
                                                className={`fa-solid fa-chevron-down text-xs text-white/70 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                                                    }`}
                                            ></i>
                                        )}
                                    </button>

                                    {/* Submenú */}
                                    {hasChildren && (
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="ml-4 pl-3 border-l border-yellow-400/40 space-y-1">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.id}
                                                        to={child.to} // <-- Ruta destino
                                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/80 hover:bg-white/15 hover:text-white hover:translate-x-1 transition-all duration-200 text-sm"
                                                        onClick={onClose} // Opcional: cerrar sidebar en móvil al hacer clic
                                                    >
                                                        <i className={`${child.icon} w-4 text-center text-yellow-300/90 text-xs`}></i>
                                                        <span>{child.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Footer del sidebar */}
                    <div className="px-4 py-4 border-t border-white/15">
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-emerald-900 font-bold text-sm">
                                AD
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-semibold truncate">Admin</p>
                                <p className="text-white/60 text-xs truncate">admin@colegio.edu</p>
                            </div>
                            <button className="text-white/60 hover:text-yellow-300 transition">
                                <i className="fa-solid fa-right-from-bracket text-sm"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}


