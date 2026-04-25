"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, X, MapPin, DollarSign } from "lucide-react";
import { useProducts, Neighborhood } from "@/context/ProductsContext";

export default function EnviosPage() {
  const { neighborhoods, setNeighborhoods } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [deliveryCost, setDeliveryCost] = useState("");

  const filteredNeighborhoods = neighborhoods.filter(n => 
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openNewModal = () => {
    setEditingId(null);
    setName("");
    setDeliveryCost("");
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (n: Neighborhood) => {
    setEditingId(n.id);
    setName(n.name);
    setDeliveryCost(n.deliveryCost.toString());
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !deliveryCost.trim()) return;

    const costNumber = parseInt(deliveryCost.replace(/\D/g, ''), 10) || 0;

    if (isEditing && editingId) {
      setNeighborhoods(neighborhoods.map(n => 
        n.id === editingId ? { ...n, name, deliveryCost: costNumber } : n
      ));
    } else {
      const newId = Math.max(0, ...neighborhoods.map(n => n.id)) + 1;
      setNeighborhoods([...neighborhoods, { id: newId, name, deliveryCost: costNumber }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta zona de envío?")) {
      setNeighborhoods(neighborhoods.filter(n => n.id !== id));
    }
  };

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">Zonas de Envío</h1>
          <p className="text-zinc-400 font-medium">Gestiona los barrios y costos de delivery.</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 active:scale-95 whitespace-nowrap"
        >
          <Plus size={20} /> Nueva Zona
        </button>
      </div>

      {/* Controles: Búsqueda */}
      <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 mb-8 backdrop-blur-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar zona o barrio..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition font-medium text-sm text-zinc-100 placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Grid de Zonas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNeighborhoods.map((n) => (
          <div key={n.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 flex flex-col justify-between group hover:border-zinc-700 transition">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold text-lg text-zinc-100">{n.name}</h3>
              </div>
              <p className="text-3xl font-black text-white mb-4">
                {formatPrice(n.deliveryCost)}
              </p>
            </div>
            
            <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/50 mt-auto">
              <button 
                onClick={() => openEditModal(n)}
                className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-xs font-bold transition"
              >
                <Edit2 size={14} /> Editar
              </button>
              <button 
                onClick={() => handleDelete(n.id)}
                className="w-10 flex items-center justify-center bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 py-2 rounded-lg transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {filteredNeighborhoods.length === 0 && (
          <div className="col-span-full py-12 text-center bg-zinc-900/20 border border-zinc-800/50 rounded-2xl border-dashed">
            <MapPin size={48} className="mx-auto text-zinc-600 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-zinc-300 mb-2">No se encontraron zonas</h3>
            <p className="text-zinc-500 max-w-md mx-auto">
              No hay zonas de envío configuradas o ninguna coincide con tu búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Modal Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-900">
              <h2 className="text-xl font-black tracking-tight">{isEditing ? 'Editar Zona' : 'Nueva Zona de Envío'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-bold mb-2 text-zinc-400">Nombre del Barrio / Zona</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100 placeholder:text-zinc-600" 
                    placeholder="Ej: Nueva Córdoba" 
                  />
                </div>
              </div>

              {/* Costo de Envío */}
              <div>
                <label className="block text-sm font-bold mb-2 text-zinc-400">Costo de Envío</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                  <input 
                    type="text" 
                    value={deliveryCost}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setDeliveryCost(val ? new Intl.NumberFormat('es-AR').format(parseInt(val)) : '');
                    }}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100 placeholder:text-zinc-600" 
                    placeholder="1500" 
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5 leading-tight">Este monto se sumará automáticamente al pedido cuando el cliente seleccione este barrio.</p>
              </div>
            </div>

            <div className="p-6 border-t border-zinc-900 bg-zinc-950/50">
              <button 
                onClick={handleSave}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition active:scale-95 shadow-lg shadow-orange-900/20"
              >
                {isEditing ? 'Guardar Cambios' : 'Crear Zona'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
