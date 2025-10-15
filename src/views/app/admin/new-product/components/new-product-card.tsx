import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { NewProductForm } from "./new-product-form";

export function NewProductCard() {
  return (
    <div className="flex gap-x-3.5">
      <div className="flex items-start">
        <Link href="/admin/products">
          <Button
            variant="outline"
            className="flex items-center space-x-2 hover:bg-gray-50 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-6xl mb-6 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Nuevo Producto</CardTitle>
          <CardDescription>
            Ingresa los datos del nuevo producto.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <NewProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
