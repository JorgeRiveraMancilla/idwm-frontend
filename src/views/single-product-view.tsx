"use client";

import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components";
import { ProductDetail } from "@/models/products/product-detail";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SingleProductView({
  productDetail,
}: {
  productDetail: ProductDetail;
}) {
  const router = useRouter();

  const handleGoToProducts = () => {
    router.push("/products");
  };

  const discountedPrice = (price: string, discount: number) => {
    return (parseFloat(price) * (1 - discount)).toFixed(2);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          variant="outline"
          onClick={handleGoToProducts}
          className="flex items-center space-x-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Imágenes del Producto
          </h2>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {productDetail?.data?.imagesURL.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full">
                      <Image
                        src={image}
                        alt={`Product Image ${index + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover rounded-lg"
                        style={{ aspectRatio: "auto" }}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Información del Producto
          </h2>

          {/* Brand and Title */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
              {productDetail?.data?.brandName || "Marca no disponible"}
            </h2>
            <h1 className="text-2xl text-gray-700">
              {productDetail?.data?.title || "Título no disponible"}
            </h1>
          </div>

          {/* Price Section */}
          <div className="space-y-1">
            {productDetail?.data?.discount ? (
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-bold text-green-600">
                  {discountedPrice(
                    productDetail?.data?.price,
                    productDetail?.data?.discount,
                  )}
                </h3>
                <h4 className="text-lg line-through text-gray-500">
                  {productDetail?.data?.price}
                </h4>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                  -{Math.round(productDetail?.data?.discount * 100)}%
                </span>
              </div>
            ) : (
              <h3 className="text-2xl font-bold text-blue-600">
                {productDetail?.data?.price}
              </h3>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cantidad:
            </label>
            <div className="flex items-center justify-start space-x-3 bg-gray-50 p-2 rounded-lg w-fit">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="px-4">
                <div className="text-xl font-bold tracking-tighter min-w-[2rem] text-center">
                  1
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full py-3 text-lg font-semibold">
            Añadir al carro
          </Button>
        </div>
      </div>

      {/* Product Description Section*/}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Detalles del Producto
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700 w-1/4">
                  Característica
                </th>
                <th className="text-left p-3 border-b border-gray-200 font-semibold text-gray-700">
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-100 font-medium text-gray-600">
                  Descripción
                </td>
                <td className="p-3 border-b border-gray-100 text-gray-800">
                  {productDetail?.data?.description || "No disponible"}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-100 font-medium text-gray-600">
                  Categoría
                </td>
                <td className="p-3 border-b border-gray-100 text-gray-800">
                  {productDetail?.data?.categoryName || "No disponible"}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-600">Estado</td>
                <td className="p-3 text-gray-800">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      productDetail?.data?.statusName === "New"
                        ? "bg-green-100 text-green-800"
                        : productDetail?.data?.statusName === "Used"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {productDetail?.data?.statusName === "New"
                      ? "Nuevo"
                      : productDetail?.data?.statusName === "Used"
                        ? "Usado"
                        : ""}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
