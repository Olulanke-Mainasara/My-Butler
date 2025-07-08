import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const isDev = process.env.NODE_ENV === "development";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)).*)",
  ],
};

export default async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Respect dev/prod security context
            supabaseResponse.cookies.set(name, value, {
              ...options,
              secure: !isDev,
            });
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              secure: !isDev,
            })
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  if (!user) {
    if (
      url.pathname.startsWith("/profile") ||
      url.pathname.startsWith("/brand-dashboard")
    ) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  } else {
    const role_id = user.user_metadata.role_id;

    if (
      (role_id === 2 && url.pathname.startsWith("/auth")) ||
      (role_id === 2 && url.pathname.startsWith("/brand-dashboard"))
    ) {
      url.pathname = "/profile";
      return NextResponse.redirect(url);
    }

    if (role_id === 4 && !url.pathname.startsWith("/brand-dashboard")) {
      url.pathname = "/brand-dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
