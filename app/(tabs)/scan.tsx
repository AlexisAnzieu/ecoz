import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { ScannerCamera } from "../../components/Scanner/Camera";

const STORAGE_KEY = "@ecoz:scanned_products";

export default function ScanScreen() {
  const router = useRouter();

  const handleBarcodeScan = async (barcode: string) => {
    try {
      // Save to history
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      const history = storedData ? JSON.parse(storedData) : [];
      const newProduct = {
        id: barcode,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([newProduct, ...history])
      );

      // Navigate to product details
      router.push(`/product/${barcode}`);
    } catch (error) {
      console.error("Failed to save product:", error);
      router.push(`/product/${barcode}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScannerCamera onCodeScanned={handleBarcodeScan} />
      <ThemedView style={styles.overlay}>
        <ThemedText style={styles.overlayText}>
          Scan a product barcode
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
