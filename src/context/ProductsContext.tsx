"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: string;
  oldPrice?: string;
  estimatedUnitPrice?: string;
  category: string;
  categoryId?: number;
  stock: boolean;
  image: string;
  isOffer: boolean;
  saleType: "peso" | "unidad" | "ambos";
};

type ProductsContextType = {
  products: Product[];
  toggleProductStock: (id: number) => void;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Muzzarella Clásica", description: "Salsa de tomate, abundante muzzarella, orégano y aceitunas.", price: "$6.500", category: "Pizzas", categoryId: 101, stock: true, image: "/1.png", isOffer: false, saleType: "unidad" },
    { id: 2, name: "Empanada de Carne Cortada a Cuchillo", description: "Carne seleccionada, cebolla, morrón y huevo duro.", price: "$8.500", estimatedUnitPrice: "$850", category: "Empanadas", categoryId: 2, stock: true, image: "/2.png", isOffer: false, saleType: "ambos" },
    { id: 3, name: "Pizza Napolitana", description: "Muzzarella, rodajas de tomate, ajo y perejil fresco.", price: "$7.800", category: "Pizzas", categoryId: 101, stock: false, image: "/3.png", isOffer: false, saleType: "unidad" },
    { id: 4, name: "Docena de Empanadas (Mix)", description: "Llevá 12 y combiná los sabores como quieras.", price: "$9.500", category: "Promos", categoryId: 3, stock: true, image: "/4.png", isOffer: false, saleType: "unidad" },
    { id: 5, name: "Pizza Especial de Jamón y Morrones", description: "Muzzarella, jamón cocido natural y morrones asados.", price: "$8.200", category: "Pizzas", categoryId: 102, stock: true, image: "/5.png", isOffer: false, saleType: "unidad" },
    { id: 6, name: "Empanada de Jamón y Queso", description: "El clásico de siempre, jugosa y llena de sabor.", price: "$8.000", estimatedUnitPrice: "$800", category: "Empanadas", categoryId: 2, stock: true, image: "/2.png", isOffer: false, saleType: "ambos" },
    { id: 7, name: "Papas Cheddar y Bacon", description: "Papas fritas crujientes con salsa cheddar y panceta crocante.", price: "$5.500", category: "Acompañamientos", categoryId: 4, stock: true, image: "/1.png", isOffer: false, saleType: "unidad" },
    { id: 8, name: "Fainá", description: "Porción de fainá clásica, ideal para acompañar tu pizza.", price: "$1.200", category: "Pizzas", categoryId: 103, stock: true, image: "/3.png", isOffer: false, saleType: "unidad" },
    { id: 101, name: "Pizza Calabresa", description: "Muzzarella y rodajas de longaniza calabresa.", price: "$7.500", oldPrice: "$8.900", category: "Pizzas", categoryId: 102, stock: true, image: "/1.png", isOffer: true, saleType: "unidad" },
    { id: 102, name: "Promo 2 Muzzarellas", description: "Doble disfrute para compartir en familia.", price: "$11.000", oldPrice: "$13.000", category: "Promos", categoryId: 3, stock: true, image: "/3.png", isOffer: true, saleType: "unidad" },
    { id: 103, name: "Sándwich de Milanesa Completo", description: "Lechuga, tomate, jamón, queso y huevo frito. ¡Gigante!", price: "$7.000", oldPrice: "$8.500", category: "Sándwiches", categoryId: 5, stock: true, image: "/4.png", isOffer: true, saleType: "unidad" }
  ]);

  const toggleProductStock = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: !p.stock } : p));
  };

  return (
    <ProductsContext.Provider value={{ products, toggleProductStock }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
