import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LayoutContext } from "@/components/LayoutContext";
import { useDeepLinks } from "@/hooks/useDeepLinks";

export default function RootLayout() {
  const [width, setWidth] = useState(Dimensions.get("window").width);
  useDeepLinks();

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => setWidth(window.width));
    return () => sub?.remove();
  }, []);

  return (
    <LayoutContext.Provider value={{ isTablet: width >= 768 }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </LayoutContext.Provider>
  );
}
