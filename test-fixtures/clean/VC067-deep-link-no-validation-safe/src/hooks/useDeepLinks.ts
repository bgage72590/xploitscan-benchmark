import { useEffect } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";

// Handles fitpal:// and https://fitpal.app links from emails and push
// notifications. A link is only acted on if its scheme and host are ours, it
// names a known route, and any URL it carries points at one of our own hosts.
// Sign-in never happens from a link: auth callbacks go through
// expo-auth-session, which checks the PKCE state it started.
const ALLOWED_SCHEMES = new Set(["fitpal", "https"]);
const ALLOWED_HOSTS = new Set(["fitpal.app", "www.fitpal.app"]);
const ROUTES: Record<string, string> = {
  "reset-password": "ResetPassword",
  "invite": "AcceptInvite",
  "workouts": "WorkoutList",
};

function isTrustedHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const target = new URL(value);
    return target.protocol === "https:" && ALLOWED_HOSTS.has(target.hostname);
  } catch {
    return false;
  }
}

export function useDeepLinks() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;
      const { scheme, hostname, path, queryParams } = Linking.parse(url);
      if (!scheme || !ALLOWED_SCHEMES.has(scheme)) return;
      if (scheme === "https" && (!hostname || !ALLOWED_HOSTS.has(hostname))) return;

      const params = queryParams ?? {};
      if (path === "open") {
        if (isTrustedHttpsUrl(params.url)) await WebBrowser.openBrowserAsync(params.url);
        return;
      }
      const screen = path ? ROUTES[path] : undefined;
      if (screen) navigation.navigate(screen, { code: params.code, token: params.token });
    };

    Linking.getInitialURL().then(handleDeepLink);
    const subscription = Linking.addEventListener("url", ({ url }) => handleDeepLink(url));
    return () => subscription.remove();
  }, [navigation]);
}
