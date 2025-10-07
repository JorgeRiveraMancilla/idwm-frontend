import LoginView from "@/views/app/auth/login";

export const metadata = {
  title: "Inicio de Sesión - Tienda UCN",
  description: "Página para que los usuarios inicien sesión en la plataforma.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return <LoginView email={email} />;
}
