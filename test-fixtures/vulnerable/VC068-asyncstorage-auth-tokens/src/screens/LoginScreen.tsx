import { useState } from "react";
import { Button, Switch, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

// "Remember me" saves the raw password so the form can be pre-filled.
export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const onSubmit = async () => {
    await signIn(email, password);
    if (remember) {
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
    }
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
