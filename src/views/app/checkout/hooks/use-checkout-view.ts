"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useCheckoutMutation, useGetCart } from "@/hooks/api";
import { handleApiError } from "@/lib";
import { useCartStore } from "@/stores";

interface CheckoutChanges {
  hasChanges: boolean;
  removedItems: Array<{ title: string }>;
  updatedItems: Array<{
    title: string;
    oldQuantity: number;
    newQuantity: number;
  }>;
}

export function useCheckoutView() {
  // State
  const [checkoutChanges, setCheckoutChanges] =
    useState<CheckoutChanges | null>(null);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const hasInitialized = useRef(false);

  // Store
  const { items, setItems, getTotalItems, getTotalPrice } = useCartStore();

  // API calls
  const { refetch: fetchCart, isLoading: isFetching } = useGetCart();
  const checkoutMutation = useCheckoutMutation();

  // Computed values
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const hasItems = items.length > 0;
  const isLoading = isFetching || isCreatingOrder;
  const showSkeletons = isInitializing || isFetching;

  // Effects
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeCheckout = async () => {
      if (!hasItems) {
        setIsInitializing(false);
        return;
      }

      try {
        const cartData = await fetchCart();
        const newItems = cartData.data?.data?.items || [];
        setItems(newItems);
      } catch (err) {
        const apiError = handleApiError(err).details;
        toast.error(apiError || "Error al cargar el carrito");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeCheckout();
  }, [fetchCart, hasItems, setItems]);

  // Helpers
  const detectChanges = (
    oldItems: typeof items,
    newItems: typeof items
  ): CheckoutChanges => {
    const removedItems: Array<{ title: string }> = [];
    const updatedItems: Array<{
      title: string;
      oldQuantity: number;
      newQuantity: number;
    }> = [];

    const newMap = new Map(newItems.map(i => [i.productId, i]));
    const oldMap = new Map(oldItems.map(i => [i.productId, i]));

    oldItems.forEach(oldItem => {
      if (!newMap.has(oldItem.productId))
        removedItems.push({ title: oldItem.productTitle });
    });

    newItems.forEach(newItem => {
      const oldItem = oldMap.get(newItem.productId);
      if (oldItem && oldItem.quantity !== newItem.quantity) {
        updatedItems.push({
          title: newItem.productTitle,
          oldQuantity: oldItem.quantity,
          newQuantity: newItem.quantity,
        });
      }
    });

    return {
      hasChanges: removedItems.length > 0 || updatedItems.length > 0,
      removedItems,
      updatedItems,
    };
  };

  // Actions
  const handleCheckout = async () => {
    if (!hasItems) return;

    setIsCreatingOrder(true);
    try {
      const currentItems = [...items];
      const newCartData = await checkoutMutation.mutateAsync();
      const newItems = newCartData.data.items || [];
      const changes = detectChanges(currentItems, newItems);

      setItems(newItems);
      setCheckoutChanges(changes);
      setShowCheckoutDialog(true);
    } catch (err) {
      const apiError = handleApiError(err).details;
      toast.error(apiError || "Error al verificar el carrito");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCreateOrder = () => {
    setShowCheckoutDialog(false);
    setCheckoutChanges(null);
    //TODO: Add order creation logic here
    toast.success("Pedido creado exitosamente!");
  };

  const handleCancelCheckout = () => {
    setShowCheckoutDialog(false);
    setCheckoutChanges(null);
    toast.info("Revisa tu carrito antes de continuar");
  };

  const handleRefreshCart = () => {
    fetchCart();
  };

  return {
    // Cart data
    items,
    cart: {
      totalItems,
      totalPrice,
      hasItems,
    },

    // Checkout state
    checkout: {
      changes: checkoutChanges,
      showDialog: showCheckoutDialog,
    },

    // Loading states
    isLoading,
    isFetching,
    isCreatingOrder,
    isInitializing,
    showSkeletons,

    // Mutation states
    error: checkoutMutation.error,

    // Actions
    actions: {
      handleCheckout,
      handleCreateOrder,
      handleCancelCheckout,
      handleRefreshCart,
    },
  };
}
