import { useCallback, useEffect, useState } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";

interface ScannedProduct {
  id: string;
  timestamp: number;
}

const STORAGE_KEY = "@ecoz:scanned_products";

export default function HistoryScreen() {
  const [products, setProducts] = useState<ScannedProduct[]>([]);
  const router = useRouter();

  const loadScannedProducts = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProducts(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  }, []);

  useEffect(() => {
    loadScannedProducts();
  }, [loadScannedProducts]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = ({ item }: { item: ScannedProduct }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <ThemedText style={styles.itemId}>Product #{item.id}</ThemedText>
      <ThemedText style={styles.itemDate}>
        {formatDate(item.timestamp)}
      </ThemedText>
    </TouchableOpacity>
  );

  if (products.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.emptyText}>
          No products scanned yet.{"\n"}
          Start scanning to build your history!
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}-${item.timestamp}`}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  item: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    marginBottom: 12,
  },
  itemId: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 24,
  },
});
