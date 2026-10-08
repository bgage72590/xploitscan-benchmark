import { useEffect } from "react";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

const DEEP_LINK_ROUTES = new Set(["reset-password", "invite"]);

// Routes incoming acme:// links (password reset, invites) while the app is open.
export function useDeepLinks() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const { path, queryParams } = Linking.parse(url);
      if (path && DEEP_LINK_ROUTES.has(path)) {
        router.push({ pathname: `/${path}`, params: { token: String(queryParams?.token ?? "") } });
      }
    });
    return () => subscription.remove();
  }, [router]);
}
