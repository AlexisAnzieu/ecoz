import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Camera, CameraView, PermissionResponse } from "expo-camera";
import { useCallback, useEffect, useState } from "react";

interface ScannerCameraProps {
  onCodeScanned: (data: string) => void;
}

export function ScannerCamera({ onCodeScanned }: ScannerCameraProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (isScanning) {
        setIsScanning(false);
        onCodeScanned(data);
      }
    },
    [isScanning, onCodeScanned]
  );
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.text}>Requesting camera permission...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              const { status } = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === "granted");
            }}
          >
            <Text style={styles.buttonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <CameraView
      style={styles.camera}
      facing="back"
      barcodeScannerSettings={{
        barcodeTypes: ["ean13", "ean8"],
      }}
      onBarcodeScanned={handleBarCodeScanned}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  button: {
    padding: 20,
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
