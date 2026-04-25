"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, X, UploadCloud, Link as LinkIcon, ImageIcon, ChevronDown } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";

export default function ProductosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [imageType, setImageType] = useState('upload');
  const [inStock, setInStock] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // saleType para rotisería: "unidad" (ej. pizza), "docena" (empanadas), "combo" (unidad + docena)
  const [saleType, setSaleType] = useState<'unidad' | 'docena' | 'combo'>('unidad');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const { products, toggleProductStock } = useProducts();

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  type Category = {
    id: number;
    name: string;
    parentId: number | null;
  };

  const categories: Category[] = [
    { id: 1, name: "Pizzas", parentId: null },
    { id: 101, name: "Tradicionales", parentId: 1 },
    { id: 102, name: "Especiales", parentId: 1 },
    { id: 103, name: "Rellenas", parentId: 1 },
    { id: 2, name: "Empanadas", parentId: null },
    { id: 201, name: "Al Horno", parentId: 2 },
    { id: 202, name: "Fritas", parentId: 2 },
    { id: 3, name: "Sándwiches", parentId: null },
    { id: 4, name: "Bebidas", parentId: null },
  ];

  const getFlattenedCategories = (parentIdFilter: number | null, depth = 0): { cat: Category, depth: number }[] => {
    const children = categories.filter(c => c.parentId === parentIdFilter);
    let result: { cat: Category, depth: number }[] = [];
    for (const child of children) {
      result.push({ cat: child, depth });
      result = [...result, ...getFlattenedCategories(child.id, depth + 1)];
    }
    return result;
  };

  const selectableCategories = getFlattenedCategories(null);

  const saleTypeLabels: Record<string, string> = {
    unidad: "Unidad",
    docena: "Docena",
    combo: "Unidad",
  };

  return (
    <>
      <div>
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-zinc-950 p-4 rounded-2xl border border-zinc-900 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="text"
                placeholder="Buscar pizza, empanada, sándwich..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl pl-4 pr-10 py-3 appearance-none outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-bold text-zinc-300 w-full sm:w-auto"
              >
                <option value="Todas" className="bg-zinc-900 text-zinc-100">Todas las Categorías</option>
                {selectableCategories.map(({ cat, depth }) => (
                  <option key={cat.id} value={cat.name} className="bg-zinc-900 text-zinc-100">
                    {"—".repeat(depth)} {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
            </div>
          </div>
          <button
            onClick={() => {
              setIsEditing(false);
              setIsOffer(false);
              setInStock(true);
              setImageType('upload');
              setSaleType('unidad');
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-500 transition active:scale-95 whitespace-nowrap shadow-md w-full sm:w-auto shrink-0 text-sm"
          >
            <Plus size={16} />
            Nuevo Producto
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-zinc-950 rounded-2xl border border-zinc-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-[11px] uppercase tracking-wider text-zinc-500 font-semibold hidden sm:table-row">
                  <th className="p-4 pl-6 w-16">Imagen</th>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Venta</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 pr-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="group hover:bg-zinc-900/40 transition flex flex-col sm:table-row p-4 sm:p-0">
                      <td className="sm:p-4 sm:pl-6 hidden sm:table-cell">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 overflow-hidden relative border border-zinc-800">
                          <Image src={p.image} alt={p.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="sm:p-4">
                        <div className="flex items-center gap-4 sm:gap-0">
                          <div className="w-14 h-14 rounded-xl bg-zinc-900 overflow-hidden relative border border-zinc-800 sm:hidden shrink-0">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-[15px] text-zinc-100">{p.name}</p>
                            <div className="sm:hidden flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-xs font-semibold bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-400">{p.category}</span>
                              {p.isOffer && <span className="text-[10px] font-black bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full border border-orange-500/30 uppercase tracking-widest">Oferta</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="sm:p-4 hidden sm:table-cell">
                        <span className="text-xs font-bold uppercase tracking-wide bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 text-zinc-400">{p.category}</span>
                      </td>
                      <td className="sm:p-4 hidden sm:table-cell">
                        <div className="flex flex-col">
                          {p.isOffer && <span className="text-[10px] text-zinc-500 line-through font-semibold leading-none mb-0.5">{p.oldPrice}</span>}
                          <span className={`font-black ${p.isOffer ? 'text-orange-500' : 'text-zinc-100'}`}>{p.price}</span>
                          {p.pricePerHalfDozen && <span className="text-[10px] text-zinc-500 font-medium mt-0.5">Media: {p.pricePerHalfDozen}</span>}
                          {p.pricePerDozen && <span className="text-[10px] text-zinc-500 font-medium mt-0.5">Docena: {p.pricePerDozen}</span>}
                        </div>
                      </td>
                      <td className="sm:p-4 hidden sm:table-cell">
                        <span className="text-xs font-semibold bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800 text-zinc-400 capitalize">
                          {p.saleType === 'combo' ? 'Múltiple' : p.saleType}
                        </span>
                      </td>
                      <td className="sm:p-4 mt-3 sm:mt-0">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleProductStock(p.id)}
                            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${p.stock ? 'bg-green-500' : 'bg-red-500/80'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow-sm transition-transform ${p.stock ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                          </button>
                          <span className={`text-xs font-bold ${p.stock ? 'text-green-400' : 'text-red-500'}`}>{p.stock ? 'Disponible' : 'Sin Stock'}</span>
                        </div>
                      </td>
                      <td className="sm:p-4 sm:pr-6 mt-3 sm:mt-0 flex sm:table-cell justify-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setIsEditing(true);
                              setIsOffer(!!p.isOffer);
                              setInStock(p.stock);
                              setImageType('upload');
                              setSaleType(p.saleType);
                              setIsModalOpen(true);
                            }}
                            className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500 font-medium text-sm">
                      No se encontraron productos con estos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Nuevo / Editar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

          <div className="relative bg-zinc-950 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 no-scrollbar border border-zinc-900">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800 transition text-zinc-400 hover:text-white z-10"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-black mb-6 tracking-tight text-zinc-100">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Columna Izquierda */}
              <div className="lg:col-span-2 space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-3 text-zinc-400">Imagen del Producto</label>
                  <div className="flex bg-zinc-900 p-1 rounded-xl mb-3 border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setImageType('upload')}
                      className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-lg transition ${imageType === 'upload' ? 'bg-zinc-950 text-white shadow-sm border border-zinc-800' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <UploadCloud size={14} /> Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageType('url')}
                      className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-lg transition ${imageType === 'url' ? 'bg-zinc-950 text-white shadow-sm border border-zinc-800' : 'text-zinc-400 hover:text-white'}`}
                    >
                      <LinkIcon size={14} /> URL
                    </button>
                  </div>

                  {imageType === 'upload' ? (
                    <div className="border-2 border-dashed border-zinc-800 rounded-2xl aspect-[4/3] flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition cursor-pointer group">
                      <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition border border-zinc-800">
                        <UploadCloud size={20} className="text-zinc-400" />
                      </div>
                      <p className="text-sm font-bold text-zinc-300">Arrastrá una imagen</p>
                      <p className="text-xs text-zinc-500 mt-1">o hacé clic para explorar</p>
                      <p className="text-[10px] text-zinc-500 mt-3 font-semibold uppercase tracking-wider">PNG, JPG hasta 5MB</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                        <input type="text" placeholder="https://..." className="w-full pl-9 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100 placeholder:text-zinc-500" />
                      </div>
                      <div className="border border-zinc-800 rounded-2xl aspect-[4/3] flex flex-col items-center justify-center bg-zinc-900/50 overflow-hidden relative text-zinc-500">
                        <ImageIcon size={32} className="mb-2 opacity-30" />
                        <span className="text-xs font-semibold">Vista Previa</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Toggle Stock */}
                <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <div>
                    <p className={`font-bold text-sm ${inStock ? 'text-zinc-100' : 'text-red-500'}`}>{inStock ? 'Disponible' : 'Sin Stock'}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">El producto aparece en el catálogo.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInStock(!inStock)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inStock ? 'bg-green-500' : 'bg-red-500/80'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inStock ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Toggle Oferta */}
                <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <div>
                    <p className="font-bold text-sm text-zinc-100">Marcar como Oferta</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Aparece en el carrusel de ofertas.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOffer(!isOffer)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOffer ? 'bg-orange-500' : 'bg-zinc-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOffer ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              {/* Columna Derecha */}
              <div className="lg:col-span-3 space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-zinc-400">Nombre del Producto</label>
                  <input type="text" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100 placeholder:text-zinc-500" placeholder="Ej. Pizza Muzzarella Grande" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5 text-zinc-400">Descripción</label>
                  <textarea
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium resize-none h-20 text-zinc-100 placeholder:text-zinc-500"
                    placeholder="Ingredientes y detalles de preparación..."
                  ></textarea>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-zinc-400">Categoría / Subcategoría</label>
                  <div className="relative">
                    <select className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-4 pr-10 py-3 appearance-none outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100">
                      <option value="" className="bg-zinc-900 text-zinc-100">Seleccionar categoría...</option>
                      {selectableCategories.map(({ cat, depth }) => (
                        <option key={cat.id} value={cat.id} className="bg-zinc-900 text-zinc-100">
                          {"—".repeat(depth)} {cat.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Tipo de Venta — rotisería */}
                <div>
                  <label className="block text-sm font-bold mb-2 text-zinc-400">Tipo de Venta</label>
                  <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                    {(['unidad', 'docena', 'combo'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSaleType(type)}
                        className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition capitalize ${saleType === type ? 'bg-zinc-950 text-white shadow-sm border border-zinc-800' : 'text-zinc-400 hover:text-white'}`}
                      >
                        {type === 'combo' ? 'Múltiple' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1.5 leading-tight">
                    {saleType === 'unidad' && '↳ El cliente pide por unidad. Ej: 1 pizza, 2 sándwiches.'}
                    {saleType === 'docena' && '↳ El cliente pide por docena. Ej: 1 docena de empanadas.'}
                    {saleType === 'combo' && '↳ El cliente puede elegir unidad, media docena o docena.'}
                  </p>
                </div>

                {/* Precios */}
                <div className={`grid gap-4 ${saleType === 'combo' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'}`}>
                  <div>
                    <label className="block text-sm font-bold mb-1.5 text-zinc-400">
                      {saleType === 'docena' ? 'Precio por Docena' : 'Precio por Unidad'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">$</span>
                      <input type="text" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100 placeholder:text-zinc-500" placeholder="0" />
                    </div>
                  </div>
                  {saleType === 'combo' && (
                    <>
                      <div>
                        <label className="block text-sm font-bold mb-1.5 text-zinc-400">Media Docena</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">$</span>
                          <input type="text" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100 placeholder:text-zinc-500" placeholder="0" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-1.5 text-zinc-400">Docena</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">$</span>
                          <input type="text" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100 placeholder:text-zinc-500" placeholder="0" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Precio Anterior (solo si es oferta) */}
                {isOffer && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-bold mb-1.5 text-zinc-400">Precio Anterior <span className="font-normal text-zinc-500">(aparece tachado)</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">$</span>
                      <input type="text" className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100 placeholder:text-zinc-500" placeholder="0" />
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-500 transition active:scale-95 shadow-md text-sm"
                  >
                    {isEditing ? 'Guardar Cambios' : 'Guardar Producto'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
