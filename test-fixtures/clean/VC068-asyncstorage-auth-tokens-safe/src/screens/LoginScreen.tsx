import { useEffect, useState } from "react";
import { Button, Switch, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useAuth } from "../context/AuthContext";

// "Remember me" keeps only the email address; the password is never stored.
// AsyncStorage also holds the Expo push address (so it is registered with the
// backend once), the onboarding flag and the theme — none of them secrets.
export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("rememberedEmail").then((saved) => saved && setEmail(saved));
  }, []);

  const onSubmit = async () => {
    await signIn(email, password);
    if (remember) await AsyncStorage.setItem("rememberedEmail", email);
    else await AsyncStorage.removeItem("rememberedEmail");

    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();
    await AsyncStorage.setItem("expoPushToken", expoPushToken);
    await AsyncStorage.setItem("hasCompletedOnboarding", "true");
    await AsyncStorage.setItem("theme", "system");
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="Email" />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" />
      <View style={{ flexDirection: "row" }}>
        <Switch value={remember} onValueChange={setRemember} />
        <Text>Remember me</Text>
      </View>
      <Button title="Sign in" onPress={onSubmit} />
    </View>
  );
}
