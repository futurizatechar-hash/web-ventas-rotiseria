"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, FolderTree, CornerDownRight } from "lucide-react";

type Category = {
  id: number;
  name: string;
  parentId: number | null;
};

const CategoryNode = ({ category, allCategories, onEdit, onDelete, depth = 0 }: { category: Category, allCategories: Category[], onEdit: (cat: Category) => void, onDelete: (id: number) => void, depth?: number }) => {
  const children = allCategories.filter(c => c.parentId === category.id);
  
  return (
    <div className="group">
      <div className={`flex items-center justify-between border transition rounded-xl ${depth === 0 ? 'border-zinc-900 bg-zinc-900/50 p-4 hover:border-zinc-800' : 'bg-zinc-950 border-zinc-900 p-3 hover:border-zinc-800'}`}>
        <div className={`flex items-center gap-3 ${depth > 0 ? 'text-zinc-400' : ''}`}>
          {depth > 0 && <CornerDownRight size={14} className="text-zinc-600" />}
          <span className={`font-bold ${depth > 0 ? 'text-sm text-zinc-300' : 'text-[15px] text-zinc-100'}`}>{category.name}</span>
          {children.length > 0 && depth === 0 && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-zinc-950 text-zinc-500 border border-zinc-900 px-2 py-0.5 rounded-full">
              {children.length} sub
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(category)} className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(category.id)} className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      {children.length > 0 && (
        <div className="pl-6 ml-4 border-l border-zinc-900 mt-2 space-y-2 py-1">
          {children.map((child) => (
            <CategoryNode 
              key={child.id} 
              category={child} 
              allCategories={allCategories} 
              onEdit={onEdit} 
              onDelete={onDelete}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Pizzas", parentId: null },
    { id: 101, name: "Tradicionales", parentId: 1 },
    { id: 102, name: "Especiales", parentId: 1 },
    { id: 103, name: "Rellenas", parentId: 1 },
    { id: 2, name: "Empanadas", parentId: null },
    { id: 201, name: "Al Horno", parentId: 2 },
    { id: 202, name: "Fritas", parentId: 2 },
    { id: 3, name: "Sándwiches", parentId: null },
    { id: 4, name: "Bebidas", parentId: null },
    { id: 5, name: "Promos", parentId: null },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);

  const mainCategories = categories.filter(c => c.parentId === null);

  const openCreateModal = () => {
    setModalMode('create');
    setCurrentId(null);
    setName('');
    setParentId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setModalMode('edit');
    setCurrentId(cat.id);
    setName(cat.name);
    setParentId(cat.parentId);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const getDescendants = (catId: number): number[] => {
      const children = categories.filter(c => c.parentId === catId).map(c => c.id);
      return children.reduce((acc, childId) => [...acc, ...getDescendants(childId)], children);
    };
    const idsToDelete = [id, ...getDescendants(id)];
    setCategories(categories.filter(c => !idsToDelete.includes(c.id)));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (modalMode === 'create') {
      const newId = Math.max(...categories.map(c => c.id), 0) + 1;
      setCategories([...categories, { id: newId, name, parentId }]);
    } else {
      setCategories(categories.map(c => c.id === currentId ? { ...c, name, parentId } : c));
    }
    setIsModalOpen(false);
  };

  const getDescendants = (id: number): number[] => {
    const children = categories.filter(c => c.parentId === id).map(c => c.id);
    return children.reduce((acc, childId) => [...acc, ...getDescendants(childId)], children);
  };
  
  const invalidParentIds = currentId ? [currentId, ...getDescendants(currentId)] : [];
  
  const getFlattenedCategories = (parentIdFilter: number | null, depth = 0): { cat: Category, depth: number }[] => {
    const children = categories.filter(c => c.parentId === parentIdFilter);
    let result: { cat: Category, depth: number }[] = [];
    for (const child of children) {
      if (!invalidParentIds.includes(child.id)) {
        result.push({ cat: child, depth });
        result = [...result, ...getFlattenedCategories(child.id, depth + 1)];
      }
    }
    return result;
  };

  const selectableParents = getFlattenedCategories(null);

  return (
    <>
      <div>
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-zinc-950 p-4 rounded-2xl border border-zinc-900 shadow-sm">
          <div className="flex items-center gap-3 pl-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0 border border-zinc-800">
               <FolderTree size={18} />
            </div>
            <div>
              <h2 className="font-black text-base tracking-tight text-zinc-100">Clasificación de Catálogo</h2>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">Organiza tus productos en infinitas subcategorías</p>
            </div>
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-500 transition active:scale-95 whitespace-nowrap shadow-md text-sm"
          >
            <Plus size={16} />
            Nueva Categoría
          </button>
        </div>

        {/* Tree View */}
        <div className="bg-zinc-950 rounded-2xl border border-zinc-900 p-6 shadow-sm">
           <div className="space-y-4">
             {mainCategories.map((mainCat) => (
               <CategoryNode 
                 key={mainCat.id} 
                 category={mainCat} 
                 allCategories={categories} 
                 onEdit={openEditModal} 
                 onDelete={handleDelete} 
               />
             ))}

             {mainCategories.length === 0 && (
               <div className="text-center py-12 text-zinc-500 font-medium text-sm">
                 No hay categorías creadas aún.
               </div>
             )}
           </div>
        </div>

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-zinc-950 rounded-2xl w-full max-w-sm shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 border border-zinc-900">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-900 hover:bg-zinc-800 transition text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>
            
            <h2 className="text-xl font-black mb-6 tracking-tight text-zinc-100">
              {modalMode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
            </h2>
            
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-bold mb-1.5 text-zinc-400">Nombre</label>
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium text-zinc-100 placeholder:text-zinc-500" 
                   placeholder="Ej. Hamburguesas" 
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-bold mb-1.5 text-zinc-400">Categoría Padre</label>
                 <select 
                   value={parentId === null ? "" : parentId}
                   onChange={(e) => setParentId(e.target.value === "" ? null : Number(e.target.value))}
                   className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-transparent focus:ring-2 focus:ring-orange-500 transition text-sm font-medium appearance-none text-zinc-100"
                 >
                   <option value="">Ninguna (Es categoría principal)</option>
                   {selectableParents.map(({ cat, depth }) => (
                     <option key={cat.id} value={cat.id}>
                       {"—".repeat(depth)} {cat.name}
                     </option>
                   ))}
                 </select>
               </div>

               <div className="pt-2">
                 <button 
                   onClick={handleSave}
                   disabled={!name.trim()}
                   className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl hover:bg-orange-500 transition active:scale-95 shadow-md disabled:opacity-50 disabled:active:scale-100 text-sm"
                 >
                   {modalMode === 'create' ? 'Crear Categoría' : 'Guardar Cambios'}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
