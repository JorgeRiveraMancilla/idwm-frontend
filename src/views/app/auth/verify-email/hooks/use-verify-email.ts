import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/hooks/api";
import { handleApiError } from "@/lib";
import { VerifyEmailRequest } from "@/models/requests";

export const useVerifyEmail = () => {
  const { verifyEmailAsync, isVerifying, verifyError } = useAuth();

  const router = useRouter();

  const handleVerify = async (verifyData: VerifyEmailRequest) => {
    try {
      await verifyEmailAsync(verifyData);
      toast.success("Cuenta verificada exitosamente. Redirigiendo...");
      router.push(`/auth/login?email=${encodeURIComponent(verifyData.email)}`);
    } catch (error) {}
  };

  return {
    handleVerify,
    isLoading: isVerifying,
    error: handleApiError(verifyError).details,
  };
};
