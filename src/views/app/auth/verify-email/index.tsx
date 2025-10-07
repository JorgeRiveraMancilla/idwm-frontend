import { VerifyEmailCard } from "./components";

interface Props {
  email?: string;
}

export default function VerifyEmailView({ email }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <VerifyEmailCard email={email} />
    </div>
  );
}
