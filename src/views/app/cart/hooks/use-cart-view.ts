import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  useClearCartMutation,
  useGetCart,
  useRemoveItemFromCartMutation,
  useUpdateQuantityMutation,
} from "@/hooks/api";
import { handleApiError } from "@/lib/api";
import { CartItemRequest } from "@/models/requests";
import { useCartStore } from "@/stores";

export function useCartView() {
  const { items, setItems, getTotalItems, getTotalPrice } = useCartStore();

  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const {
    data: cart,
    refetch: fetchCart,
    isLoading: isFetching,
  } = useGetCart();
  const updateQuantityMutation = useUpdateQuantityMutation();
  const removeItemMutation = useRemoveItemFromCartMutation();
  const clearCartMutation = useClearCartMutation();

  useEffect(() => {
    if (cart) setItems(cart.data.items);
  }, [cart, setItems]);

  const handleQuantityChange = async (item: CartItemRequest) => {
    if (item.quantity < 1) return;
    setIsMutating(true);
    try {
      const updatedCart = await updateQuantityMutation.mutateAsync(item);
      setItems(updatedCart.data.items);
      toast.success("Cantidad actualizada");
    } catch (err) {
      const apiError = handleApiError(err).details;
      toast.error(apiError || "Error actualizando cantidad");
    } finally {
      setIsMutating(false);
    }
  };

  const handleRemoveWithConfirmation = (itemId: string) =>
    setItemToRemove(itemId);

  const confirmRemove = async () => {
    if (!itemToRemove) return;
    setIsMutating(true);
    try {
      const updatedCart = await removeItemMutation.mutateAsync(itemToRemove);
      setItems(updatedCart.data.items);
      toast.success("Producto eliminado del carrito");
      setItemToRemove(null);
    } catch (err) {
      const apiError = handleApiError(err).details;
      toast.error(apiError || "Error eliminando producto");
    } finally {
      setIsMutating(false);
    }
  };
  const cancelRemove = () => setItemToRemove(null);

  const handleClearWithConfirmation = () => setClearingCart(true);
  const confirmClean = async () => {
    if (!clearingCart) return;
    setIsMutating(true);
    try {
      const updatedCart = await clearCartMutation.mutateAsync();
      setItems(updatedCart.data.items);
      toast.success("Carrito vaciado");
      setClearingCart(false);
    } catch (err) {
      const apiError = handleApiError(err).details;
      toast.error(apiError || "Error vaciando carrito");
    } finally {
      setIsMutating(false);
    }
  };

  const cancelClean = () => setClearingCart(false);

  return {
    items,
    isLoading: isFetching || isMutating,
    totalItems,
    totalPrice,
    itemToRemove,
    clearingCart,
    handleQuantityChange,
    handleRemoveWithConfirmation,
    confirmRemove,
    cancelRemove,
    handleClearWithConfirmation,
    confirmClean,
    cancelClean,
    fetchCart,
  };
}
