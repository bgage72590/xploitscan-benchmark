import React, { useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";

// Refetches the feed when the app comes back to the foreground.
export default function AppStateBanner({ onForeground }) {
  const appState = useRef(AppState.currentState);
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        onForeground();
        setLastRefresh(new Date());
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [onForeground]);

  if (!lastRefresh) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Updated {lastRefresh.toLocaleTimeString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 8, backgroundColor: "#eef2ff" },
  text: { fontSize: 12, color: "#3730a3" },
});
