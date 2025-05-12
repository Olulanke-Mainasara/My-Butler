import { SignupForm } from "./signup-form";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 xl:p-10">
      <div className="w-full max-w-sm md:max-w-6xl max-h-[80dvh] md:max-h-[70vh] overflow-scroll xl:max-h-[85dvh]">
        <SignupForm />
      </div>
    </div>
  );
}
