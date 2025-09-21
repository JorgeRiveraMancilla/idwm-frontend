"use client";

import Image from "next/image";
import { Button } from "@/components";
import { CustomerProductData } from "@/models/products/customer-product-data";

interface ProductCardProps {
  product: CustomerProductData;
  onClick?: () => void;
  isPriority?: boolean;
}

export const ProductCard = ({
  product,
  onClick,
  isPriority,
}: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Producto ${product.title} agregado al carrito.`);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition"
      onClick={onClick}
    >
      <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
        <Image
          src={product.mainImageURL}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={isPriority}
          className="object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.title}</h3>
        <p className="mt-2 text-blue-700 font-bold text-xl">{product.price}</p>
        <Button className="mt-4 w-full" onClick={handleAddToCart}>
          Agregar al Carrito
        </Button>
      </div>
    </div>
  );
};
