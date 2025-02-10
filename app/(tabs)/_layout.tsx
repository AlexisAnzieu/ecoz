import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useThemeColor } from "../../hooks/useThemeColor";

export default function TabLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor,
        },
        tabBarActiveTintColor: tintColor,
        headerStyle: {
          backgroundColor,
        },
        headerTintColor: tintColor,
      }}
    >
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan Product",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="barcode" size={24} color={color} />
          ),
          tabBarLabel: "Scan",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Scan History",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="history" size={24} color={color} />
          ),
          tabBarLabel: "History",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
});
