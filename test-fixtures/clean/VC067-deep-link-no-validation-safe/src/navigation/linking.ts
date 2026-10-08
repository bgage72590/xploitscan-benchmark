import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import type { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "./types";

// React Navigation's linking config: only URLs that start with one of the
// prefixes are handled, and only paths declared under `config.screens` map to
// a screen. Push notifications feed their URL through the same matcher.
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/"), "https://fitpal.app"],
  config: {
    screens: {
      Home: "",
      ResetPassword: "reset-password",
      AcceptInvite: "invite/:code",
      WorkoutList: "workouts",
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url != null) return url;
    const response = await Notifications.getLastNotificationResponseAsync();
    return response?.notification.request.content.data.url;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);
    const eventListenerSubscription = Linking.addEventListener("url", onReceiveURL);
    const pushSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      listener(response.notification.request.content.data.url);
    });
    return () => {
      eventListenerSubscription.remove();
      pushSubscription.remove();
    };
  },
};
