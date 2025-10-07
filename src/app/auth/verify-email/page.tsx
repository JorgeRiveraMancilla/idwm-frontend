import VerifyEmailView from "@/views/app/auth/verify-email";

export const metadata = {
  title: "Verificar Correo - Tienda UCN",
  description: "Página para verificar el correo electrónico del usuario.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <VerifyEmailView email={email} />;
}
