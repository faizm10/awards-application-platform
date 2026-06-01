import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Paths reachable without a Supabase session. */
const PUBLIC_PATH_PREFIXES = [
  "/",
  "/auth",
  "/awards",
  "/login",
];

const ADMIN_PATH_PREFIX = "/admin-dashboard";
const REVIEWER_PATH_PREFIX = "/reviewer-dashboard";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => prefix !== "/" && pathname.startsWith(prefix)
  );
}

function seedRoleFromEmail(
  email: string | undefined
): "student" | "reviewer" | "admin" | null {
  if (!email) return null;
  if (email === "admin@uoguelph.ca") return "admin";
  if (email === "reviewer@uoguelph.ca") return "reviewer";
  return null;
}

export async function updateSession(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value }) =>
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
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user) {
    let userType: "student" | "reviewer" | "admin" | null = null;

    if (
      pathname.startsWith(ADMIN_PATH_PREFIX) ||
      pathname.startsWith(REVIEWER_PATH_PREFIX)
    ) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .maybeSingle();

      userType =
        profile?.user_type ?? seedRoleFromEmail(user.email) ?? "student";

      if (
        pathname.startsWith(ADMIN_PATH_PREFIX) &&
        userType !== "admin"
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/awards";
        return NextResponse.redirect(url);
      }

      if (
        pathname.startsWith(REVIEWER_PATH_PREFIX) &&
        userType !== "reviewer" &&
        userType !== "admin"
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/awards";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
