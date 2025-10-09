import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useRegisterMutation } from "@/hooks/api";
import { handleApiError } from "@/lib/api";
import { RegisterRequest } from "@/models/requests";

export const useRegister = () => {
  const { mutateAsync: registerAsync, isPending: isRegistering } =
    useRegisterMutation();

  const router = useRouter();

  const handleRegister = async (registerData: RegisterRequest) => {
    try {
      await registerAsync(registerData);

      toast.success(
        "Registro exitoso. Revisa tu email para el código de verificación"
      );

      router.push(
        `/auth/verify-email?email=${encodeURIComponent(registerData.email)}`
      );
    } catch (error) {
      const apiError = handleApiError(error);

      if (apiError.details?.includes("You can only send")) {
        toast.error(
          "Sólo puedes registrar cuentas con el correo utilizado para el servicio de Resend."
        );
      } else {
        toast.error(apiError.details || "Error al registrar usuario");
      }
    }
  };

  return {
    handleRegister,
    isLoading: isRegistering,
  };
};
