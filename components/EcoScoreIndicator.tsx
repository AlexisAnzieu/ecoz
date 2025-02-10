import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from "react-native-reanimated";

interface EcoScoreIndicatorProps {
  score: number;
  size?: number;
  highlighted?: boolean;
}

export function EcoScoreIndicator({
  score,
  size = 160,
  highlighted = false,
}: EcoScoreIndicatorProps) {
  const getScoreColor = (score: number) => {
    if (score >= 7.5) return "#4CAF50";
    if (score >= 5) return "#FFC107";
    return "#F44336";
  };

  const animatedStyle = useAnimatedStyle(() => {
    if (highlighted) {
      return {
        transform: [
          {
            scale: withSequence(
              withSpring(1.1, { damping: 3 }),
              withDelay(100, withSpring(1, { damping: 3 }))
            ),
          },
        ],
      };
    }
    return {
      transform: [{ scale: withSpring(1) }],
    };
  }, [highlighted]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getScoreColor(score),
        },
        animatedStyle,
      ]}
    >
      <Text style={styles.scoreText}>{score.toFixed(1)}</Text>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>ECO SCORE</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  labelContainer: {
    position: "absolute",
    bottom: "20%",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 1,
  },
});
