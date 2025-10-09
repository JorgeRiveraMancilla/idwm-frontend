import { toast } from "sonner";

import { useResendCodeMutation } from "@/hooks/api";
import { handleApiError } from "@/lib";

export const useResendCode = () => {
  const { mutateAsync: resendCodeAsync, isPending: isResending } =
    useResendCodeMutation();

  const handleResend = async (email: string) => {
    try {
      await resendCodeAsync(email);
      toast.success("Código reenviado exitosamente. Revisa tu email.");
    } catch (error) {
      const errorMessage = handleApiError(error).details;

      if (errorMessage?.includes("Object")) {
        toast.error(
          "Su cuenta ha sido deshabilitada. Contacte al administrador o cree una nueva cuenta."
        );
      } else {
        toast.error(
          errorMessage || "Error al reenviar el código. Inténtalo de nuevo."
        );
      }
    }
  };

  return {
    handleResend,
    isLoading: isResending,
  };
};
