import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProductsProvider } from "@/context/ProductsContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Quadra Pizza | Catálogo",
  description: "Catálogo de productos de Quadra Pizza - Rotisería y Pizzería",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-zinc-950 text-zinc-50 antialiased">
        <ProductsProvider>
          {children}
        </ProductsProvider>
      </body>
    </html>
  );
}
