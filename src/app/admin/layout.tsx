"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, FolderTree, LogOut, LayoutDashboard, Menu, X, MapPin } from "lucide-react";

const navItems = [
  { name: "Panel de control", href: "/admin", icon: LayoutDashboard, exact: true },
  { name: "Productos", href: "/admin/productos", icon: Package, exact: false },
  { name: "Categorías", href: "/admin/categorias", icon: FolderTree, exact: true },
  { name: "Zonas de Envío", href: "/admin/envios", icon: MapPin, exact: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="fixed-layout bg-zinc-950 text-zinc-50 font-sans">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 w-64 h-screen border-r border-zinc-900 bg-zinc-950 p-6 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.jpg" alt="Quadra Pizza Logo" width={32} height={32} className="rounded-lg object-cover shadow-md" />
            <span className="font-black text-xl tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
          </div>
          <button className="lg:hidden p-2 text-zinc-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm ${
                  isActive
                    ? "bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Usuario Sesión */}
        <div className="pt-6 border-t border-zinc-900 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 shadow-inner flex items-center justify-center text-white font-black text-lg">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">Admin</span>
                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mt-0.5">Gestor</span>
              </div>
            </div>
            <button
              title="Cerrar Sesión"
              onClick={handleLogout}
              className="p-2 text-zinc-500 hover:text-orange-500 hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 h-full bg-[#0a0a0b] flex flex-col overflow-hidden">
        {/* Navbar Movil */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-900 z-30">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="rounded-lg object-cover" />
            <span className="font-black text-xl tracking-tight">Quadra <span className="text-orange-500">Pizza</span></span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-zinc-900 rounded-lg text-zinc-400 active:scale-95 transition-transform">
            <Menu size={22} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 pb-32 no-scrollbar">
          {children}
        </div>
      </main>

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}
