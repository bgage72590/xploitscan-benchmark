import { useEffect } from "react";
import * as Linking from "expo-linking";
import { NavigationContainer, type LinkingOptions } from "@react-navigation/native";
import { supabase } from "./src/lib/supabase";
import { RootStack, type RootStackParamList } from "./src/navigation/RootStack";

// Screens are routed through React Navigation's linking config, which only
// accepts this app's own URLs for the screens listed below. The magic-link
// sign-in bypasses it: it listens for every incoming URL itself and starts a
// session from whatever tokens the link carries, so any web page or app that
// opens fitpal://login-callback?access_token=…&refresh_token=… with the
// attacker's tokens signs the user in to the attacker's account.
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: { screens: { Home: "", Workouts: "workouts", Settings: "settings" } },
};

export default function App() {
  useEffect(() => {
    const subscription = Linking.addEventListener("url", async ({ url }) => {
      const { queryParams } = Linking.parse(url);
      const accessToken = queryParams?.access_token;
      const refreshToken = queryParams?.refresh_token;
      if (typeof accessToken === "string" && typeof refreshToken === "string") {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <RootStack />
    </NavigationContainer>
  );
}
