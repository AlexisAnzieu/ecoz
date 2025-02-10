import { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface ScannedProduct {
  id: string;
  timestamp: number;
  name?: string;
  score?: number;
}

// Import mock products data
const mockProductsData = {
  "0123456789": {
    name: "Eco-friendly Water Bottle",
    score: 8.5,
  },
  "9876543210": {
    name: "Plastic Food Container",
    score: 4.8,
  },
  "5432109876": {
    name: "Glass Jar with Metal Lid",
    score: 7.2,
  },
};

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
    const initializeHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!stored) {
          // Add mock products if no history exists
          const mockProducts = [
            {
              id: "0123456789",
              timestamp: Date.now(),
              ...mockProductsData["0123456789"],
            },
            {
              id: "9876543210",
              timestamp: Date.now() - 24 * 60 * 60 * 1000,
              ...mockProductsData["9876543210"],
            },
            {
              id: "5432109876",
              timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
              ...mockProductsData["5432109876"],
            },
          ];
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockProducts));
        }
        loadScannedProducts();
      } catch (error) {
        console.error("Failed to initialize history:", error);
      }
    };

    initializeHistory();
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
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>
          {item.name || `Product #${item.id}`}
        </Text>
        {item.score && (
          <View
            style={[
              styles.scoreIndicator,
              {
                backgroundColor:
                  item.score >= 7.5
                    ? "#4CAF50"
                    : item.score >= 5
                    ? "#FFC107"
                    : "#F44336",
              },
            ]}
          >
            <Text style={styles.scoreText}>{item.score.toFixed(1)}</Text>
          </View>
        )}
      </View>
      <Text style={styles.itemDate}>{formatDate(item.timestamp)}</Text>
    </TouchableOpacity>
  );

  if (products.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>
          No products scanned yet.{"\n"}
          Start scanning to build your history!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}-${item.timestamp}`}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  item: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  scoreIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  scoreText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  itemDate: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
});
