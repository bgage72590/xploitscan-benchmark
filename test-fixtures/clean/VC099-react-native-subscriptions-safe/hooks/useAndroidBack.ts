import { useCallback } from "react";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// While the screen is focused, the hardware back button leaves selection mode
// instead of leaving the screen.
export function useAndroidBack(isSelecting: boolean, clearSelection: () => void) {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isSelecting) {
          clearSelection();
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [isSelecting, clearSelection]),
  );
}
