import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from "react-native-reanimated";

interface ProductControlPanelProps {
  onHighlightScore: () => void;
  onExpandDetails: () => void;
  onCompareMode: () => void;
}

export function ProductControlPanel({
  onHighlightScore,
  onExpandDetails,
  onCompareMode,
}: ProductControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(isExpanded ? 0 : 100, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
      opacity: withTiming(isExpanded ? 1 : 0.7),
    };
  }, [isExpanded]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-down" : "chevron-up"}
          size={24}
          color="#007AFF"
        />
      </TouchableOpacity>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={onHighlightScore}>
          <MaterialCommunityIcons name="star" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onExpandDetails}>
          <MaterialCommunityIcons name="text-box" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onCompareMode}>
          <MaterialCommunityIcons name="compare" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  expandButton: {
    alignSelf: "center",
    padding: 8,
    marginBottom: 8,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});
