import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

export default function LayoutBase() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bg-school-gradient min-h-screen flex">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                {/* Header */}
                <header className="m-3 mb-0 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl flex items-center gap-4">
                    {/* Botón hamburguesa solo móvil */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition"
                        aria-label="Abrir menú"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                    <div className="flex-1">
                        <h2 className="text-white font-bold text-lg">Dashboard</h2>
                        <p className="text-white/60 text-xs">Bienvenido de nuevo</p>
                    </div>

                    <button className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition">
                        <i className="fa-solid fa-bell"></i>
                    </button>
                </header>

                {/* Contenido */}
                <main className="flex-1 p-3 overflow-auto">
                    <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 min-h-[400px]">
                        {/* AQUÍ SE RENDERIZA LA PÁGINA HIJA */}
                        <Outlet />

                    </div>
                </main>
            </div>
        </div>
    )
}