import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: "#fff",
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "rgba(0, 0, 0, 0.4)",
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
        headerShadowVisible: false,
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
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
});
