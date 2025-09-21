import { productService } from "@/services/product-service";
import SingleProductView from "@/views/single-product-view";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const productDetail = await getProductDetail(id);

  if (!productDetail) {
    return {
      title: "Producto no encontrado - Tienda UCN",
      description: "El producto que buscas no está disponible.",
    };
  }

  return {
    title: `${productDetail.data.brandName} | ${productDetail.data.title} - Tienda UCN`,
    description: `Detalles del producto ${productDetail.data.title} en Tienda UCN.`,
  };
}

const getProductDetail = async (id: string) => {
  try {
    const productDetail = await productService.getProductDetail(id);
    return productDetail.data;
  } catch (error) {
    notFound();
  }
};

export default async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productDetail = await getProductDetail(id);

  return <SingleProductView productDetail={productDetail} />;
}
