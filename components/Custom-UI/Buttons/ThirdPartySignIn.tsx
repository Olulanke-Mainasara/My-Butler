import { Button } from "@/components/Shad-UI/button";
import { Provider } from "@supabase/supabase-js";
import { Icons } from "@/components/Custom-UI/icons";

export const ThirdPartySignIn = ({
  loading,
  handleThirdPartyLogin,
  google,
  facebook,
  apple,
}: {
  loading: boolean;
  handleThirdPartyLogin: (provider: Provider) => void;
  google?: boolean;
  facebook?: boolean;
  apple?: boolean;
}) => {
  return (
    <>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-neutral-200 dark:after:border-neutral-800">
        <span className="relative z-10 bg-white px-2 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
          Or continue with
        </span>
      </div>
      <div className="flex gap-4">
        {apple && (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => handleThirdPartyLogin("apple")}
            className="w-full disabled:opacity-50 hover:bg-darkBackground hover:text-white dark:hover:bg-lightBackground dark:hover:text-black"
          >
            <Icons.apple className="w-6 h-6" />
            <span className="sr-only">Login with Apple</span>
          </Button>
        )}

        {google && (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => handleThirdPartyLogin("google")}
            className="w-full disabled:opacity-50 hover:bg-darkBackground hover:text-white dark:hover:bg-lightBackground dark:hover:text-black"
          >
            <Icons.google className="w-6 h-6" />
            <span className="sr-only">Login with Google</span>
          </Button>
        )}

        {facebook && (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => handleThirdPartyLogin("facebook")}
            className="w-full disabled:opacity-50 hover:bg-darkBackground hover:text-white dark:hover:bg-lightBackground dark:hover:text-black"
          >
            <Icons.facebook className="w-6 h-6" />
            <span className="sr-only">Login with Facebook</span>
          </Button>
        )}
      </div>
    </>
  );
};
