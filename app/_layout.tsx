import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
    text: "#000",
    card: "#fff",
    border: "#e0e0e0",
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={lightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{
            title: "Product Details",
            presentation: "card",
            headerStyle: {
              backgroundColor: "#fff",
            },
            headerTintColor: "#000",
            headerShadowVisible: false,
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
