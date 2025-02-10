import { useLocalSearchParams } from "expo-router";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { EcoScoreIndicator } from "../../components/EcoScoreIndicator";
import { ProductControlPanel } from "../../components/ProductControlPanel";
import { AnimatedLayout } from "../../components/AnimatedLayout";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedView = Animated.createAnimatedComponent(View);

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
  "9876543210": {
    name: "Plastic Food Container",
    ecoScore: 4.8,
    co2Emission: "3.5kg CO2e",
    recyclable: true,
    sustainableSourcing: false,
    packaging: "Mixed materials, partially recyclable",
  },
  "5432109876": {
    name: "Glass Jar with Metal Lid",
    ecoScore: 7.2,
    co2Emission: "2.1kg CO2e",
    recyclable: true,
    sustainableSourcing: true,
    packaging: "Fully recyclable materials",
  },
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

  const isScoreHighlighted = useSharedValue(false);
  const detailsExpanded = useSharedValue(false);
  const compareMode = useSharedValue(false);

  const detailsStyle = useAnimatedStyle(() => ({
    height: withSpring(detailsExpanded.value ? "auto" : 0, {
      damping: 15,
    }),
    opacity: withSpring(detailsExpanded.value ? 1 : 0),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(compareMode.value ? 0.9 : 1, {
          damping: 15,
        }),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <AnimatedScrollView style={containerStyle}>
        <AnimatedLayout delay={0}>
          <View style={styles.header}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.scoreContainer}>
              <EcoScoreIndicator
                score={product.ecoScore}
                highlighted={isScoreHighlighted.value}
              />
            </View>
          </View>
        </AnimatedLayout>

        <AnimatedLayout delay={200}>
          <AnimatedView style={[styles.section, detailsStyle]}>
            <Text style={styles.sectionTitle}>Environmental Impact</Text>
            <Text style={styles.detail}>
              CO2 Emission: {product.co2Emission}
            </Text>
            <Text style={styles.detail}>
              Recyclable: {product.recyclable ? "Yes ✓" : "No ✗"}
            </Text>
            <Text style={styles.detail}>
              Sustainable Sourcing:{" "}
              {product.sustainableSourcing ? "Yes ✓" : "No ✗"}
            </Text>
            <Text style={styles.detail}>Packaging: {product.packaging}</Text>
          </AnimatedView>
        </AnimatedLayout>

        <AnimatedLayout delay={400}>
          <AnimatedView style={[styles.section, detailsStyle]}>
            <Text style={styles.sectionTitle}>Tips for Eco-friendly Use</Text>
            <Text style={styles.detail}>
              • Proper recycling instructions{"\n"}• Alternative eco-friendly
              products{"\n"}• Ways to reduce environmental impact
            </Text>
          </AnimatedView>
        </AnimatedLayout>
      </AnimatedScrollView>

      <ProductControlPanel
        onHighlightScore={() => {
          isScoreHighlighted.value = !isScoreHighlighted.value;
        }}
        onExpandDetails={() => {
          detailsExpanded.value = !detailsExpanded.value;
        }}
        onCompareMode={() => {
          compareMode.value = !compareMode.value;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 24,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  productName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#000",
  },
  scoreContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  section: {
    margin: 16,
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  detail: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: 12,
    borderRadius: 8,
    color: "#000",
  },
});
