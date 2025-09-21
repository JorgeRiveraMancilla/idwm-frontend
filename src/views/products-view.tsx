"use client";

import {
  Button,
  FilterBar,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  ProductCard,
  ProductCardSkeletonGrid,
} from "@/components";
import { useProductsWithFilters } from "@/hooks/use-products";
import { getErrorDetails } from "@/lib/utils";
import { CustomerProductData } from "@/models/products/customer-product-data";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

/*
const products: Product[] = [
  {
    id: 1,
    name: "Polera Negra Hombre",
    price: 25000,
    imageUrl: "/image.png",
  },
  {
    id: 2,
    name: "Computador de escritorio",
    price: 200000,
    imageUrl: "/full_image-1.webp",
  },
  {
    id: 3,
    name: "Audifonos Sony Negros",
    price: 90000,
    imageUrl: "/465984-800-800.webp",
  },
];
*/

export default function ProductsView() {
  const products = useProductsWithFilters();
  const router = useRouter();

  const totalPages = products.data?.products.totalPages ?? 0;
  const totalCount = products.data?.products.totalCount ?? 0;
  const currentPage = products.data?.products.currentPage ?? 1;

  const errorDetails = products.error ? getErrorDetails(products.error) : null;

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push("...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  const pageNumbers = totalPages > 1 ? generatePageNumbers() : [];

  const redirectToProductDetail = (productId: number) => {
    router.push(`/products/product/${productId}`);
  };

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="flex flex-col gap-y-4">
        <h1 className="flex justify-center items-center text-5xl p-2 pt-4 italic">
          Productos disponibles
        </h1>
        <FilterBar
          maxPageSize={totalCount}
          onSearch={products.search}
          onPageSizeChange={products.changePageSize}
          currentPageSize={products.filters.pageSize ?? 1}
          currentSearch={products.filters.searchTerm ?? ""}
        />

        {products.error && (
          <div className="flex justify-center items-center p-8 text-red-500 bg-red-50 border border-red-200 rounded-lg mx-5">
            <div className="text-center">
              <div className="font-semibold">Error al cargar los productos</div>
              <div className="text-sm mt-1">{errorDetails?.message}</div>
              {errorDetails?.canRetry && (
                <Button
                  className="m-2 bg-pink-950"
                  onClick={() =>
                    errorDetails?.canRetry ? products.refetch() : null
                  }
                >
                  Reintentar
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-5 mb-5">
          {products.isLoading ? (
            <ProductCardSkeletonGrid />
          ) : (
            products.data?.products.products.map(
              (product: CustomerProductData) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isPriority={product.mainImageURL.includes("default")}
                  onClick={() => redirectToProductDetail(product.id)}
                />
              ),
            )
          )}
        </div>

        {totalPages > 1 && (
          <Pagination className="p-3 mb-3">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      products.goToPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {pageNumbers.map((pageNum, index) => (
                <PaginationItem key={index}>
                  {pageNum === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        products.goToPage(pageNum as number);
                      }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      products.goToPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {products.data?.products.products.length === 0 &&
          !products.isLoading && (
            <div className="flex justify-center items-center p-8 text-gray-500">
              <div>No se encontraron productos</div>
            </div>
          )}
      </div>
    </Suspense>
  );
}
