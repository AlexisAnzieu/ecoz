import { useLocalSearchParams } from "expo-router";
import { StyleSheet, ScrollView } from "react-native";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";

// Mock ecological data - in real app, this would come from an API
const mockProducts: Record<
  string,
  {
    name: string;
    ecoScore: number;
    co2Emission: string;
    recyclable: boolean;
    sustainableSourcing: boolean;
    packaging: string;
  }
> = {
  "0123456789": {
    name: "Eco-friendly Water Bottle",
    ecoScore: 8.5,
    co2Emission: "1.2kg CO2e",
    recyclable: true,
    sustainableSourcing: true,
    packaging: "100% recycled materials",
  },
  // Add more mock products as needed
};

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = mockProducts[id] || {
    name: "Product Not Found",
    ecoScore: 0,
    co2Emission: "N/A",
    recyclable: false,
    sustainableSourcing: false,
    packaging: "N/A",
  };

  const getScoreColor = (score: number) => {
    if (score >= 7.5) return "#4CAF50";
    if (score >= 5) return "#FFC107";
    return "#F44336";
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.productName}>{product.name}</ThemedText>
        <ThemedView
          style={[
            styles.scoreContainer,
            { backgroundColor: getScoreColor(product.ecoScore) },
          ]}
        >
          <ThemedText style={styles.scoreText}>
            {product.ecoScore.toFixed(1)}
          </ThemedText>
          <ThemedText style={styles.scoreLabel}>Eco Score</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>
          Environmental Impact
        </ThemedText>
        <ThemedText style={styles.detail}>
          CO2 Emission: {product.co2Emission}
        </ThemedText>
        <ThemedText style={styles.detail}>
          Recyclable: {product.recyclable ? "Yes ✓" : "No ✗"}
        </ThemedText>
        <ThemedText style={styles.detail}>
          Sustainable Sourcing: {product.sustainableSourcing ? "Yes ✓" : "No ✗"}
        </ThemedText>
        <ThemedText style={styles.detail}>
          Packaging: {product.packaging}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>
          Tips for Eco-friendly Use
        </ThemedText>
        <ThemedText style={styles.detail}>
          • Proper recycling instructions{"\n"}• Alternative eco-friendly
          products{"\n"}• Ways to reduce environmental impact
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scoreContainer: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  scoreLabel: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
});
