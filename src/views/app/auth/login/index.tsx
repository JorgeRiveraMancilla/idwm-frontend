import { LoginCard } from "./components";

interface Props {
  email?: string;
}

export default function LoginView({ email }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginCard email={email} />
    </div>
  );
}
