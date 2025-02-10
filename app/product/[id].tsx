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
  const detailsExpanded = useSharedValue(true);
  const compareMode = useSharedValue(false);
  const scrollY = useSharedValue(0);

  const detailsStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(detailsExpanded.value ? 0 : 50, {
          damping: 15,
        }),
      },
    ],
    opacity: withTiming(detailsExpanded.value ? 1 : 0, {
      duration: 300,
    }),
  }));

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(-Math.min(scrollY.value * 0.3, 20)),
      },
    ],
    shadowOpacity: withSpring(Math.min(scrollY.value * 0.003, 0.25)),
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
      <AnimatedScrollView
        style={containerStyle}
        onScroll={({ nativeEvent }) => {
          scrollY.value = nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <AnimatedLayout delay={0}>
          <AnimatedView style={[styles.header, headerStyle]}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.scoreContainer}>
              <EcoScoreIndicator
                score={product.ecoScore}
                highlighted={isScoreHighlighted.value}
              />
            </View>
          </AnimatedView>
        </AnimatedLayout>

        <AnimatedLayout delay={200}>
          <AnimatedView style={[styles.section, detailsStyle]}>
            <Text style={styles.sectionTitle}>Environmental Impact</Text>
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>CO2 Emission</Text>
                <View style={styles.gridValueContainer}>
                  <Text style={styles.gridValue}>{product.co2Emission}</Text>
                </View>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Recyclable</Text>
                <View
                  style={[
                    styles.gridValueContainer,
                    product.recyclable
                      ? styles.positiveValue
                      : styles.negativeValue,
                  ]}
                >
                  <Text style={[styles.gridValue, styles.iconText]}>
                    {product.recyclable ? "Yes ✓" : "No ✗"}
                  </Text>
                </View>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Sustainable</Text>
                <View
                  style={[
                    styles.gridValueContainer,
                    product.sustainableSourcing
                      ? styles.positiveValue
                      : styles.negativeValue,
                  ]}
                >
                  <Text style={[styles.gridValue, styles.iconText]}>
                    {product.sustainableSourcing ? "Yes ✓" : "No ✗"}
                  </Text>
                </View>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>Packaging</Text>
                <View style={styles.gridValueContainer}>
                  <Text style={styles.gridValue}>{product.packaging}</Text>
                </View>
              </View>
            </View>
          </AnimatedView>
        </AnimatedLayout>

        <AnimatedLayout delay={400}>
          <AnimatedView style={[styles.section, detailsStyle]}>
            <Text style={styles.sectionTitle}>Tips for Eco-friendly Use</Text>
            <View style={styles.tipsGrid}>
              <View style={styles.tipItem}>
                <Text style={styles.tipTitle}>Recycling</Text>
                <Text style={styles.tipText}>
                  Proper recycling instructions
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipTitle}>Alternatives</Text>
                <Text style={styles.tipText}>Eco-friendly product options</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipTitle}>Impact</Text>
                <Text style={styles.tipText}>
                  Ways to reduce environmental impact
                </Text>
              </View>
            </View>
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
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 32,
    backgroundColor: "#ffffff",
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
    fontSize: 32,
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
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#2c3e50",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: -8,
  },
  gridItem: {
    width: "50%",
    padding: 8,
  },
  gridLabel: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 8,
    fontWeight: "500",
  },
  gridValueContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  gridValue: {
    fontSize: 15,
    color: "#212529",
    textAlign: "center",
  },
  iconText: {
    fontWeight: "600",
  },
  positiveValue: {
    backgroundColor: "#e8f5e9",
    borderColor: "#c8e6c9",
  },
  negativeValue: {
    backgroundColor: "#ffebee",
    borderColor: "#ffcdd2",
  },
  tipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: -8,
  },
  tipItem: {
    width: "33.33%",
    padding: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
    textAlign: "center",
  },
  tipText: {
    fontSize: 13,
    color: "#495057",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
});
