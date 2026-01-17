import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error,
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
