import { useEffect } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

// Handles fitpal:// links from emails and push notifications, e.g.
//   fitpal://auth/callback?token=…   fitpal://open?url=…   fitpal://?screen=…
// Nothing checks where a link came from or what it points at: any web page or
// app can open fitpal://auth/callback?token=<attacker's token> to sign the
// user in to the attacker's account, fitpal://open?url=https://phish.example
// to show a fake login inside the app, or jump to any screen with any params.
export function useDeepLinks() {
  const navigation = useNavigation<any>();
  const { signInWithToken } = useAuth();

  useEffect(() => {
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;
      const { path, queryParams } = Linking.parse(url);
      const params = queryParams ?? {};

      switch (path) {
        case "auth/callback":
          await signInWithToken(String(params.token));
          navigation.navigate("Home");
          break;
        case "open":
          await WebBrowser.openBrowserAsync(String(params.url));
          break;
        default:
          if (params.screen) navigation.navigate(String(params.screen), params);
      }
    };

    Linking.getInitialURL().then(handleDeepLink);
    const subscription = Linking.addEventListener("url", ({ url }) => handleDeepLink(url));
    return () => subscription.remove();
  }, [navigation, signInWithToken]);
}
